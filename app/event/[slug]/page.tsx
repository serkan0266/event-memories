"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import type { CSSProperties } from "react"

export default function EventPage() {

  const params = useParams()
  const router = useRouter()

  const slug = params.slug as string

  // Cloudinary — unsigned upload preset, veilig om in de frontend te gebruiken
  const CLOUDINARY_CLOUD_NAME = "lcxrn0kc"
  const CLOUDINARY_UPLOAD_PRESET = "Events"

  const [event, setEvent] = useState<any>(null)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")

  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [count, setCount] = useState(0)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [uploadDone, setUploadDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)
  const [videoCount, setVideoCount] = useState(0)
  const [videoUploadedCount, setVideoUploadedCount] = useState(0)
  const [videoUploadDone, setVideoUploadDone] = useState(false)
  const [videoError, setVideoError] = useState<string | null>(null)

  const [uploaderId, setUploaderId] = useState("")

  const MAX_FILES = 50
  const MAX_VIDEO_FILES = 5
  const MAX_VIDEO_SIZE_MB = 500

  useEffect(() => {
    let id = localStorage.getItem("uploaderId")

    if (!id) {
      id = crypto.randomUUID()
      localStorage.setItem("uploaderId", id)
    }

    setUploaderId(id)
    loadEvent()
  }, [])

  async function loadEvent() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("EVENT LOAD ERROR:", error)
      return
    }

    setEvent(data)
  }

  async function handlePhotos(e: any) {
    const files = e.target.files as FileList

    if (!files || !event) return

    if (files.length > MAX_FILES) {
      setError(`Maximaal ${MAX_FILES} afbeeldingen tegelijk`)
      return
    }

    setError(null)
    setUploading(true)
    setUploadDone(false)
    setCount(files.length)

    let done = 0

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      setError("Er ging iets mis, ververs de pagina en probeer opnieuw")
      setUploading(false)
      return
    }

    const cleanSlug = event.slug.replace(/[^a-z0-9]/gi, "-").toLowerCase()

    for (const file of Array.from(files) as File[]) {

      if (!file.type.startsWith("image")) continue

      const cleanName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase()
      const path = `${cleanSlug}/${Date.now()}-${cleanName}`

      const { error: uploadError } = await supabase.storage
        .from("uploads")
        .upload(path, file)

      if (uploadError) {
        console.error(uploadError)
        setError("Uploaden mislukt, probeer het opnieuw")
        setUploading(false)
        return
      }

      const publicUrl = supabase.storage
        .from("uploads")
        .getPublicUrl(path).data.publicUrl

      await supabase.from("uploads").insert({
        event_id: event.id,
        file_url: publicUrl,
        type: "image",
        name: name,
        message: message,
        uploader_id: uploaderId,
        user_id: userId,
        file_size: file.size
      })

      done++
      setUploadedCount(done)
      setProgress(Math.round((done / files.length) * 100))
    }

    setUploading(false)
    setUploadDone(true)
  }

  function uploadToCloudinary(file: File, onProgress: (pct: number) => void): Promise<string> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`

      const formData = new FormData()
      formData.append("file", file)
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100))
        }
      }

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          const data = JSON.parse(xhr.responseText)
          resolve(data.secure_url)
        } else {
          reject(new Error("Cloudinary upload mislukt"))
        }
      }

      xhr.onerror = () => reject(new Error("Netwerkfout tijdens upload"))

      xhr.open("POST", url)
      xhr.send(formData)
    })
  }

  async function handleVideos(e: any) {
    const files = e.target.files as FileList

    if (!files || !event) return

    if (files.length > MAX_VIDEO_FILES) {
      setVideoError(`Maximaal ${MAX_VIDEO_FILES} video's tegelijk`)
      return
    }

    const fileArray = Array.from(files) as File[]
    const tooLarge = fileArray.find(f => f.size > MAX_VIDEO_SIZE_MB * 1024 * 1024)

    if (tooLarge) {
      setVideoError(`"${tooLarge.name}" is groter dan ${MAX_VIDEO_SIZE_MB} MB. Kies een kortere video.`)
      return
    }

    setVideoError(null)
    setUploadingVideo(true)
    setVideoUploadDone(false)
    setVideoCount(fileArray.length)

    let done = 0

    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (!userId) {
      setVideoError("Er ging iets mis, ververs de pagina en probeer opnieuw")
      setUploadingVideo(false)
      return
    }

    for (const file of fileArray) {

      if (!file.type.startsWith("video")) continue

      try {
        setVideoProgress(0)

        const secureUrl = await uploadToCloudinary(file, (pct) => {
          setVideoProgress(pct)
        })

        await supabase.from("uploads").insert({
          event_id: event.id,
          file_url: secureUrl,
          type: "video",
          name: name,
          message: message,
          uploader_id: uploaderId,
          user_id: userId,
          file_size: file.size
        })

        done++
        setVideoUploadedCount(done)
      } catch (err) {
        console.error(err)
        setVideoError("Video uploaden mislukt, probeer het opnieuw")
        setUploadingVideo(false)
        return
      }
    }

    setUploadingVideo(false)
    setVideoUploadDone(true)
  }

  if (!event) {
    return (
      <div style={loadingWrap}>
        <div style={loadingMark}>SM</div>
      </div>
    )
  }

  const headerUrl = event?.header_image ? event.header_image : null
  const isClosed = event.status === "closed"

  return (
    <div style={pageStyle}>

      <div style={contentWrap}>

        {headerUrl && (
          <img src={headerUrl} style={heroImg} alt="" />
        )}

        <h1 style={heroTitle}>{event.name}</h1>

        {isClosed ? (
          <>
            <p style={introText}>Inzendingen voor dit event zijn gesloten</p>
            <button
              onClick={() => router.push(`/event/${slug}/gallery`)}
              style={primaryBtn}
            >
              Galerij bekijken
            </button>
          </>
        ) : (
          <>
            <p style={introText}>
              Alle momenten van deze speciale dag komen hier samen
            </p>

            <div style={formCard}>

              <label style={fieldLabel}>Naam</label>
              <input
                placeholder="Jouw naam"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
              />

              <label style={fieldLabel}>Bericht</label>
              <textarea
                placeholder="Laat een bericht achter…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={textareaStyle}
              />

              <label style={uploadTile}>
                <span style={uploadIcon}>+</span>
                <span>Foto's toevoegen</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotos}
                  style={{ display: "none" }}
                />
              </label>
              <p style={helperText}>Maximaal {MAX_FILES} afbeeldingen tegelijk</p>

              <label style={uploadTileButton}>
                <span style={uploadIcon}>+</span>
                <span>Video toevoegen</span>
                <input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleVideos}
                  style={{ display: "none" }}
                />
              </label>
              <p style={helperText}>
                Maximaal {MAX_VIDEO_FILES} video's tegelijk, elk max {MAX_VIDEO_SIZE_MB} MB
              </p>

              {videoError && (
                <p style={errorText}>{videoError}</p>
              )}

              {uploadingVideo && (
                <div style={statusBox}>
                  <p style={statusTitle}>Video's uploaden — {videoProgress}%</p>
                  <p style={statusSub}>{videoUploadedCount} van {videoCount} verwerkt</p>
                  <p style={statusFootnote}>Laat deze pagina open tot de upload klaar is</p>
                  <div style={progressBar}>
                    <div style={{ ...progressFill, width: videoProgress + "%" }} />
                  </div>
                </div>
              )}

              {videoUploadDone && !uploadingVideo && (
                <div style={statusBox}>
                  <p style={statusTitle}>Upload voltooid</p>
                  <p style={statusSub}>Je video's zijn toegevoegd, bedankt!</p>
                </div>
              )}

              {error && (
                <p style={errorText}>{error}</p>
              )}

              {uploading && (
                <div style={statusBox}>
                  <p style={statusTitle}>Foto's uploaden — {progress}%</p>
                  <p style={statusSub}>{uploadedCount} van {count} verwerkt</p>
                  <p style={statusFootnote}>Laat deze pagina open tot de upload klaar is</p>
                  <div style={progressBar}>
                    <div style={{ ...progressFill, width: progress + "%" }} />
                  </div>
                </div>
              )}

              {uploadDone && !uploading && (
                <div style={statusBox}>
                  <p style={statusTitle}>Upload voltooid</p>
                  <p style={statusSub}>Je foto's zijn toegevoegd, bedankt!</p>
                </div>
              )}

            </div>

            <button
              onClick={() => router.push(`/event/${slug}/gallery`)}
              style={secondaryBtn}
            >
              Galerij bekijken
            </button>
          </>
        )}

        <div style={footerBrand}>
          <img
            src="https://sharememories.nl/wp-content/uploads/2026/04/Untitled_design-removebg-preview.png"
            style={footerLogo}
            alt="Share Memories"
          />
          <p style={footerText}>Powered by Share Memories</p>
        </div>

      </div>
    </div>
  )
}

