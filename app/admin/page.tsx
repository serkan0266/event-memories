"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage(){

const [allowed,setAllowed] = useState(false)
const [code,setCode] = useState("")

const [events,setEvents] = useState<any[]>([])
const [uploads,setUploads] = useState<any[]>([])

const [name,setName] = useState("")
const [slug,setSlug] = useState("")

useEffect(()=>{

const saved = localStorage.getItem("admin_access")

if(saved==="true"){
setAllowed(true)
loadData()
}

},[])

async function loadData(){

const {data:eventsData} = await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false})

const {data:uploadsData} = await supabase
.from("uploads")
.select("*")

setEvents(eventsData || [])
setUploads(uploadsData || [])

}

function login(){

if(code==="66"){
localStorage.setItem("admin_access","true")
setAllowed(true)
loadData()
}else{
alert("Verkeerde code")
}

}

async function createEvent(){

await supabase.from("events").insert({

name:name,
slug:slug

})

setName("")
setSlug("")

loadData()

}

async function deleteEvent(id:string){

if(!confirm("Event verwijderen?")) return

await supabase.from("events").delete().eq("id",id)

loadData()

}

async function uploadHeader(e:any,eventId:string){

const file = e.target.files[0]

if(!file) return

const path = `headers/${Date.now()}-${file.name}`

await supabase.storage
.from("uploads")
.upload(path,file)

const {data} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase
.from("events")
.update({header_image:data.publicUrl})
.eq("id",eventId)

loadData()

}

function downloadZip(eventId:string){

const files = uploads
.filter(u=>u.event_id===eventId)
.map(u=>u.file_url)

files.forEach(url=>{

const a=document.createElement("a")
a.href=url
a.download=""
a.click()

})

}

if(!allowed){

return(

<div style={{
height:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#f5efe6"
}}>

<div style={{
background:"white",
padding:40,
borderRadius:12,
boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
}}>

<h2>Admin toegang</h2>

<input
type="password"
placeholder="Code"
value={code}
onChange={e=>setCode(e.target.value)}
style={{padding:10}}
/>

<br/><br/>

<button
onClick={login}
style={{
background:"#d4a24c",
border:"none",
padding:"10px 20px",
color:"white",
borderRadius:6
}}
>
Login
</button>

</div>

</div>

)

}

return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
padding:40
}}>

<h1 style={{marginBottom:30}}>Memories Admin</h1>


{/* CREATE EVENT */}

<div style={{
background:"white",
padding:20,
borderRadius:12,
marginBottom:30
}}>

<h3>Nieuw event</h3>

<input
placeholder="Event naam"
value={name}
onChange={e=>setName(e.target.value)}
style={{padding:10,marginRight:10}}
/>

<input
placeholder="Slug"
value={slug}
onChange={e=>setSlug(e.target.value)}
style={{padding:10,marginRight:10}}
/>

<button
onClick={createEvent}
style={{
background:"#d4a24c",
border:"none",
padding:"10px 20px",
color:"white",
borderRadius:6
}}
>
Maak event
</button>

</div>


{/* EVENTS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",
gap:20
}}>

{events.map(event=>{

const eventUploads = uploads.filter(u=>u.event_id===event.id)

const photos = eventUploads.filter(u=>u.type==="image").length
const videos = eventUploads.filter(u=>u.type==="video").length

return(

<div
key={event.id}
style={{
background:"white",
padding:20,
borderRadius:12,
boxShadow:"0 10px 20px rgba(0,0,0,0.05)"
}}
>

<h3>{event.name}</h3>

<p>/event/{event.slug}</p>

<p>
📷 {photos} foto's  
🎥 {videos} video's
</p>

<a
href={`/event/${event.slug}`}
target="_blank"
>
Open event
</a>

<br/><br/>

{/* QR */}

<img
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://memories.showverhuur.nl/event/${event.slug}`}
/>

<br/><br/>

{/* HEADER UPLOAD */}

<input
type="file"
onChange={(e)=>uploadHeader(e,event.id)}
/>

<br/><br/>

<button
onClick={()=>downloadZip(event.id)}
style={{
background:"#d4a24c",
border:"none",
padding:"8px 14px",
color:"white",
borderRadius:6
}}
>
Download alle media
</button>

<br/><br/>

<button
onClick={()=>deleteEvent(event.id)}
style={{
background:"red",
border:"none",
padding:"8px 14px",
color:"white",
borderRadius:6
}}
>
Verwijder event
</button>

</div>

)

})}

</div>

</div>

)

}