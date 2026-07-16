"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"
import type { CSSProperties } from "react"

export default function AdminPage() {

  const BASE_URL = "https://app.sharememories.nl"

  const router = useRouter()

  const [events, setEvents] = useState<any[]>([])
  const [uploads, setUploads] = useState<any[]>([])

  const [viewEvent, setViewEvent] = useState<string | null>(null)
  const [editing, setEditing] = useState<any>(null)
  const [headerPickerFor, setHeaderPickerFor] = useState<string | null>(null)

  const [name, setName] = useState("")
  const [slug, setSlug] = useState("")

  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const [stats, setStats] = useState({
    events: 0,
    photos: 0,
    videos: 0,
    storage: 0
  })

  useEffect(() => {
    loadEvents()
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(null), 2600)
  }

  async function logout() {
    await fetch("/api/admin-logout", { method: "POST" })
    router.push("/admin/login")
  }

  async function loadEvents() {
    setLoading(true)

    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("EVENT ERROR:", error)
      setLoading(false)
      return
    }

    if (!data) {
      setLoading(false)
      return
    }

    let list: any[] = []
    let totalPhotos = 0
    let totalVideos = 0
    let totalStorage = 0

    for (const e of data) {

      const { data: uploads, error: uploadError } = await supabase
        .from("uploads")
        .select("*")
        .eq("event_id", e.id)

      if (uploadError) {
        console.error("UPLOAD ERROR:", uploadError)
        continue
      }

      let photos = 0
      let videos = 0
      let guests = new Set()

      uploads?.forEach((u: any) => {
        if (u.type === "image") photos++
        if (u.type === "video") videos++
        if (u.name) guests.add(u.name)
      })

      let storageBytes = 0
      uploads?.forEach((file: any) => {
        if (file.file_size) {
          storageBytes += Number(file.file_size)
        }
      })

      const storageMB = storageBytes / 1024 / 1024

      totalPhotos += photos
      totalVideos += videos
      totalStorage += storageMB

      list.push({
        ...e,
        photos,
        videos,
        guests: guests.size,
        storage: storageMB
      })
    }

    setEvents(list)

    setStats({
      events: data.length,
      photos: totalPhotos,
      videos: totalVideos,
      storage: totalStorage
    })

    setLoading(false)
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // accenten weg
      .replace(/[^a-z0-9]+/g, "-") // alles wat geen letter/cijfer is wordt een streepje
      .replace(/^-+|-+$/g, "") // geen streepjes aan begin/eind
  }

  async function createEvent() {
    if (!name || !slug) return

    await supabase.from("events").insert({
      name,
      slug: slugify(slug),
      status: "open",
      download_password: ""
    })

    setName("")
    setSlug("")
    showToast("Event aangemaakt")
    loadEvents()
  }

  async function toggleEvent(id: string, status: string) {
    await supabase
      .from("events")
      .update({ status })
      .eq("id", id)

    loadEvents()
  }

  async function viewUploads(eventId: string) {
    if (viewEvent === eventId) {
      setViewEvent(null)
      return
    }

    setViewEvent(eventId)

    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("event_id", eventId)

    setUploads(data || [])
  }

  async function deleteUpload(upload: any) {
    if (!confirm("Foto verwijderen?")) return

    const path = upload.file_url.split("/uploads/")[1]

    if (path) {
      await supabase.storage.from("uploads").remove([path])
    }

    await supabase.from("uploads").delete().eq("id", upload.id)

    setUploads(uploads.filter(u => u.id !== upload.id))
    showToast("Foto verwijderd")
  }

  async function deleteEvent(id: string) {
    if (!confirm("Event verwijderen? Dit kan niet ongedaan gemaakt worden.")) return

    const { data: files } = await supabase
      .from("uploads")
      .select("*")
      .eq("event_id", id)

    if (files) {
      const paths = files.map(f => f.file_url.split("/uploads/")[1]).filter(Boolean)

      if (paths.length) {
        await supabase.storage.from("uploads").remove(paths)
      }
    }

    await supabase.from("uploads").delete().eq("event_id", id)
    await supabase.from("events").delete().eq("id", id)

    showToast("Event verwijderd")
    loadEvents()
  }

  function editEvent(event: any) {
    setEditing({ ...event })
  }

  async function saveEvent() {
    await supabase
      .from("events")
      .update({
        name: editing.name,
        slug: slugify(editing.slug),
        download_password: editing.download_password || ""
      })
      .eq("id", editing.id)

    setEditing(null)
    showToast("Wijzigingen opgeslagen")
    loadEvents()
  }

  const PRESET_HEADERS = [
    { label: "Gender reveal", url: "https://showverhuur.nl/wp-content/uploads/2026/07/Gender-reveal-scaled.png" },
    { label: "Bruiloft", url: "https://showverhuur.nl/wp-content/uploads/2026/07/Bruiloft-scaled.png" },
    { label: "Verjaardag", url: "https://showverhuur.nl/wp-content/uploads/2026/07/Verjaardag-scaled.png" },
  ]

  async function setPresetHeader(eventId: string, url: string) {
    await supabase
      .from("events")
      .update({ header_image: url })
      .eq("id", eventId)

    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, header_image: url } : ev
      )
    )

    setHeaderPickerFor(null)
    showToast("Header ingesteld")
  }

  async function uploadHeader(e: any, eventId: string) {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split(".").pop()
    const fileName = `header-${Date.now()}.${fileExt}`
    const filePath = `headers/${fileName}`

    const { error } = await supabase.storage
      .from("uploads")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type
      })

    if (error) {
      showToast("Upload mislukt")
      return
    }

    const { data } = supabase.storage
      .from("uploads")
      .getPublicUrl(filePath)

    await supabase
      .from("events")
      .update({ header_image: data.publicUrl })
      .eq("id", eventId)

    setEvents(prev =>
      prev.map(ev =>
        ev.id === eventId ? { ...ev, header_image: data.publicUrl } : ev
      )
    )

    setHeaderPickerFor(null)

    showToast("Omslagfoto bijgewerkt")
  }

  function downloadQR(eventSlug: string) {
    const svg = document.querySelector(`svg[data-slug="${eventSlug}"]`)
    if (!svg) return

    const data = new XMLSerializer().serializeToString(svg)

    const canvas = document.createElement("canvas")
    const img = new Image()

    img.src = "data:image/svg+xml;base64," + btoa(data)

    img.onload = () => {
      const scale = 4
      canvas.width = img.width * scale
      canvas.height = img.height * scale

      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.scale(scale, scale)
        ctx.drawImage(img, 0, 0)
      }

      const a = document.createElement("a")
      a.download = `qr-${eventSlug}.png`
      a.href = canvas.toDataURL()
      a.click()
    }
  }

  return (
    <div style={pageStyle}>

      <header style={headerStyle}>
        <div style={brandRowWithLogout}>
          <div style={brandRow}>
            <div style={brandMark}>SM</div>
            <div>
              <div style={brandTitle}>Share Memories</div>
              <div style={brandSub}>Admin</div>
            </div>
          </div>
          <button onClick={logout} style={logoutBtn}>
            Uitloggen
          </button>
        </div>
      </header>

      <main style={mainStyle}>

        <section style={statsGrid}>
          <StatCard label="Events" value={stats.events} />
          <StatCard label="Foto's" value={stats.photos} />
          <StatCard label="Video's" value={stats.videos} />
          <StatCard label="Opslag" value={`${stats.storage.toFixed(1)} MB`} />
        </section>

        <section style={panelStyle}>
          <div style={panelHeaderRow}>
            <h2 style={panelTitle}>Nieuw event</h2>
          </div>

          <div style={newEventRow}>
            <input
              placeholder="Naam, bijv. Bruiloft Lisa & Tom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
            />
            <input
              placeholder="Slug, bijv. lisa-tom"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              style={inputStyle}
            />
            <button onClick={createEvent} style={primaryBtnSmall}>
              Aanmaken
            </button>
          </div>
          {slug && (
            <p style={slugPreview}>
              Link wordt: {BASE_URL}/event/{slugify(slug)}
            </p>
          )}
        </section>

        <section style={{ marginTop: 48 }}>
          <div style={sectionHeaderRow}>
            <h2 style={sectionTitle}>Events</h2>
            <span style={sectionCount}>{events.length}</span>
          </div>

          {loading && events.length === 0 && (
            <p style={emptyText}>Events worden geladen…</p>
          )}

          {!loading && events.length === 0 && (
            <div style={emptyState}>
              <p style={emptyText}>Nog geen events. Maak hierboven je eerste event aan.</p>
            </div>
          )}

          <div style={eventGrid}>
            {events.map((e) => {
              const url = `${BASE_URL}/event/${e.slug}`
              const isOpen = e.status === "open"

              return (
                <article key={e.id} style={eventCard}>

                  <div style={cardTop}>
                    <div style={monogram}>{e.name?.charAt(0)?.toUpperCase() || "?"}</div>
                    <select
                      value={e.status}
                      onChange={(ev) => toggleEvent(e.id, ev.target.value)}
                      style={isOpen ? statusPillOpen : statusPillClosed}
                    >
                      <option value="open">Open</option>
                      <option value="closed">Gesloten</option>
                    </select>
                  </div>

                  {e.header_image ? (
                    <img src={e.header_image} style={coverImg} alt="" />
                  ) : (
                    <div style={coverPlaceholder}>
                      <span>Nog geen header</span>
                    </div>
                  )}

                  <button
                    onClick={() => setHeaderPickerFor(headerPickerFor === e.id ? null : e.id)}
                    style={changeCoverText}
                  >
                    {e.header_image ? "Header wijzigen" : "Header kiezen"}
                  </button>

                  {headerPickerFor === e.id && (
                    <div style={headerPickerGrid}>
                      {PRESET_HEADERS.map((preset) => (
                        <button
                          key={preset.label}
                          onClick={() => setPresetHeader(e.id, preset.url)}
                          style={headerPickerTile}
                        >
                          <img src={preset.url} style={headerPickerThumb} alt={preset.label} />
                          <span style={headerPickerLabel}>{preset.label}</span>
                        </button>
                      ))}

                      <label style={headerPickerTile}>
                        <div style={headerPickerUploadIcon}>+</div>
                        <span style={headerPickerLabel}>Eigen upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(ev) => uploadHeader(ev, e.id)}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>
                  )}

                  <h3 style={eventName}>{e.name}</h3>
                  <div style={eventSlugText}>share-memories.nl/event/{e.slug}</div>

                  <div style={metaRow}>
                    <span>{e.guests} gasten</span>
                    <span style={metaDot}>•</span>
                    <span>{e.photos} foto's</span>
                    <span style={metaDot}>•</span>
                    <span>{e.videos} video's</span>
                  </div>

                  <div style={qrRow}>
                    <div style={qrBox}>
                      <QRCode value={url} size={84} data-slug={e.slug} />
                    </div>
                    <div style={qrActions}>
                      <a href={url} target="_blank" style={ghostBtn}>Event openen</a>
                      <a href={`${url}/live`} target="_blank" style={ghostBtn}>Live-muur openen</a>
                      <button onClick={() => downloadQR(e.slug)} style={ghostBtn}>
                        QR downloaden
                      </button>
                    </div>
                  </div>

                  <div style={cardActions}>
                    <button onClick={() => viewUploads(e.id)} style={ghostBtnFull}>
                      {viewEvent === e.id ? "Uploads verbergen" : "Uploads bekijken"}
                    </button>
                    <button onClick={() => editEvent(e)} style={ghostBtnFull}>
                      Bewerken
                    </button>
                    <button onClick={() => deleteEvent(e.id)} style={dangerBtnFull}>
                      Verwijderen
                    </button>
                  </div>

                </article>
              )
            })}
          </div>
        </section>

        {viewEvent && (
          <section style={{ ...panelStyle, marginTop: 32 }}>
            <h2 style={panelTitle}>Uploads</h2>

            {uploads.length === 0 ? (
              <p style={emptyText}>Nog geen uploads voor dit event.</p>
            ) : (
              <div style={uploadsGrid}>
                {uploads.map((u) => {
                  const isImage = u.type === "image"
                  return (
                    <div key={u.id} style={uploadTile}>
                      {isImage ? (
                        <img src={u.file_url} style={uploadMedia} alt="" />
                      ) : (
                        <video src={u.file_url} style={uploadMedia} controls />
                      )}
                      <button onClick={() => deleteUpload(u)} style={uploadDeleteBtn}>
                        Verwijderen
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        )}

        {editing && (
          <section style={{ ...panelStyle, marginTop: 32 }}>
            <h2 style={panelTitle}>Event bewerken</h2>

            <div style={editForm}>
              <label style={fieldLabel}>Naam</label>
              <input
                value={editing.name}
                onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                style={inputStyle}
              />

              <label style={fieldLabel}>Slug</label>
              <input
                value={editing.slug}
                onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                style={inputStyle}
              />

              <label style={fieldLabel}>Downloadwachtwoord (optioneel)</label>
              <input
                placeholder="Leeg = geen wachtwoord"
                value={editing.download_password || ""}
                onChange={(e) => setEditing({ ...editing, download_password: e.target.value })}
                style={inputStyle}
              />

              <div style={editActions}>
                <button onClick={saveEvent} style={primaryBtnSmall}>Opslaan</button>
                <button onClick={() => setEditing(null)} style={ghostBtn}>Annuleren</button>
              </div>
            </div>
          </section>
        )}

      </main>

      {toast && (
        <div style={toastStyle}>{toast}</div>
      )}

    </div>
  )
}

function StatCard({ label, value }: { label: string, value: string | number }) {
  return (
    <div style={statCard}>
      <div style={statValue}>{value}</div>
      <div style={statLabel}>{label}</div>
    </div>
  )
}

/* ===== DESIGN TOKENS =====
   ink        #1c1a17  — near-black warm charcoal, header + text
   ivory      #f7f2ea  — warm paper background
   card       #fffdf9  — slightly lighter than ivory for cards
   gold       #b8935a  — muted antique gold, primary accent
   gold-soft  #e9dcc3  — pale gold for borders/tints
   clay       #a8785a  — secondary warm neutral
   ok         #6b7d5f  — muted sage for "open"
   danger     #a34a3d  — muted brick for delete/closed
   Display type: Georgia/ui-serif stack (swap for "Fraunces" via next/font for full effect)
   Body type: system sans stack (swap for "Inter" via next/font for full effect)
*/

const ink = "#1c1a17"
const ivory = "#f7f2ea"
const card = "#fffdf9"
const gold = "#b8935a"
const goldSoft = "#e9dcc3"
const clay = "#8a6a54"
const ok = "#6b7d5f"
const danger = "#a34a3d"

const serif = 'var(--font-serif), "Iowan Old Style", "Palatino Linotype", Georgia, serif'
const sans = 'var(--font-inter), -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'

/* ===== SHELL ===== */

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: ivory,
  fontFamily: sans,
  color: ink
}

const headerStyle: CSSProperties = {
  background: ink,
  padding: "18px 40px",
  position: "sticky",
  top: 0,
  zIndex: 10
}

const brandRow: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12
}

const brandRowWithLogout: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  maxWidth: 1200,
  margin: "0 auto"
}

const logoutBtn: CSSProperties = {
  background: "transparent",
  border: `1px solid ${gold}`,
  color: gold,
  borderRadius: 2,
  padding: "8px 14px",
  fontSize: 12,
  letterSpacing: 0.5,
  cursor: "pointer"
}

const brandMark: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: "50%",
  border: `1px solid ${gold}`,
  color: gold,
  fontFamily: serif,
  fontSize: 13,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const brandTitle: CSSProperties = {
  fontFamily: serif,
  color: "#f5efe4",
  fontSize: 16,
  lineHeight: 1.2
}

const brandSub: CSSProperties = {
  fontSize: 10,
  color: gold,
  letterSpacing: 2,
  textTransform: "uppercase"
}

const mainStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "40px 40px 80px"
}

