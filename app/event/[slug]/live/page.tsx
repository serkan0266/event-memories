"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"
import QRCode from "react-qr-code"
import type { CSSProperties } from "react"

const SLIDE_DURATION_MS = 7000
const TRANSITION_MS = 1200

export default function LiveWall() {

  const params = useParams()
  const slug = params.slug as string

  const BASE_URL = "https://app.sharememories.nl"

  const [event, setEvent] = useState<any>(null)
  const [uploads, setUploads] = useState<any[]>([])
  const [index, setIndex] = useState(0)
  const [layers, setLayers] = useState([
    { src: "", opacity: 0 },
    { src: "", opacity: 0 },
  ])

  const activeLayer = useRef(0)
  const uploadsRef = useRef<any[]>([])

  useEffect(() => {
    uploadsRef.current = uploads
  }, [uploads])

  useEffect(() => {
    let channel: any = null

    async function setup() {
      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single()

      if (!eventData) return
      setEvent(eventData)

      const { data } = await supabase
        .from("uploads")
        .select("*")
        .eq("event_id", eventData.id)
        .eq("type", "image")
        .order("created_at", { ascending: true })

      setUploads(data || [])

      channel = supabase
        .channel(`live-wall-${eventData.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "uploads",
            filter: `event_id=eq.${eventData.id}`,
          },
          (payload: any) => {
            if (payload.new?.type === "image") {
              setUploads(prev => [...prev, payload.new])
            }
          }
        )
        .subscribe()
    }

    setup()

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  // Automatisch doorschuiven
  useEffect(() => {
    if (uploads.length === 0) return

    const timer = setInterval(() => {
      setIndex(i => (i + 1) % uploadsRef.current.length)
    }, SLIDE_DURATION_MS)

    return () => clearInterval(timer)
  }, [uploads.length])

  // Crossfade naar de nieuwe foto bij elke index-wissel
  useEffect(() => {
    const current = uploads[index]
    if (!current) return

    const next = activeLayer.current === 0 ? 1 : 0

    setLayers(prev => {
      const updated = [...prev]
      updated[next] = { src: current.file_url, opacity: 1 }
      updated[activeLayer.current] = { ...updated[activeLayer.current], opacity: 0 }
      return updated
    })

    activeLayer.current = next
  }, [index, uploads])

  const current = uploads[index]
  const eventUrl = event ? `${BASE_URL}/event/${event.slug}` : ""

  return (
    <div style={pageStyle}>

      <style>{`
        @keyframes sm-caption-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {uploads.length === 0 && event && (
        <div style={welcomeWrap}>
          <div style={welcomeMark}>SM</div>
          <h1 style={welcomeTitle}>{event.name}</h1>
          <p style={welcomeSub}>Scan de code om de eerste foto te delen</p>
          <div style={qrBoxLarge}>
            <QRCode value={eventUrl} size={160} />
          </div>
        </div>
      )}

      {uploads.length > 0 && (
        <>
          {layers.map((layer, i) => (
            <div key={i} style={{ ...layerWrap, opacity: layer.opacity }}>
              {layer.src && (
                <>
                  <img src={layer.src} style={layerBlurBg} alt="" />
                  <img src={layer.src} style={layerImg} alt="" />
                </>
              )}
            </div>
          ))}

          {current && (current.name || current.message) && (
            <div key={index} style={captionBox}>
              {current.name && <div style={captionName}>{current.name}</div>}
              {current.message && <div style={captionMessage}>{current.message}</div>}
            </div>
          )}
        </>
      )}

      {event && (
        <div style={cornerBadge}>
          <div style={cornerQr}>
            <QRCode value={eventUrl} size={72} />
          </div>
          <div style={cornerText}>Scan om te delen</div>
        </div>
      )}

    </div>
  )
}

/* ===== TOKENS — zelfde merktaal als de rest van Share Memories ===== */

const ink = "#1c1a17"
const gold = "#b8935a"
const goldSoft = "#e9dcc3"
const clay = "#8a6a54"

const serif = 'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif'
const sans = 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/* ===== SHELL ===== */

const pageStyle: CSSProperties = {
  position: "relative",
  width: "100vw",
  height: "100dvh",
  background: ink,
  overflow: "hidden",
  fontFamily: sans
}

/* ===== WELCOME (nog geen foto's) ===== */

const welcomeWrap: CSSProperties = {
  position: "absolute",
  inset: 0,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  textAlign: "center",
  padding: 40
}

const welcomeMark: CSSProperties = {
  width: 56,
  height: 56,
  borderRadius: "50%",
  border: `1px solid ${gold}`,
  color: gold,
  fontFamily: serif,
  fontSize: 20,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 12
}

const welcomeTitle: CSSProperties = {
  fontFamily: 'var(--font-script), cursive',
  color: "#f5efe4",
  fontSize: 64,
  margin: 0
}

const welcomeSub: CSSProperties = {
  color: goldSoft,
  fontSize: 16,
  marginTop: 8,
  marginBottom: 24
}

const qrBoxLarge: CSSProperties = {
  background: "#fff",
  padding: 20,
  borderRadius: 6
}

/* ===== SLIDESHOW LAYERS ===== */

const layerWrap: CSSProperties = {
  position: "absolute",
  inset: 0,
  transition: `opacity ${TRANSITION_MS}ms ease`
}

const layerBlurBg: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  filter: "blur(40px) brightness(0.55)",
  transform: "scale(1.2)"
}

const layerImg: CSSProperties = {
  position: "relative",
  width: "100%",
  height: "100%",
  objectFit: "contain",
  zIndex: 1
}

/* ===== CAPTION ===== */

const captionBox: CSSProperties = {
  position: "absolute",
  bottom: 48,
  left: 0,
  right: 0,
  textAlign: "center",
  zIndex: 2,
  animation: "sm-caption-in 0.6s ease"
}

const captionName: CSSProperties = {
  fontFamily: serif,
  fontSize: 32,
  color: "#f5efe4",
  textShadow: "0 2px 14px rgba(0,0,0,0.5)"
}

const captionMessage: CSSProperties = {
  fontSize: 16,
  color: goldSoft,
  marginTop: 6,
  textShadow: "0 2px 10px rgba(0,0,0,0.5)"
}

/* ===== CORNER QR (altijd zichtbaar) ===== */

const cornerBadge: CSSProperties = {
  position: "absolute",
  bottom: 24,
  right: 24,
  zIndex: 3,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6,
  background: "rgba(28,26,23,0.55)",
  padding: 12,
  borderRadius: 6,
  border: `1px solid rgba(233,220,195,0.3)`
}

const cornerQr: CSSProperties = {
  background: "#fff",
  padding: 6,
  borderRadius: 3
}

const cornerText: CSSProperties = {
  fontSize: 10,
  color: "#f5efe4",
  letterSpacing: 0.5
}