/* ===== TOKENS — zelfde merktaal als admin paneel ===== */

const ink = "#1c1a17"
const ivory = "#f7f2ea"
const card = "#fffdf9"
const gold = "#b8935a"
const goldSoft = "#e9dcc3"
const clay = "#8a6a54"

const serif = 'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif'
const sans = 'var(--font-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

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

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: ivory,
  fontFamily: sans,
  color: ink,
  paddingBottom: 60
}

/* ===== HERO ===== */

const heroImg: CSSProperties = {
  width: "100%",
  borderRadius: 8,
  marginBottom: 20,
  display: "block"
}

const heroTitle: CSSProperties = {
  fontFamily: serif,
  color: ink,
  fontSize: 34,
  fontWeight: 500,
  margin: 0,
  marginBottom: 8
}

/* ===== CONTENT ===== */

const contentWrap: CSSProperties = {
  maxWidth: 480,
  margin: "0 auto",
  padding: "24px 20px 0",
  textAlign: "center"
}

const introText: CSSProperties = {
  fontSize: 15,
  lineHeight: 1.6,
  color: clay,
  marginBottom: 28
}

/* ===== FORM ===== */

const formCard: CSSProperties = {
  background: card,
  border: `1px solid ${goldSoft}`,
  borderRadius: 4,
  padding: 24,
  textAlign: "left"
}

