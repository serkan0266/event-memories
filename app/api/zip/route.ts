import { NextResponse } from "next/server"
import JSZip from "jszip"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req:Request){

const { searchParams } = new URL(req.url)
const eventId = searchParams.get("event")

if(!eventId){
return NextResponse.json({error:"No event id"}, {status:400})
}

const {data:uploads} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)

if(!uploads){
return NextResponse.json({error:"No uploads"})
}

const zip = new JSZip()

const mediaFolder = zip.folder("Media")
const messagesFolder = zip.folder("Berichten")

const messages:Record<string,string> = {}

for(const u of uploads){

/* MEDIA */

if(u.file_url){

const res = await fetch(u.file_url)
const buffer = await res.arrayBuffer()

const filename = u.file_url.split("/").pop()

mediaFolder?.file(filename,buffer)

}

/* BERICHTEN */

if(u.name && u.message){

if(!messages[u.name]){
messages[u.name] = u.message
}

}

}

/* CSV FILE */

let csv = "Naam,Bericht\n"

for(const name in messages){

const message = messages[name].replace(/,/g," ")

csv += `${name},${message}\n`

}

messagesFolder?.file("berichten.csv",csv)

const content = await zip.generateAsync({type:"nodebuffer"})

return new NextResponse(content,{
headers:{
"Content-Type":"application/zip",
"Content-Disposition":"attachment; filename=event-download.zip"
}
})

}