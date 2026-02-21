/**
 * Bot Process Manager
 *
 * Manages the lifecycle of the resolver bot child process.
 * Handles port allocation, process spawning, and status tracking.
 *
 * IMPORTANT: This module runs server-side only (Next.js API routes).
 */

import { spawn, ChildProcess } from "child_process"
import path from "path"
import net from "net"

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BotConfig {
  razorpayxKeyId: string
  razorpayxKeySecret: string
  razorpayxAccountNumber: string
  privateKey?: string
  relayerUrl?: string
  clearNodeUrl?: string
  callbackUrl?: string
  botPort?: number
}

export type BotStatus = "offline" | "starting" | "online" | "error" | "stopping"

export interface BotState {
  status: BotStatus
  port: number | null
  pid: number | null
  walletAddress: string | null
  startedAt: number | null
  error: string | null
  logs: string[]
}

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_RELAYER_URL =
  "https://38dcd64109bf36f6009ef1c7364901cd3c56e38b-5000.dstack-pha-prod9.phala.network"
const DEFAULT_CLEARNODE_URL = "wss://clearnet-sandbox.yellow.com/ws"
const PORT_RANGE_START = 4000
const PORT_RANGE_END = 4100
const MAX_LOG_LINES = 200

// Bot source directory — sibling to this app
const BOT_DIR = path.resolve(process.cwd(), "..", "MudraPay-Resolver-bot-example")

// ─── Singleton State ─────────────────────────────────────────────────────────

let botProcess: ChildProcess | null = null
let botState: BotState = {
  status: "offline",
  port: null,
  pid: null,
  walletAddress: null,
  startedAt: null,
  error: null,
  logs: [],
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Check if a TCP port is available */
function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer()
    server.once("error", () => resolve(false))
    server.once("listening", () => {
      server.close(() => resolve(true))
    })
    server.listen(port, "127.0.0.1")
  })
}

/** Find an available port in the configured range */
async function findAvailablePort(preferredPort?: number): Promise<number> {
  // Try preferred port first
  if (preferredPort && preferredPort >= PORT_RANGE_START && preferredPort <= PORT_RANGE_END) {
    if (await isPortAvailable(preferredPort)) return preferredPort
  }

  // Scan the range
  for (let port = PORT_RANGE_START; port <= PORT_RANGE_END; port++) {
    if (await isPortAvailable(port)) return port
  }

  throw new Error(`No available ports in range ${PORT_RANGE_START}-${PORT_RANGE_END}`)
}

/** Append a log line (capped at MAX_LOG_LINES) */
function appendLog(line: string) {
  botState.logs.push(line)
  if (botState.logs.length > MAX_LOG_LINES) {
    botState.logs = botState.logs.slice(-MAX_LOG_LINES)
  }
}

/**
 * Generate a random private key (64 hex chars)
 * Used when no private key is provided
 */