/* ===== STATS ===== */

const statsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: 16,
  marginBottom: 32
}

const statCard: CSSProperties = {
  background: card,
  border: `1px solid ${goldSoft}`,
  borderRadius: 4,
  padding: "20px 22px"
}

const statValue: CSSProperties = {
  fontFamily: serif,
  fontSize: 30,
  color: ink,
  fontWeight: 500
}

const statLabel: CSSProperties = {
  fontSize: 11,
  letterSpacing: 1.5,
  textTransform: "uppercase",
  color: clay,
  marginTop: 4
}

/* ===== PANEL / FORM ===== */

const panelStyle: CSSProperties = {
  background: card,
  border: `1px solid ${goldSoft}`,
  borderRadius: 4,
  padding: 28
}

const panelHeaderRow: CSSProperties = {
  marginBottom: 16
}

const panelTitle: CSSProperties = {
  fontFamily: serif,
  fontSize: 19,
  fontWeight: 500,
  margin: 0
}

const newEventRow: CSSProperties = {
  display: "flex",
  gap: 12,
  flexWrap: "wrap"
}

const slugPreview: CSSProperties = {
  fontSize: 12,
  color: clay,
  marginTop: 8
}

const inputStyle: CSSProperties = {
  flex: 1,
  minWidth: 200,
  padding: "11px 14px",
  borderRadius: 2,
  border: "1px solid #e4dcc9",
  fontSize: 14,
  fontFamily: sans,
  background: ivory,
  boxSizing: "border-box"
}

