import { NextResponse } from "next/server"
import JSZip from "jszip"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {

const { searchParams } = new URL(req.url)
const eventId = searchParams.get("event")

if (!eventId) {
return NextResponse.json({ error: "No event id" }, { status: 400 })
}

const { data: uploads } = await supabase
.from("uploads")
.select("*")
.eq("event_id", eventId)

if (!uploads || uploads.length === 0) {
return NextResponse.json({ error: "No uploads found" })
}

const zip = new JSZip()

const mediaFolder = zip.folder("Media")
const messagesFolder = zip.folder("Berichten")

const messages: Record<string, string> = {}

/* LOOP UPLOADS */

for (const u of uploads) {

/* MEDIA FILES */

if (u.file_url) {

const res = await fetch(u.file_url)
const buffer = await res.arrayBuffer()

const filename = u.file_url.split("/").pop()

mediaFolder?.file(filename!, buffer)

}

/* BERICHTEN */

if (u.name && u.message) {

if (!messages[u.name]) {
messages[u.name] = u.message
}

}

}

/* CSV MAKEN */

let csv = "Naam,Bericht\n"

for (const name in messages) {

const message = messages[name].replace(/,/g, " ")

csv += `${name},${message}\n`

}

messagesFolder?.file("berichten.csv", csv)

/* ZIP GENEREREN */

const content = await zip.generateAsync({
type: "uint8array"
})

return new NextResponse(content as any, {
headers: {
"Content-Type": "application/zip",
"Content-Disposition": "attachment; filename=event-download.zip"
}
})

}