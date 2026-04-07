"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"

export default function AdminPage(){

const ADMIN_PASSWORD="66"

const [loggedIn,setLoggedIn]=useState(false)
const [password,setPassword]=useState("")

const [events,setEvents]=useState<any[]>([])
const [stats,setStats]=useState({
events:0,
photos:0,
videos:0,
storage:0
})

const [name,setName]=useState("")
const [slug,setSlug]=useState("")

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
uploads:uploads?.length||0,
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


async function toggleEvent(id:string,current:string){

const newStatus=current==="open"?"closed":"open"

await supabase
.from("events")
.update({status:newStatus})
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


/* LOGIN */

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
style={{
padding:12,
borderRadius:8,
border:"1px solid #ccc",
marginBottom:10
}}
/>

<button
onClick={login}
style={{
background:"#d4a24c",
color:"#fff",
border:"none",
padding:"10px 20px",
borderRadius:8
}}
>
Login
</button>

</div>

)

}


/* ADMIN */

return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
padding:40,
fontFamily:"sans-serif"
}}>

<h1 style={{marginBottom:30}}>Memories Admin</h1>


{/* DASHBOARD */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:20,
marginBottom:40
}}>

<div style={cardStyle}>
<h3>Events</h3>
<p style={statNumber}>{stats.events}</p>
</div>

<div style={cardStyle}>
<h3>Foto's</h3>
<p style={statNumber}>{stats.photos}</p>
</div>

<div style={cardStyle}>
<h3>Video's</h3>
<p style={statNumber}>{stats.videos}</p>
</div>

<div style={cardStyle}>
<h3>Storage</h3>
<p style={statNumber}>{stats.storage} MB</p>
</div>

</div>


{/* CREATE EVENT */}

<div style={{
...cardStyle,
marginBottom:40
}}>

<h3>Nieuw event maken</h3>

<div style={{display:"flex",gap:10,marginTop:10,flexWrap:"wrap"}}>

<input
placeholder="Event naam (titel)"
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

<button onClick={createEvent} style={goldButton}>
Maak event
</button>

</div>

</div>


{/* EVENTS */}

<h2 style={{marginBottom:20}}>Events</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,320px)",
gap:25
}}>

{events.map((e)=>{

const url=`https://memories.showverhuur.nl/event/${e.slug}`

return(

<div key={e.id} style={cardStyle}>

<h3>{e.name}</h3>

<p style={{opacity:.6}}>/event/{e.slug}</p>

<p>Status: <b style={{color:e.status==="open"?"green":"red"}}>{e.status}</b></p>

<p>📸 {e.photos} foto's</p>
<p>🎥 {e.videos} video's</p>
<p>💾 Storage: {e.storage} MB</p>

<div style={{margin:"10px 0"}}>
<QRCode value={url} size={120}/>
</div>

<input type="file" onChange={(ev)=>uploadHeader(ev,e.id)} />

<a href={url} target="_blank" style={buttonStyle}>
Open Event
</a>

<button style={buttonStyle}>
Uploads bekijken
</button>

<a href={`/api/zip?event=${e.id}`} style={goldButton}>
Download ZIP
</a>

<button onClick={downloadQR} style={buttonStyle}>
Download QR
</button>

<button
onClick={()=>toggleEvent(e.id,e.status)}
style={buttonStyle}
>
{e.status==="open"?"Event sluiten":"Event openen"}
</button>

<button
onClick={()=>deleteEvent(e.id)}
style={deleteButton}
>
Verwijderen
</button>

</div>

)

})}

</div>

</div>

)

}


/* STYLES */

const cardStyle={
background:"#fff",
padding:20,
borderRadius:14,
boxShadow:"0 3px 10px rgba(0,0,0,0.05)"
}

const statNumber={
fontSize:28,
fontWeight:"bold"
}

const inputStyle={
padding:10,
borderRadius:8,
border:"1px solid #ccc"
}

const buttonStyle={
display:"block",
marginTop:10,
padding:"10px",
borderRadius:8,
border:"1px solid #ddd",
background:"#fff",
cursor:"pointer"
}

const goldButton={
display:"block",
marginTop:10,
padding:"10px",
borderRadius:8,
background:"#d4a24c",
color:"#fff",
border:"none",
cursor:"pointer"
}

const deleteButton={
display:"block",
marginTop:10,
padding:"10px",
borderRadius:8,
background:"red",
color:"#fff",
border:"none",
cursor:"pointer"
}