/* ===== SECTION HEADER ===== */

const sectionHeaderRow: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: 10,
  marginBottom: 20
}

const sectionTitle: CSSProperties = {
  fontFamily: serif,
  fontSize: 22,
  fontWeight: 500,
  margin: 0
}

const sectionCount: CSSProperties = {
  fontSize: 13,
  color: clay
}

const emptyState: CSSProperties = {
  border: `1px dashed ${goldSoft}`,
  borderRadius: 4,
  padding: 40,
  textAlign: "center"
}

const emptyText: CSSProperties = {
  color: clay,
  fontSize: 14
}

/* ===== EVENT CARDS ===== */

const eventGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: 22
}

const eventCard: CSSProperties = {
  background: card,
  border: `1px solid ${goldSoft}`,
  borderRadius: 4,
  padding: 20,
  display: "flex",
  flexDirection: "column"
}

const cardTop: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12
}

const monogram: CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: "50%",
  background: ink,
  color: gold,
  fontFamily: serif,
  fontSize: 15,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}

const statusPillBase: CSSProperties = {
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  border: "none",
  borderRadius: 20,
  padding: "5px 12px",
  cursor: "pointer",
  fontFamily: sans
}

const statusPillOpen: CSSProperties = {
  ...statusPillBase,
  background: "#eaeee3",
  color: ok
}

