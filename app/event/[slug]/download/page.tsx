"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import type { CSSProperties } from "react"

const BATCH_SIZE = 100

export default function DownloadPage() {

  const params = useParams()
  const slug = params.slug as string

  const [event, setEvent] = useState<any>(null)
  const [photoCount, setPhotoCount] = useState(0)
  const [videoCount, setVideoCount] = useState(0)
  const [input, setInput] = useState("")
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  async function load() {
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single()

    if (!eventData) return

    setEvent(eventData)

    const { data: uploads } = await supabase
      .from("uploads")
      .select("id,type")
      .eq("event_id", eventData.id)

    const images = uploads?.filter(u => u.type === "image") || []
    const videos = uploads?.filter(u => u.type === "video") || []

    setPhotoCount(images.length)
    setVideoCount(videos.length)
  }

  if (!event) {
    return (
      <div style={loadingWrap}>
        <div style={loadingMark}>SM</div>
      </div>
    )
  }

  const totalZips = Math.ceil(photoCount / BATCH_SIZE) || (photoCount === 0 ? 0 : 1)

  function checkPassword() {
    if (input === event.download_password) {
      setUnlocked(true)
      setError(null)
    } else {
      setError("Verkeerd wachtwoord")
    }
  }

  // BEVEILIGDE TOEGANG
  if (event.download_password && !unlocked) {
    return (
      <div style={pageWrap}>
        <div style={card}>
          <div style={lockMark}>🔒</div>
          <h2 style={cardTitle}>Beveiligde download</h2>
          <p style={cardSub}>Voer het wachtwoord in om toegang te krijgen</p>

          <input
            type="password"
            placeholder="Wachtwoord"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && checkPassword()}
            style={inputStyle}
          />

          {error && <p style={errorText}>{error}</p>}

          <button onClick={checkPassword} style={primaryBtn}>
            Ontgrendelen
          </button>
        </div>
      </div>
    )
  }

  // DOWNLOADPAGINA
  return (
    <div style={pageWrap}>
      <div style={card}>

        <img
          src="https://sharememories.nl/wp-content/uploads/2026/04/Untitled_design-removebg-preview.png"
          style={logo}
          alt="Share Memories"
        />

        <h1 style={pageTitle}>Download alle herinneringen</h1>
        <p style={pageSub}>
          {photoCount} foto{photoCount !== 1 ? "'s" : ""}
          {videoCount > 0 && ` · ${videoCount} video${videoCount !== 1 ? "'s" : ""}`}
        </p>

        {photoCount === 0 && videoCount === 0 && (
          <p style={emptyText}>Er zijn nog geen bestanden om te downloaden.</p>
        )}

        {photoCount > 0 && (
          <div style={sectionBlock}>
            <div style={sectionLabel}>Foto's</div>
            {Array.from({ length: totalZips }, (_, i) => {
              const batch = i + 1
              return (
                <a
                  key={batch}
                  href={`/api/zip?event=${event.id}&batch=${batch}`}
                  style={downloadBtn}
                >
                  ZIP {batch} downloaden
                  {totalZips > 1 && (
                    <span style={downloadBtnSub}> — deel {batch} van {totalZips}</span>
                  )}
                </a>
              )
            })}
          </div>
        )}

        {videoCount > 0 && (
          <div style={sectionBlock}>
            <div style={sectionLabel}>Video's</div>
            <a
              href={`/api/zip?event=${event.id}&type=video`}
              style={downloadBtnOutline}
            >
              Video's downloaden ({videoCount})
            </a>
            <p style={helperText}>
              Video's zijn groter dan foto's — dit kan langer duren om te laden.
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

/* ===== TOKENS — zelfde merktaal als de rest van Share Memories ===== */

const ink = "#1c1a17"
const ivory = "#f7f2ea"
const card_bg = "#fffdf9"
const gold = "#b8935a"
const goldSoft = "#e9dcc3"
const clay = "#8a6a54"
const danger = "#a34a3d"

const serif = 'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif'
const sans = 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/* ===== LOADING ===== */

const loadingWrap: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: ivory
}

const loadingMark: CSSProperties = {
  width: 44,
  height: 44,
  borderRadius: "50%",
  border: `1px solid ${gold}`,
  color: gold,
  fontFamily: serif,
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

/* ===== SHELL ===== */

const pageWrap: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: ivory,
  padding: 20,
  fontFamily: sans,
  color: ink
}

const card: CSSProperties = {
  maxWidth: 460,
  width: "100%",
  textAlign: "center",
  background: card_bg,
  border: `1px solid ${goldSoft}`,
  borderRadius: 4,
  padding: "40px 32px"
}

const logo: CSSProperties = {
  width: 130,
  margin: "0 auto 20px",
  display: "block",
  opacity: 0.9
}

const pageTitle: CSSProperties = {
  fontFamily: serif,
  fontSize: 26,
  fontWeight: 500,
  margin: 0
}

const pageSub: CSSProperties = {
  fontSize: 13,
  color: clay,
  marginTop: 8,
  letterSpacing: 0.5
}

const emptyText: CSSProperties = {
  color: clay,
  fontSize: 14,
  marginTop: 24
}

/* ===== SECTIONS ===== */

const sectionBlock: CSSProperties = {
  marginTop: 28,
  textAlign: "left"
}

const sectionLabel: CSSProperties = {
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: clay,
  marginBottom: 10
}

const downloadBtn: CSSProperties = {
  display: "block",
  marginTop: 8,
  padding: "15px 16px",
  borderRadius: 2,
  background: ink,
  color: gold,
  textDecoration: "none",
  fontSize: 14,
  textAlign: "center"
}

const downloadBtnSub: CSSProperties = {
  color: goldSoft,
  fontSize: 12
}

const downloadBtnOutline: CSSProperties = {
  display: "block",
  padding: "15px 16px",
  borderRadius: 2,
  border: `1px solid ${gold}`,
  background: "transparent",
  color: ink,
  textDecoration: "none",
  fontSize: 14,
  textAlign: "center"
}

const helperText: CSSProperties = {
  fontSize: 12,
  color: clay,
  marginTop: 8
}

/* ===== LOCK SCREEN ===== */

const lockMark: CSSProperties = {
  fontSize: 26,
  marginBottom: 6
}

const cardTitle: CSSProperties = {
  fontFamily: serif,
  fontSize: 22,
  fontWeight: 500,
  margin: 0
}

const cardSub: CSSProperties = {
  fontSize: 13,
  color: clay,
  marginTop: 8
}

const inputStyle: CSSProperties = {
  marginTop: 20,
  padding: "12px 14px",
  borderRadius: 2,
  border: "1px solid #e4dcc9",
  width: "100%",
  fontSize: 14,
  fontFamily: sans,
  background: ivory,
  boxSizing: "border-box"
}

const errorText: CSSProperties = {
  fontSize: 13,
  color: danger,
  marginTop: 10
}

const primaryBtn: CSSProperties = {
  marginTop: 16,
  padding: "13px 20px",
  background: ink,
  color: gold,
  border: "none",
  borderRadius: 2,
  width: "100%",
  fontSize: 14,
  cursor: "pointer"
}
