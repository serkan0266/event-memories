"use client"

import { useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import type { CSSProperties } from "react"

export default function Gallery() {

  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [uploads, setUploads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [viewer, setViewer] = useState<number | null>(null)
  const [uploaderId, setUploaderId] = useState("")
  const [isDesktop, setIsDesktop] = useState(false)

  const touchStart = useRef(0)

  useEffect(() => {
    let id = localStorage.getItem("uploaderId")

    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem("uploaderId", id)
    }

    setUploaderId(id)
    setIsDesktop(window.innerWidth > 768)
    load()
  }, [])

  useEffect(() => {
    document.body.style.overflow = viewer !== null ? "hidden" : "auto"
  }, [viewer])

  // KEYBOARD
  useEffect(() => {
    function handleKey(e: any) {
      if (viewer === null) return

      if (e.key === "ArrowRight") {
        setViewer(v => v !== null && v < uploads.length - 1 ? v + 1 : v)
      }
      if (e.key === "ArrowLeft") {
        setViewer(v => v !== null && v > 0 ? v - 1 : v)
      }
      if (e.key === "Escape") {
        setViewer(null)
      }
    }

    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [viewer, uploads])

  async function load() {
    setLoading(true)

    const { data: eventData, error: eventError } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single()

    if (eventError || !eventData) {
      console.error("EVENT LOAD ERROR:", eventError)
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("event_id", eventData.id)
      .eq("type", "image")
      .order("created_at", { ascending: false })

    setUploads(data || [])
    setLoading(false)
  }

  async function deletePhoto(upload: any) {
    if (!confirm("Bestand verwijderen?")) return

    const path = upload.file_url.split("/uploads/")[1]

    if (path) {
      await supabase.storage.from("uploads").remove([path])
    }

    const currentUploaderId = localStorage.getItem("uploaderId")

    await supabase
      .from("uploads")
      .delete()
      .eq("id", upload.id)
      .eq("uploader_id", currentUploaderId)

    setUploads(uploads.filter(u => u.id !== upload.id))
    setViewer(null)
  }

  function handleTouchStart(e: any) {
    touchStart.current = e.touches[0].clientX
  }

  function handleTouchEnd(e: any) {
    const diff = e.changedTouches[0].clientX - touchStart.current

    if (diff > 60) {
      setViewer(v => v !== null && v > 0 ? v - 1 : v)
    }
    if (diff < -60) {
      setViewer(v => v !== null && v < uploads.length - 1 ? v + 1 : v)
    }
  }

  const current = viewer !== null ? uploads[viewer] : null

  return (
    <div style={pageStyle}>

      <div style={topBar}>
        <button onClick={() => router.push(`/event/${slug}`)} style={backBtn}>
          ← Terug
        </button>
      </div>

      <h1 style={pageTitle}>Galerij</h1>

      {loading && (
        <p style={emptyText}>Momenten worden geladen…</p>
      )}

      {!loading && uploads.length === 0 && (
        <div style={emptyState}>
          <p style={emptyText}>Nog geen foto's of video's toegevoegd.</p>
        </div>
      )}

      <div style={masonry}>
        {uploads.map((u, i) => (
          <div
            key={u.id}
            onClick={() => setViewer(i)}
            style={tile}
          >
            <img src={u.file_url} style={tileMedia} alt="" />

            {(u.name || u.message) && (
              <div style={tileCaption}>
                {u.name && <b style={tileCaptionName}>{u.name}</b>}
                {u.message && (
                  <div style={tileCaptionMessage}>{u.message}</div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {current && (
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          style={viewerOverlay}
        >
          <div style={viewerTopBar}>
            {current.uploader_id === uploaderId && (
              <button onClick={() => deletePhoto(current)} style={iconBtn}>
                🗑️
              </button>
            )}
            <button onClick={() => setViewer(null)} style={iconBtn}>
              ✕
            </button>
          </div>

          {isDesktop && (
            <>
              <div
                onClick={() => setViewer(v => v !== null && v > 0 ? v - 1 : v)}
                style={arrowLeft}
              >
                ‹
              </div>
              <div
                onClick={() => setViewer(v => v !== null && v < uploads.length - 1 ? v + 1 : v)}
                style={arrowRight}
              >
                ›
              </div>
            </>
          )}

          {current.type === "video" ? (
            <video src={current.file_url} style={viewerMedia} controls autoPlay />
          ) : (
            <img src={current.file_url} style={viewerMedia} alt="" />
          )}

          {(current.name || current.message) && (
            <div style={viewerCaption}>
              {current.name && <b style={viewerCaptionName}>{current.name}</b>}
              {current.message && (
                <p style={viewerCaptionMessage}>{current.message}</p>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  )
}

/* ===== TOKENS — zelfde merktaal als admin en event-pagina ===== */

const ink = "#1c1a17"
const ivory = "#f7f2ea"
const gold = "#b8935a"
const goldSoft = "#e9dcc3"
const clay = "#8a6a54"

const serif = 'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif'
const sans = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/* ===== SHELL ===== */

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: ivory,
  fontFamily: sans,
  color: ink,
  padding: "20px 12px 60px",
  maxWidth: 1400,
  margin: "0 auto"
}

const topBar: CSSProperties = {
  marginBottom: 8
}

const backBtn: CSSProperties = {
  background: "transparent",
  border: `1px solid ${goldSoft}`,
  color: ink,
  borderRadius: 2,
  padding: "8px 14px",
  fontSize: 13,
  cursor: "pointer",
  fontFamily: sans
}

const pageTitle: CSSProperties = {
  fontFamily: serif,
  fontSize: 30,
  fontWeight: 500,
  textAlign: "center",
  margin: "12px 0 28px"
}

const emptyState: CSSProperties = {
  border: `1px dashed ${goldSoft}`,
  borderRadius: 4,
  padding: 40,
  textAlign: "center"
}

const emptyText: CSSProperties = {
  color: clay,
  fontSize: 14,
  textAlign: "center"
}

/* ===== MASONRY ===== */

const masonry: CSSProperties = {
  columnWidth: "140px",
  columnGap: "10px"
}

const tile: CSSProperties = {
  breakInside: "avoid",
  marginBottom: 12,
  cursor: "pointer",
  position: "relative",
  borderRadius: 4,
  overflow: "hidden",
  border: `1px solid ${goldSoft}`
}

const tileMedia: CSSProperties = {
  width: "100%",
  display: "block"
}

const tileCaption: CSSProperties = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  padding: "16px 10px 10px",
  background: "linear-gradient(to top, rgba(28,26,23,0.85), transparent)",
  color: "#f5efe4"
}

const tileCaptionName: CSSProperties = {
  fontFamily: serif,
  fontSize: 14,
  fontWeight: 500
}

const tileCaptionMessage: CSSProperties = {
  fontSize: 12,
  color: "#e9dcc3",
  marginTop: 2
}

/* ===== FULLSCREEN VIEWER ===== */

const viewerOverlay: CSSProperties = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100dvh",
  background: ink,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999999
}

const viewerTopBar: CSSProperties = {
  position: "absolute",
  top: 20,
  right: 20,
  display: "flex",
  gap: 10
}

const iconBtn: CSSProperties = {
  background: "rgba(245,239,228,0.95)",
  border: "none",
  borderRadius: "50%",
  width: 42,
  height: 42,
  fontSize: 16,
  cursor: "pointer"
}

const arrowLeft: CSSProperties = {
  position: "absolute",
  left: 20,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 40,
  color: gold,
  cursor: "pointer"
}

const arrowRight: CSSProperties = {
  position: "absolute",
  right: 20,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 40,
  color: gold,
  cursor: "pointer"
}

const viewerMedia: CSSProperties = {
  maxWidth: "95%",
  maxHeight: "60vh",
  borderRadius: 4
}

const viewerCaption: CSSProperties = {
  color: "#f5efe4",
  marginTop: 20,
  textAlign: "center",
  maxWidth: 600,
  padding: "0 20px"
}

const viewerCaptionName: CSSProperties = {
  fontFamily: serif,
  fontSize: 18
}

const viewerCaptionMessage: CSSProperties = {
  marginTop: 8,
  fontSize: 14,
  color: goldSoft
}
