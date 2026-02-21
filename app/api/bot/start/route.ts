import { NextResponse } from "next/server"
import { startBot, getBotState } from "@/lib/bot-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { razorpayxKeyId, razorpayxKeySecret, razorpayxAccountNumber, privateKey, relayerUrl, callbackUrl, botPort } = body

    if (!razorpayxKeyId || !razorpayxKeySecret || !razorpayxAccountNumber) {
      return NextResponse.json(
        { success: false, error: "Missing RazorpayX credentials" },
        { status: 400 }
      )
    }

    // Check if already running
    const current = getBotState()
    if (current.status === "online") {
      return NextResponse.json({
        success: true,
        message: "Bot is already running",
        ...current,
      })
    }

    const state = await startBot({
      razorpayxKeyId,
      razorpayxKeySecret,
      razorpayxAccountNumber,
      privateKey,
      relayerUrl,
      callbackUrl,
      botPort,
    })

    return NextResponse.json({
      success: state.status === "online" || state.status === "starting",
      message:
        state.status === "online"
          ? "Bot started successfully"
          : state.status === "starting"
          ? "Bot is starting..."
          : `Bot failed to start: ${state.error}`,
      ...state,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
