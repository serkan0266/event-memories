import { NextRequest } from "next/server"
import JSZip from "jszip"
import { createClient } from "@supabase/supabase-js"

// Video's zijn groot — geef de functie meer tijd dan de Vercel-standaard.
// Werkt tot 60s op het Hobby-plan zonder extra instellingen.
export const maxDuration = 60

const IMAGE_BATCH_SIZE = 100
const VIDEO_BATCH_SIZE = 8

export async function GET(req: NextRequest) {

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { searchParams } = new URL(req.url)
  const eventId = searchParams.get("event")
  const batch = Number(searchParams.get("batch") || 1)
  const type = searchParams.get("type") === "video" ? "video" : "image"

  if (!eventId) {
    return new Response("Missing event id", { status: 400 })
  }

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single()

  if (!event) {
    return new Response("Event not found", { status: 404 })
  }

  const { data: uploads } = await supabase
    .from("uploads")
    .select("*")
    .eq("event_id", eventId)
    .order("created_at", { ascending: true })

  if (!uploads) {
    return new Response("No uploads", { status: 404 })
  }

  const filtered = uploads.filter(u => u.type === type)
  const batchSize = type === "video" ? VIDEO_BATCH_SIZE : IMAGE_BATCH_SIZE

  const start = (batch - 1) * batchSize
  const end = start + batchSize
  const selected = filtered.slice(start, end)

  if (selected.length === 0) {
    return new Response("Nothing to zip for this batch", { status: 404 })
  }

  const zip = new JSZip()
  const mediaFolder = zip.folder("media")

  for (const item of selected) {
    try {
      const res = await fetch(item.file_url)

      if (!res.ok) {
        console.log("skip file (bad response)", item.file_url)
        continue
      }

      const blob = await res.arrayBuffer()
      const fileName = item.file_url.split("/").pop()?.split("?")[0]
      mediaFolder?.file(fileName || `${item.id}`, blob)
    } catch (e) {
      console.log("skip file", item.file_url)
    }
  }

  // Berichten alleen bij de eerste foto-ZIP, niet bij elke video-batch
  if (type === "image" && batch === 1) {
    const messages = uploads
      .filter(u => u.name || u.message)
      .map(u => `Naam: ${u.name || "-"}\nBericht: ${u.message || "-"}\n\n`)
      .join("")

    zip.folder("berichten")?.file("berichten.txt", messages)
  }

  const content = await zip.generateAsync({ type: "arraybuffer" })

  const cleanName = event.name
    .replace(/[^a-z0-9]/gi, "-")
    .toLowerCase()

  const fileName = `${cleanName}-${type}-${batch}.zip`

  return new Response(content, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename=${fileName}`
    }
  })
}
