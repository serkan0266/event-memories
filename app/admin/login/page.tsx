"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { CSSProperties } from "react"

export default function AdminLoginPage() {

  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    setError(null)

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    })

    if (res.ok) {
      router.push("/admin")
      router.refresh()
    } else {
      setError("Verkeerd wachtwoord")
      setLoading(false)
    }
  }

  return (
    <div style={loginWrap}>
      <div style={loginCard}>
        <div style={loginMark}>SM</div>
        <h1 style={loginTitle}>Share Memories</h1>
        <p style={loginSub}>Beheeromgeving</p>

        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && login()}
          style={loginInput}
        />

        {error && <p style={errorText}>{error}</p>}

        <button onClick={login} disabled={loading} style={primaryBtn}>
          {loading ? "Bezig…" : "Inloggen"}
        </button>
      </div>
    </div>
  )
}

const ink = "#1c1a17"
const ivory = "#f7f2ea"
const card = "#fffdf9"
const gold = "#b8935a"
const goldSoft = "#e9dcc3"
const clay = "#8a6a54"

const serif = 'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif'

const loginWrap: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: `radial-gradient(circle at 50% 0%, #2a2620 0%, ${ink} 60%)`,
  fontFamily: "var(--font-inter), -apple-system, sans-serif"
}

const loginCard: CSSProperties = {
  background: card,
  padding: "48px 40px",
  borderRadius: 4,
  width: 320,
  textAlign: "center",
  boxShadow: "0 30px 60px rgba(0,0,0,0.35)",
  border: `1px solid ${goldSoft}`
}

const loginMark: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: `1px solid ${gold}`,
  color: gold,
  fontFamily: serif,
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 20px"
}

const loginTitle: CSSProperties = {
  fontFamily: serif,
  fontSize: 24,
  color: ink,
  margin: 0,
  fontWeight: 500
}

const loginSub: CSSProperties = {
  fontSize: 12,
  color: clay,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  marginTop: 6,
  marginBottom: 28
}

const loginInput: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 2,
  border: `1px solid #e4dcc9`,
  marginBottom: 14,
  fontSize: 14,
  boxSizing: "border-box",
  background: ivory
}

const errorText: CSSProperties = {
  fontSize: 13,
  color: "#a34a3d",
  marginBottom: 12
}

const primaryBtn: CSSProperties = {
  width: "100%",
  padding: "12px",
  borderRadius: 2,
  background: ink,
  color: gold,
  border: "none",
  fontSize: 13,
  letterSpacing: 1,
  textTransform: "uppercase",
  cursor: "pointer"
}
