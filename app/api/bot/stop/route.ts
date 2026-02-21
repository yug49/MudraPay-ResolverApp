import { NextResponse } from "next/server"
import { stopBot } from "@/lib/bot-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const state = await stopBot()

    return NextResponse.json({
      success: true,
      message: "Bot stopped",
      ...state,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
