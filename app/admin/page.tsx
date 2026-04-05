"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import JSZip from "jszip"
import { saveAs } from "file-saver"

export default function AdminPage(){

const [access,setAccess] = useState(false)
const [code,setCode] = useState("")

const [events,setEvents] = useState<any[]>([])
const [uploads,setUploads] = useState<any[]>([])

const [name,setName] = useState("")
const [slug,setSlug] = useState("")

useEffect(()=>{

const saved = localStorage.getItem("admin")

if(saved==="true"){
setAccess(true)
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
localStorage.setItem("admin","true")
setAccess(true)
loadData()
}else{
alert("verkeerde code")
}

}

async function createEvent(){

if(!name || !slug) return alert("vul alles in")

await supabase.from("events").insert({
name,
slug
})

setName("")
setSlug("")

loadData()

}

async function deleteEvent(id:string){

if(!confirm("event verwijderen?")) return

await supabase.from("events").delete().eq("id",id)

loadData()

}

async function uploadHeader(e:any,eventId:string){

const file = e.target.files[0]

if(!file) return

alert("uploaden...")

const fileName = `${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(`headers/${fileName}`,file)

if(error){
alert("upload fout")
return
}

const {data} = supabase.storage
.from("uploads")
.getPublicUrl(`headers/${fileName}`)

await supabase.from("events")
.update({header_image:data.publicUrl})
.eq("id",eventId)

alert("header geupload")

loadData()

}

async function downloadZip(eventId:string){

const zip = new JSZip()

const files = uploads.filter(u=>u.event_id===eventId)

for(const file of files){

const res = await fetch(file.file_url)
const blob = await res.blob()

zip.file(file.file_url.split("/").pop(),blob)

}

const content = await zip.generateAsync({type:"blob"})

saveAs(content,"event-media.zip")

}

if(!access){

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

<h2>Admin login</h2>

<input
type="password"
placeholder="code"
value={code}
onChange={e=>setCode(e.target.value)}
style={{padding:10}}
/>

<br/><br/>

<button
onClick={login}
style={{
background:"#d4a24c",
color:"white",
border:"none",
padding:"10px 20px",
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

<h1>Memories Admin</h1>

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
color:"white",
border:"none",
padding:"10px 20px",
borderRadius:6
}}
>
Maak event
</button>

</div>

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

<div key={event.id}
style={{
background:"white",
padding:20,
borderRadius:12
}}
>

<h3>{event.name}</h3>

<p>/event/{event.slug}</p>

<p>📷 {photos} foto's</p>
<p>🎥 {videos} video's</p>

<a href={`/event/${event.slug}`} target="_blank">
Open event
</a>

<br/><br/>

<img
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://memories.showverhuur.nl/event/${event.slug}`}
/>

<br/><br/>

<input type="file" onChange={(e)=>uploadHeader(e,event.id)} />

<br/><br/>

<button
onClick={()=>downloadZip(event.id)}
style={{
background:"#d4a24c",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:6
}}
>
Download ZIP
</button>

<br/><br/>

<button
onClick={()=>deleteEvent(event.id)}
style={{
background:"red",
color:"white",
border:"none",
padding:"8px 14px",
borderRadius:6
}}
>
Verwijder
</button>

</div>

)

})}

</div>

</div>

)

}