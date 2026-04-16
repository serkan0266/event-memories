import { NextRequest } from "next/server"
import JSZip from "jszip"
import { createClient } from "@supabase/supabase-js"

export async function GET(req: NextRequest){

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const { searchParams } = new URL(req.url)
const eventId = searchParams.get("event")
const batch = Number(searchParams.get("batch") || 1)

if(!eventId){
return new Response("Missing event id",{status:400})
}

// 🔥 event ophalen
const {data:event} = await supabase
.from("events")
.select("*")
.eq("id",eventId)
.single()

// 🔥 uploads ophalen
const {data:uploads} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)
.order("created_at",{ascending:true})

if(!uploads){
return new Response("No uploads",{status:404})
}

// 🔥 alleen images
const images = uploads.filter(u=>u.type==="image")

// 🔥 batch slicing
const batchSize = 100
const start = (batch - 1) * batchSize
const end = start + batchSize

const selectedImages = images.slice(start,end)

// 🔥 zip maken
const zip = new JSZip()

// 📁 media folder
const mediaFolder = zip.folder("media")

// 🔥 images toevoegen
for(const img of selectedImages){

try{
const res = await fetch(img.file_url)
const blob = await res.arrayBuffer()

const fileName = img.file_url.split("/").pop()
mediaFolder?.file(fileName!, blob)
}catch(e){
console.log("skip file",img.file_url)
}

}


// 🔥 ALLEEN IN ZIP 1 → berichten
if(batch === 1){

const messages = uploads
.filter(u=>u.name || u.message)
.map(u=>`Naam: ${u.name || "-"}\nBericht: ${u.message || "-"}\n\n`)
.join("")

zip.folder("berichten")?.file("berichten.txt",messages)

}


// 🔥 zip genereren
const content = await zip.generateAsync({type:"arraybuffer"})

// 🔥 bestandsnaam netjes maken
const cleanName = event.name
.replace(/[^a-z0-9]/gi,"-")
.toLowerCase()

const fileName = `${cleanName}-zip-${batch}.zip`

return new Response(content,{
headers:{
"Content-Type":"application/zip",
"Content-Disposition":`attachment; filename=${fileName}`
}
})

}