const statusPillClosed: CSSProperties = {
  ...statusPillBase,
  background: "#f2e3df",
  color: danger
}

const coverImg: CSSProperties = {
  width: "100%",
  height: 140,
  objectFit: "cover",
  borderRadius: 3,
  marginBottom: 14
}

const coverPlaceholder: CSSProperties = {
  width: "100%",
  height: 140,
  borderRadius: 3,
  border: `1px dashed ${goldSoft}`,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: clay,
  fontSize: 13,
  marginBottom: 14,
  cursor: "pointer",
  background: ivory
}

const eventName: CSSProperties = {
  fontFamily: serif,
  fontSize: 18,
  fontWeight: 500,
  margin: 0
}

const eventSlugText: CSSProperties = {
  fontSize: 12,
  color: clay,
  marginTop: 4,
  marginBottom: 12
}

const metaRow: CSSProperties = {
  display: "flex",
  gap: 8,
  fontSize: 12,
  color: ink,
  marginBottom: 16
}

const metaDot: CSSProperties = {
  color: goldSoft
}

const qrRow: CSSProperties = {
  display: "flex",
  gap: 14,
  alignItems: "center",
  background: ivory,
  border: `1px solid ${goldSoft}`,
  borderRadius: 3,
  padding: 12,
  marginBottom: 8
}

