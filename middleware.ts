import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // De loginpagina zelf moet altijd bereikbaar blijven
  if (pathname === "/admin/login") {
    return NextResponse.next()
  }

  const session = req.cookies.get("sm_admin_session")?.value
  const isValid = session === process.env.ADMIN_SESSION_SECRET

  if (!isValid) {
    const loginUrl = new URL("/admin/login", req.url)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
}