function generatePrivateKey(): string {
  const bytes = new Uint8Array(32)
  // Use Node.js crypto
  const crypto = require("crypto") as typeof import("crypto")
  crypto.getRandomValues(bytes)
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

// Persistent private key — generated once and reused across restarts
let persistedPrivateKey: string | null = null

function getOrCreatePrivateKey(providedKey?: string): string {
  if (providedKey) return providedKey
  if (persistedPrivateKey) return persistedPrivateKey

  // Try to read from file
  const fs = require("fs") as typeof import("fs")
  const keyFile = path.join(process.cwd(), ".resolver-bot-key")
  try {
    const existing = fs.readFileSync(keyFile, "utf-8").trim()
    if (existing && existing.length === 64) {
      persistedPrivateKey = existing
      return existing
    }
  } catch {
    // File doesn't exist yet
  }

  // Generate new key
  const newKey = generatePrivateKey()
  try {
    fs.writeFileSync(keyFile, newKey, { mode: 0o600 })
  } catch {
    // If we can't write, that's fine — key lives in memory
  }
  persistedPrivateKey = newKey
  return newKey
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Get current bot state */
export function getBotState(): BotState {
  return { ...botState, logs: [...botState.logs] }
}

/** Start the resolver bot */
export async function startBot(config: BotConfig): Promise<BotState> {
  // Already running?
  if (botProcess && botState.status === "online") {
    return getBotState()
  }

  // If starting, wait
  if (botState.status === "starting") {
    return getBotState()
  }

  botState = {
    status: "starting",
    port: null,
    pid: null,
    walletAddress: null,
    startedAt: null,
    error: null,
    logs: [],
  }

  try {
    // 1. Find available port
    const port = await findAvailablePort(config.botPort)
    botState.port = port
    appendLog(`[bot-manager] Allocated port ${port}`)

    // 2. Get or create private key
    const privateKey = getOrCreatePrivateKey(config.privateKey)
    appendLog(`[bot-manager] Private key ready`)

    // 3. Build callback URL
    const callbackUrl = config.callbackUrl || `http://localhost:${port}`

    // 4. Build environment
    const env: Record<string, string> = {
      ...process.env as Record<string, string>,
      PRIVATE_KEY: privateKey,
      BOT_PORT: String(port),
      BOT_CALLBACK_URL: callbackUrl,
      RELAYER_URL: config.relayerUrl || DEFAULT_RELAYER_URL,
      CLEARNODE_URL: config.clearNodeUrl || DEFAULT_CLEARNODE_URL,
      APP_NAME: "MudraPay",
      RAZORPAYX_KEY_ID: config.razorpayxKeyId,
      RAZORPAYX_KEY_SECRET: config.razorpayxKeySecret,
      RAZORPAYX_ACCOUNT_NUMBER: config.razorpayxAccountNumber,
      ENABLE_ZK_PROOF: "false",
    }

    appendLog(`[bot-manager] Spawning bot from: ${BOT_DIR}`)
    appendLog(`[bot-manager] Relayer URL: ${env.RELAYER_URL}`)
    appendLog(`[bot-manager] Callback URL: ${callbackUrl}`)

    // 5. Spawn the bot process
    const child: ChildProcess = spawn("node", ["src/index.js"], {
      cwd: BOT_DIR,
      env: env as NodeJS.ProcessEnv,
      stdio: ["ignore", "pipe", "pipe"],
      detached: false,
    })

    botProcess = child
    botState.pid = child.pid ?? null

    // 6. Capture stdout
    child.stdout?.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n").filter(Boolean)
      for (const line of lines) {
        appendLog(line)

        // Detect wallet address from bot output
        if (line.includes("Wallet Address:")) {
          const match = line.match(/0x[a-fA-F0-9]{40}/)
          if (match) botState.walletAddress = match[0]
        }

        // Detect when bot is fully online
        if (line.includes("Resolver API server running") || line.includes("Bot is running")) {
          botState.status = "online"
          botState.startedAt = Date.now()
        }
      }
    })

    // 7. Capture stderr
    child.stderr?.on("data", (data: Buffer) => {
      const lines = data.toString().split("\n").filter(Boolean)
      for (const line of lines) {
        appendLog(`[stderr] ${line}`)
      }
    })

    // 8. Handle process exit
    child.on("exit", (code: number | null, signal: string | null) => {
      appendLog(`[bot-manager] Process exited: code=${code}, signal=${signal}`)
      botProcess = null

      if (botState.status === "stopping") {
        botState.status = "offline"
      } else if (code !== 0) {
        botState.status = "error"
        botState.error = `Process exited with code ${code}`
      } else {
        botState.status = "offline"
      }
    })

    child.on("error", (err: Error) => {
      appendLog(`[bot-manager] Process error: ${err.message}`)
      botState.status = "error"
      botState.error = err.message
      botProcess = null
    })

    // 9. Wait a bit for the bot to start (up to 15s)
    await new Promise<void>((resolve) => {
      let checks = 0
      const interval = setInterval(() => {
        checks++
        if (botState.status === "online" || botState.status === "error" || checks >= 30) {
          clearInterval(interval)
          // If still "starting" after 15s, mark as online anyway (it might just be slow)
          if (botState.status === "starting") {
            botState.status = "online"
            botState.startedAt = Date.now()
          }
          resolve()
        }
      }, 500)
    })

    return getBotState()
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    botState.status = "error"
    botState.error = msg
    appendLog(`[bot-manager] Error: ${msg}`)
    return getBotState()
  }
}

/** Stop the resolver bot */
export async function stopBot(): Promise<BotState> {
  if (!botProcess) {
    botState.status = "offline"
    return getBotState()
  }

  botState.status = "stopping"
  appendLog("[bot-manager] Sending SIGTERM to bot process")

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      // Force kill if not stopped after 5s
      if (botProcess) {
        appendLog("[bot-manager] Force killing bot process (SIGKILL)")
        botProcess.kill("SIGKILL")
      }
    }, 5000)

    botProcess!.once("exit", () => {
      clearTimeout(timeout)
      botProcess = null
      botState.status = "offline"
      botState.port = null
      botState.pid = null
      appendLog("[bot-manager] Bot stopped successfully")
      resolve(getBotState())
    })

    botProcess!.kill("SIGTERM")
  })
}