const fieldLabel: CSSProperties = {
  display: "block",
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: clay,
  marginBottom: 6,
  marginTop: 14
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 2,
  border: "1px solid #e4dcc9",
  fontSize: 15,
  fontFamily: sans,
  background: ivory,
  boxSizing: "border-box"
}

const textareaStyle: CSSProperties = {
  ...inputStyle,
  minHeight: 90,
  resize: "vertical",
  fontFamily: sans
}

const uploadTile: CSSProperties = {
  width: "100%",
  marginTop: 20,
  padding: "18px",
  border: `1px solid ${gold}`,
  borderRadius: 2,
  background: ink,
  color: "#f5efe4",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontSize: 15,
  boxSizing: "border-box"
}

const uploadTileButton: CSSProperties = {
  width: "100%",
  marginTop: 10,
  padding: "18px",
  border: `1px solid ${goldSoft}`,
  borderRadius: 2,
  background: "transparent",
  color: ink,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
  fontSize: 15,
  boxSizing: "border-box"
}

const uploadIcon: CSSProperties = {
  fontSize: 18,
  color: gold
}

const helperText: CSSProperties = {
  fontSize: 12,
  color: clay,
  marginTop: 8,
  textAlign: "center"
}

const errorText: CSSProperties = {
  fontSize: 13,
  color: "#a34a3d",
  marginTop: 12,
  textAlign: "center"
}

/* ===== STATUS ===== */

const statusBox: CSSProperties = {
  marginTop: 20,
  padding: 16,
  borderRadius: 2,
  background: ivory,
  border: `1px solid ${goldSoft}`,
  textAlign: "center"
}

const statusTitle: CSSProperties = {
  fontWeight: 600,
  fontSize: 14,
  margin: 0
}

const statusSub: CSSProperties = {
  fontSize: 13,
  color: clay,
  marginTop: 4
}

const statusFootnote: CSSProperties = {
  fontSize: 11,
  color: clay,
  marginTop: 8
}

const progressBar: CSSProperties = {
  width: "100%",
  height: 6,
  background: "#e4dcc9",
  borderRadius: 10,
  overflow: "hidden",
  marginTop: 10
}

const progressFill: CSSProperties = {
  height: "100%",
  background: gold,
  transition: "0.4s ease"
}

/* ===== BUTTONS ===== */

const primaryBtn: CSSProperties = {
  padding: "14px 30px",
  background: ink,
  color: gold,
  border: "none",
  borderRadius: 2,
  fontSize: 14,
  letterSpacing: 0.5,
  cursor: "pointer"
}

const secondaryBtn: CSSProperties = {
  marginTop: 28,
  padding: "13px 28px",
  background: "transparent",
  color: ink,
  border: `1px solid ${gold}`,
  borderRadius: 2,
  fontSize: 14,
  cursor: "pointer"
}

/* ===== FOOTER ===== */

const footerBrand: CSSProperties = {
  marginTop: 56,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 8
}

const footerLogo: CSSProperties = {
  width: 90,
  opacity: 0.8
}

const footerText: CSSProperties = {
  fontSize: 12,
  color: clay,
  letterSpacing: 0.5
}