const qrBox: CSSProperties = {
  background: "#fff",
  padding: 6,
  borderRadius: 2
}

const qrActions: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  flex: 1
}

const changeCoverText: CSSProperties = {
  display: "block",
  width: "100%",
  fontSize: 11,
  color: gold,
  textAlign: "center",
  cursor: "pointer",
  marginBottom: 12,
  background: "transparent",
  border: "none",
  textDecoration: "underline",
  fontFamily: sans,
  padding: 0
}

const headerPickerGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: 8,
  marginBottom: 14
}

const headerPickerTile: CSSProperties = {
  background: ivory,
  border: `1px solid ${goldSoft}`,
  borderRadius: 3,
  padding: 8,
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 6
}

const headerPickerThumb: CSSProperties = {
  width: "100%",
  height: 60,
  objectFit: "cover",
  borderRadius: 2
}

const headerPickerUploadIcon: CSSProperties = {
  width: "100%",
  height: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 22,
  color: gold,
  border: `1px dashed ${goldSoft}`,
  borderRadius: 2
}

const headerPickerLabel: CSSProperties = {
  fontSize: 11,
  color: ink,
  textAlign: "center"
}

const cardActions: CSSProperties = {
  display: "flex",
  gap: 8,
  marginTop: "auto",
  paddingTop: 12
}

