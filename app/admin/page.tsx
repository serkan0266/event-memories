"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"

export default function AdminPage() {

const ADMIN_PASSWORD = "66"

const [loggedIn,setLoggedIn] = useState(false)
const [password,setPassword] = useState("")

const [events,setEvents] = useState<any[]>([])
const [uploads,setUploads] = useState<any[]>([])

const [viewEvent,setViewEvent] = useState<string | null>(null)
const [editing,setEditing] = useState<any>(null)

const [name,setName] = useState("")
const [slug,setSlug] = useState("")

const [stats,setStats] = useState({
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

if(password === ADMIN_PASSWORD){
setLoggedIn(true)
}else{
alert("Verkeerd wachtwoord")
}

}


async function loadEvents(){

const {data} = await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false})

if(!data) return

let list:any[] = []
let totalPhotos=0
let totalVideos=0
let totalStorage=0

for(const e of data){

const {data:uploads} = await supabase
.from("uploads")
.select("*")
.eq("event_id",e.id)

let photos=0
let videos=0

uploads?.forEach((u:any)=>{
if(u.type==="image") photos++
if(u.type==="video") videos++
})

const storage=(uploads?.length||0)*5

totalPhotos+=photos
totalVideos+=videos
totalStorage+=storage

list.push({
...e,
photos,
videos,
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


async function deleteEvent(id:string){

if(!confirm("Event verwijderen?")) return

await supabase.from("events").delete().eq("id",id)

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

setViewEvent(eventId)

const {data}=await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)
.order("created_at",{ascending:false})

setUploads(data||[])

}


function editEvent(event:any){
setEditing(event)
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

<div style={{
height:"100vh",
display:"flex",
justifyContent:"center",
alignItems:"center",
flexDirection:"column",
background:"#f5efe6"
}}>

<h2>Memories Admin</h2>

<input
type="password"
placeholder="Wachtwoord"
value={password}
onChange={(e)=>setPassword(e.target.value)}
style={{padding:10,borderRadius:8,border:"1px solid #ccc",marginBottom:10}}
/>

<button
onClick={login}
style={{
padding:"10px 20px",
borderRadius:8,
border:"none",
background:"#d4a24c",
color:"#fff"
}}
>
Login
</button>

</div>

)

}


return(

<div style={{background:"#f5efe6",minHeight:"100vh",padding:40}}>

<h1>Memories Admin</h1>


{/* DASHBOARD */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:20,
marginBottom:40
}}>

<div style={card}><h3>Events</h3><b>{stats.events}</b></div>
<div style={card}><h3>Foto's</h3><b>{stats.photos}</b></div>
<div style={card}><h3>Video's</h3><b>{stats.videos}</b></div>
<div style={card}><h3>Storage</h3><b>{stats.storage} MB</b></div>

</div>


{/* CREATE EVENT */}

<div style={card}>

<h3>Nieuw event maken</h3>

<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>

<input placeholder="Event naam (titel)" value={name} onChange={(e)=>setName(e.target.value)} style={input}/>
<input placeholder="Slug" value={slug} onChange={(e)=>setSlug(e.target.value)} style={input}/>

<button onClick={createEvent} style={gold}>Maak event</button>

</div>

</div>


<h2 style={{marginTop:40}}>Events</h2>


<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,320px)",
gap:25
}}>

{events.map((e)=>{

const url=`https://memories.showverhuur.nl/event/${e.slug}`

return(

<div key={e.id} style={card}>

<h3>{e.name}</h3>

<p>/event/{e.slug}</p>

<select
value={e.status}
onChange={(ev)=>toggleEvent(e.id,ev.target.value)}
style={btn}
>
<option value="open">✅ Event open</option>
<option value="closed">❌ Event gesloten</option>
</select>

<p>📸 {e.photos} foto's</p>
<p>🎥 {e.videos} video's</p>
<p>💾 Storage: {e.storage} MB</p>

<QRCode value={url} size={120}/>

<input type="file" onChange={(ev)=>uploadHeader(ev,e.id)} style={{marginTop:10}}/>

<a href={url} target="_blank" style={btn}>Open Event</a>

<button
style={btn}
onClick={()=>{

if(viewEvent===e.id){
setViewEvent(null)
}else{
viewUploads(e.id)
}

}}
>
Uploads bekijken
</button>

<button onClick={downloadQR} style={btn}>Download QR</button>

<button onClick={()=>editEvent(e)} style={btn}>Bewerken</button>

<a href={`/api/zip?event=${e.id}`} style={gold}>Download ZIP</a>

<button onClick={()=>deleteEvent(e.id)} style={del}>Verwijderen</button>

</div>

)

})}

</div>


{/* UPLOADS */}

{viewEvent && (

<div style={{marginTop:50}}>

<h2>Uploads</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,200px)",
gap:20
}}>

{uploads.map((u)=>{

return(

<div key={u.id} style={card}>

{u.type==="image" && (
<img src={u.file_url} style={{width:"100%",borderRadius:6}}/>
)}

<p><b>{u.name}</b></p>
<p style={{fontSize:12}}>{u.message}</p>

<a href={u.file_url} target="_blank">Download</a>

</div>

)

})}

</div>

</div>

)}


{/* EDIT EVENT */}

{editing && (

<div style={{marginTop:40,...card}}>

<h2>Event bewerken</h2>

<input value={editing.name} onChange={(e)=>setEditing({...editing,name:e.target.value})} style={input}/>
<input value={editing.slug} onChange={(e)=>setEditing({...editing,slug:e.target.value})} style={input}/>

<button onClick={saveEvent} style={gold}>Opslaan</button>

</div>

)}

</div>

)

}


const card={background:"#fff",padding:20,borderRadius:12,boxShadow:"0 3px 10px rgba(0,0,0,0.05)"}
const input={padding:10,borderRadius:8,border:"1px solid #ccc"}
const btn={display:"block",marginTop:10,padding:"10px",borderRadius:8,border:"1px solid #ddd",background:"#fff",width:"100%",textAlign:"center"}
const gold={display:"block",marginTop:10,padding:"10px",borderRadius:8,background:"#d4a24c",color:"#fff",border:"none",width:"100%"}
const del={display:"block",marginTop:10,padding:"10px",borderRadius:8,background:"red",color:"#fff",border:"none",width:"100%"}