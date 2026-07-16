import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ success: false }, { status: 401 })
  }

  const cookieStore = await cookies()

  cookieStore.set("sm_admin_session", process.env.ADMIN_SESSION_SECRET!, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
  })

  return NextResponse.json({ success: true })
}