/* ===== BUTTONS ===== */

const primaryBtnSmall: CSSProperties = {
  padding: "11px 20px",
  borderRadius: 2,
  background: ink,
  color: gold,
  border: "none",
  fontSize: 13,
  letterSpacing: 0.5,
  cursor: "pointer",
  whiteSpace: "nowrap"
}

const ghostBtn: CSSProperties = {
  padding: "8px 12px",
  borderRadius: 2,
  border: `1px solid ${goldSoft}`,
  background: "transparent",
  color: ink,
  fontSize: 12,
  textAlign: "center",
  textDecoration: "none",
  cursor: "pointer",
  display: "block"
}

const ghostBtnFull: CSSProperties = {
  ...ghostBtn,
  flex: 1
}

const dangerBtnFull: CSSProperties = {
  flex: 1,
  padding: "8px 12px",
  borderRadius: 2,
  border: `1px solid #e3c9c3`,
  background: "transparent",
  color: danger,
  fontSize: 12,
  cursor: "pointer"
}

/* ===== UPLOADS ===== */

const uploadsGrid: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, 130px)",
  gap: 12,
  marginTop: 16
}

const uploadTile: CSSProperties = {
  background: ivory,
  border: `1px solid ${goldSoft}`,
  borderRadius: 3,
  padding: 6
}

const uploadMedia: CSSProperties = {
  width: "100%",
  height: 110,
  objectFit: "cover",
  borderRadius: 2
}

const uploadDeleteBtn: CSSProperties = {
  width: "100%",
  marginTop: 6,
  padding: "6px",
  fontSize: 11,
  border: "none",
  borderRadius: 2,
  background: "transparent",
  color: danger,
  cursor: "pointer"
}

/* ===== EDIT FORM ===== */

const editForm: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  maxWidth: 420
}

const fieldLabel: CSSProperties = {
  fontSize: 11,
  letterSpacing: 1,
  textTransform: "uppercase",
  color: clay,
  marginTop: 10
}

const editActions: CSSProperties = {
  display: "flex",
  gap: 10,
  marginTop: 20
}

/* ===== TOAST ===== */

const toastStyle: CSSProperties = {
  position: "fixed",
  bottom: 28,
  left: "50%",
  transform: "translateX(-50%)",
  background: ink,
  color: "#f5efe4",
  padding: "12px 22px",
  borderRadius: 3,
  fontSize: 13,
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  border: `1px solid ${gold}`
}
