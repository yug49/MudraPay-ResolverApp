import { NextResponse } from "next/server"
import { getBotState } from "@/lib/bot-manager"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const state = getBotState()

  return NextResponse.json({
    success: true,
    ...state,
  })
}
