"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"
import type { CSSProperties } from "react"

export default function AdminPage(){

const ADMIN_PASSWORD="66"
const BASE_URL = "https://app.sharememories.nl"

const [loggedIn,setLoggedIn]=useState(false)
const [password,setPassword]=useState("")

const [events,setEvents]=useState<any[]>([])
const [uploads,setUploads]=useState<any[]>([])

const [viewEvent,setViewEvent]=useState<string | null>(null)
const [editing,setEditing]=useState<any>(null)

const [name,setName]=useState("")
const [slug,setSlug]=useState("")

const [stats,setStats]=useState({
events:0,
photos:0,
videos:0,
storage:0
})

useEffect(()=>{
if(loggedIn){
loadEvents()
}
},[loggedIn])


function login(){
if(password===ADMIN_PASSWORD){
setLoggedIn(true)
}else{
alert("Verkeerd wachtwoord")
}
}


async function loadEvents(){

const {data,error}=await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false})

if(error){
console.error("EVENT ERROR:",error)
return
}

if(!data) return

let list:any[]=[]
let totalPhotos=0
let totalVideos=0
let totalStorage=0

for(const e of data){

const {data:uploads,error:uploadError}=await supabase
.from("uploads")
.select("*")
.eq("event_id",e.id)

if(uploadError){
console.error("UPLOAD ERROR:",uploadError)
continue
}

let photos=0
let videos=0
let guests=new Set()

uploads?.forEach((u:any)=>{
if(u.type==="image") photos++
if(u.type==="video") videos++
if(u.name) guests.add(u.name)
})

let storageBytes = 0
uploads?.forEach((file:any)=>{
if(file.file_size){
storageBytes += Number(file.file_size)
}
})

const storageMB = storageBytes / 1024 / 1024

totalPhotos+=photos
totalVideos+=videos
totalStorage+=storageMB

list.push({
...e,
photos,
videos,
guests:guests.size,
storage: storageMB
})

}

setEvents(list)

setStats({
events:data.length,
photos:totalPhotos,
videos:totalVideos,
storage:totalStorage
})

}


async function createEvent(){

if(!name||!slug) return

await supabase.from("events").insert({
name,
slug,
status:"open",
download_password:""
})

setName("")
setSlug("")

loadEvents()

}


async function toggleEvent(id:string,status:string){

await supabase
.from("events")
.update({status})
.eq("id",id)

loadEvents()

}


async function viewUploads(eventId:string){

if(viewEvent===eventId){
setViewEvent(null)
return
}

setViewEvent(eventId)

const {data}=await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)

setUploads(data||[])

}


// DELETE UPLOAD + STORAGE
async function deleteUpload(upload:any){

if(!confirm("Foto verwijderen?")) return

const path = upload.file_url.split("/uploads/")[1]

if(path){
await supabase.storage.from("uploads").remove([path])
}

await supabase.from("uploads").delete().eq("id",upload.id)

setUploads(uploads.filter(u=>u.id!==upload.id))

}


// DELETE EVENT + ALLES
async function deleteEvent(id:string){

if(!confirm("Event verwijderen?")) return

const {data:files}=await supabase
.from("uploads")
.select("*")
.eq("event_id",id)

if(files){
const paths = files.map(f=>f.file_url.split("/uploads/")[1]).filter(Boolean)

if(paths.length){
await supabase.storage.from("uploads").remove(paths)
}
}

await supabase.from("uploads").delete().eq("event_id",id)
await supabase.from("events").delete().eq("id",id)

loadEvents()

}


function editEvent(event:any){
setEditing({...event})
}


async function saveEvent(){

await supabase
.from("events")
.update({
name:editing.name,
slug:editing.slug,
download_password: editing.download_password || ""
})
.eq("id",editing.id)

setEditing(null)
loadEvents()

}


