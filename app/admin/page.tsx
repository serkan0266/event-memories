"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"
import type { CSSProperties } from "react"

export default function AdminPage(){

const ADMIN_PASSWORD="66"

// 🔥 NIEUW: centraal domein
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

const {data}=await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false})

if(!data) return

let list:any[]=[]
let totalPhotos=0
let totalVideos=0
let totalStorage=0

for(const e of data){

const {data:uploads}=await supabase
.from("uploads")
.select("*")
.eq("event_id",e.id)

let photos=0
let videos=0
let guests=new Set()

uploads?.forEach((u:any)=>{

if(u.type==="image") photos++
if(u.type==="video") videos++
if(u.name) guests.add(u.name)

})

const storage=(uploads?.length||0)*5

totalPhotos+=photos
totalVideos+=videos
totalStorage+=storage

list.push({
...e,
photos,
videos,
guests:guests.size,
storage
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
status:"open"
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


async function deleteUpload(id:string){

if(!confirm("Foto verwijderen?")) return

await supabase
.from("uploads")
.delete()
.eq("id",id)

setUploads(uploads.filter(u=>u.id!==id))

}


function editEvent(event:any){
setEditing({...event})
}


async function saveEvent(){

await supabase
.from("events")
.update({
name:editing.name,
slug:editing.slug
})
.eq("id",editing.id)

setEditing(null)

loadEvents()

}


async function deleteEvent(id:string){

if(!confirm("Event verwijderen?")) return

await supabase
.from("events")
.delete()
.eq("id",id)

loadEvents()

}


async function uploadHeader(e:any,eventId:string){

const file=e.target.files[0]
if(!file) return

const path=`headers/${Date.now()}-${file.name}`

const {error}=await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
alert("Upload fout")
return
}

const {data:url}=supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase
.from("events")
.update({header_image:url.publicUrl})
.eq("id",eventId)

alert("Header geupload")

loadEvents()

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
<div style={statCard}><h3>Storage</h3><b>{stats.storage} MB</b></div>

</div>


<div style={cardStyle}>

<h3>Nieuw event maken</h3>

<div style={{display:"flex",gap:10}}>

<input
placeholder="Event naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={inputStyle}
/>

<input
placeholder="Slug"
value={slug}
onChange={(e)=>setSlug(e.target.value)}
style={inputStyle}
/>

<button onClick={createEvent} style={goldBtnSmall}>
Maak event
</button>

</div>

</div>


<h2 style={{marginTop:40}}>Events</h2>

<div style={eventGrid}>

{events.map((e)=>{

// 🔥 FIXED URL
const url = `${BASE_URL}/event/${e.slug}`

return(

<div key={e.id} style={cardStyle}>

<h3>{e.name}</h3>

<select
value={e.status}
onChange={(ev)=>toggleEvent(e.id,ev.target.value)}
style={btnStyle}
>
<option value="open">✅ Event open</option>
<option value="closed">❌ Event gesloten</option>
</select>

<p>👥 {e.guests} gasten hebben geupload</p>
<p>📸 {e.photos} foto's</p>
<p>🎥 {e.videos} video's</p>
<p>💾 {e.storage} MB</p>

<QRCode value={url} size={120}/>

<input type="file" onChange={(ev)=>uploadHeader(ev,e.id)} />

<a href={url} target="_blank" style={btnStyle}>
Open Event
</a>

<button onClick={()=>viewUploads(e.id)} style={btnStyle}>
Uploads bekijken
</button>

<button onClick={downloadQR} style={btnStyle}>
Download QR
</button>

<a href={`/api/zip?event=${e.id}`} style={goldBtn}>
Download ZIP
</a>

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


{editing && (

<div style={{marginTop:40,...cardStyle}}>

<h2>Event bewerken</h2>

<input
value={editing.name}
onChange={(e)=>setEditing({...editing,name:e.target.value})}
style={inputStyle}
/>

<input
value={editing.slug}
onChange={(e)=>setEditing({...editing,slug:e.target.value})}
style={inputStyle}
/>

<button onClick={saveEvent} style={goldBtnSmall}>
Opslaan
</button>

</div>

)}


{viewEvent && (

<div style={{marginTop:50}}>

<h2>Uploads</h2>

<div style={uploadGrid}>

{uploads.map((u)=>(

<div key={u.id} style={cardStyle}>

{u.type==="image" && (
<img src={u.file_url} style={{width:"100%",borderRadius:6}}/>
)}

<p><b>{u.name}</b></p>
<p>{u.message}</p>

<a href={u.file_url} target="_blank">Download</a>

<button
onClick={()=>deleteUpload(u.id)}
style={{
marginTop:10,
background:"red",
color:"#fff",
border:"none",
padding:"8px",
borderRadius:6,
width:"100%"
}}
>
Foto verwijderen
</button>

</div>

))}

</div>

</div>

)}

</div>

)

}


/* STYLES */

const containerStyle:CSSProperties={
background:"#f5efe6",
minHeight:"100vh",
padding:40
}

const loginStyle:CSSProperties={
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
flexDirection:"column",
background:"#f5efe6"
}

const loginInput:CSSProperties={
width:220,
padding:10,
borderRadius:8,
border:"1px solid #ccc",
marginBottom:10
}

const statsGrid:CSSProperties={
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:20,
marginBottom:40
}

const eventGrid:CSSProperties={
display:"grid",
gridTemplateColumns:"repeat(auto-fill,320px)",
gap:25
}

const uploadGrid:CSSProperties={
display:"grid",
gridTemplateColumns:"repeat(auto-fill,200px)",
gap:20
}

const statCard:CSSProperties={
background:"#fff",
padding:20,
borderRadius:12,
boxShadow:"0 2px 8px rgba(0,0,0,0.05)"
}

const cardStyle:CSSProperties={
background:"#fff",
padding:20,
borderRadius:12,
boxShadow:"0 3px 10px rgba(0,0,0,0.05)"
}

const inputStyle:CSSProperties={
padding:10,
borderRadius:8,
border:"1px solid #ccc",
width:"100%"
}

const btnStyle:CSSProperties={
display:"block",
marginTop:10,
padding:"10px",
borderRadius:8,
border:"1px solid #ddd",
background:"#fff",
width:"100%",
textAlign:"center"
}

const goldBtn:CSSProperties={
display:"block",
marginTop:10,
padding:"10px",
borderRadius:8,
background:"#d4a24c",
color:"#fff",
border:"none",
width:"100%",
textAlign:"center"
}

const goldBtnSmall:CSSProperties={
padding:"10px 16px",
borderRadius:8,
background:"#d4a24c",
color:"#fff",
border:"none"
}

const deleteBtn:CSSProperties={
display:"block",
marginTop:10,
padding:"10px",
borderRadius:8,
background:"red",
color:"#fff",
border:"none",
width:"100%"
}