// 🔥 FIXED HEADER UPLOAD (MET DEBUG)
async function uploadHeader(e:any,eventId:string){

const file = e.target.files?.[0]
if(!file) return

try{

const fileExt = file.name.split(".").pop()
const fileName = `header-${Date.now()}.${fileExt}`
const filePath = `headers/${fileName}`

console.log("📤 Upload start")
console.log("Bucket: uploads")
console.log("Path:", filePath)

const { data: uploadData, error } = await supabase.storage
.from("uploads")
.upload(filePath, file, {
cacheControl: "3600",
upsert: true,
contentType: file.type
})

if(error){
console.error("❌ UPLOAD ERROR:", error)
alert("Upload fout: " + error.message)
return
}

console.log("✅ UPLOAD SUCCESS:", uploadData)

const { data: publicUrlData } = supabase.storage
.from("uploads")
.getPublicUrl(filePath)

console.log("🌍 PUBLIC URL:", publicUrlData.publicUrl)

await supabase
.from("events")
.update({ header_image: publicUrlData.publicUrl })
.eq("id", eventId)

alert("Header geupload")

loadEvents()

}catch(err){
console.error("❌ CATCH ERROR:", err)
alert("Iets ging fout")
}

}


function downloadQR(){

const svg=document.querySelector("svg")
if(!svg) return

const data=new XMLSerializer().serializeToString(svg)

const canvas=document.createElement("canvas")
const img=new Image()

img.src="data:image/svg+xml;base64,"+btoa(data)

img.onload=()=>{

canvas.width=img.width
canvas.height=img.height

const ctx=canvas.getContext("2d")
ctx?.drawImage(img,0,0)

const a=document.createElement("a")
a.download="qr-code.png"
a.href=canvas.toDataURL()
a.click()

}

}


if(!loggedIn){

return(

<div style={loginStyle}>

<h2>Memories Admin</h2>

<input
type="password"
placeholder="Wachtwoord"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={loginInput}
/>

<button onClick={login} style={goldBtnSmall}>
Login
</button>

</div>

)

}


return(

<div style={containerStyle}>

<h1>Memories Admin</h1>

<div style={statsGrid}>
<div style={statCard}><h3>Events</h3><b>{stats.events}</b></div>
<div style={statCard}><h3>Foto's</h3><b>{stats.photos}</b></div>
<div style={statCard}><h3>Video's</h3><b>{stats.videos}</b></div>
<div style={statCard}><h3>Storage</h3><b>{stats.storage.toFixed(2)} MB</b></div>
</div>

<div style={cardStyle}>

<h3>Nieuw event maken</h3>

<div style={{display:"flex",gap:10}}>

<input placeholder="Event naam" value={name} onChange={(e)=>setName(e.target.value)} style={inputStyle}/>
<input placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} style={inputStyle}/>

<button onClick={createEvent} style={goldBtnSmall}>
Maak event
</button>

</div>

</div>

<h2 style={{marginTop:40}}>Events</h2>

<div style={eventGrid}>

{events.map((e)=>{

const url = `${BASE_URL}/event/${e.slug}`

return(

<div key={e.id} style={cardStyle}>

<h3>{e.name}</h3>

<select value={e.status} onChange={(ev)=>toggleEvent(e.id,ev.target.value)} style={btnStyle}>
<option value="open">✅ Event open</option>
<option value="closed">❌ Event gesloten</option>
</select>

<p>👥 {e.guests} gasten hebben geupload</p>
<p>📸 {e.photos} foto's</p>
<p>🎥 {e.videos} video's</p>
<p>💾 {e.storage.toFixed(2)} MB</p>

<QRCode value={url} size={120}/>

{e.header_image && (
<img
src={e.header_image}
style={{
width:"100%",
height:120,
objectFit:"cover",
borderRadius:8,
marginTop:10
}}
/>
)}

<input type="file" onChange={(ev)=>uploadHeader(ev,e.id)} />

<a href={url} target="_blank" style={btnStyle}>Open Event</a>

<button onClick={()=>viewUploads(e.id)} style={btnStyle}>
Uploads bekijken
</button>

<button onClick={downloadQR} style={btnStyle}>
Download QR
</button>

<button onClick={()=>editEvent(e)} style={btnStyle}>
Bewerken
</button>

<button onClick={()=>deleteEvent(e.id)} style={deleteBtn}>
Verwijderen
</button>

</div>

)

})}

</div>

</div>

)

}