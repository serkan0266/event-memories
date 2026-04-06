"use client"

import { useEffect,useState,useRef } from "react"
import { supabase } from "@/lib/supabase"

export default function EventPage({params}:any){

const slug = params.slug

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])

const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")

const [viewer,setViewer] = useState<number | null>(null)

const [touchStart,setTouchStart] = useState<number | null>(null)
const [touchEnd,setTouchEnd] = useState<number | null>(null)

useEffect(()=>{

loadEvent()
loadUploads()

},[])

async function loadEvent(){

const {data} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

setEvent(data)

}

async function loadUploads(){

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",event?.id)
.order("created_at",{ascending:false})

setUploads(data || [])

}

async function handleUpload(){

if(!files || !event) return

for(const file of Array.from(files)){

const fileName = `${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(fileName,file)

if(error){
alert("Upload fout")
return
}

const {data:url} = supabase.storage
.from("uploads")
.getPublicUrl(fileName)

await supabase.from("uploads").insert({

event_id:event.id,
name,
message,
file_url:url.publicUrl,
type:file.type.startsWith("video") ? "video" : "image"

})

}

setFiles(null)
setName("")
setMessage("")

loadUploads()

}

function next(){

if(viewer===null) return
if(viewer < uploads.length-1) setViewer(viewer+1)

}

function prev(){

if(viewer===null) return
if(viewer>0) setViewer(viewer-1)

}

function handleTouchStart(e:any){
setTouchStart(e.targetTouches[0].clientX)
}

function handleTouchMove(e:any){
setTouchEnd(e.targetTouches[0].clientX)
}

function handleTouchEnd(){

if(!touchStart || !touchEnd) return

const distance = touchStart - touchEnd

if(distance > 50) next()
if(distance < -50) prev()

setTouchStart(null)
setTouchEnd(null)

}

if(!event){
return <div style={{padding:40}}>Loading...</div>
}

return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
paddingBottom:120
}}>

{/* HEADER */}

<div style={{
maxWidth:900,
margin:"auto",
padding:"40px 20px"
}}>

<h1 style={{
fontSize:34,
color:"#1a1a1a",
fontWeight:700
}}>
{event.name}
</h1>

<p style={{
color:"#666",
marginTop:6
}}>
Deel jouw foto's en video's van dit moment
</p>

</div>

{/* UPLOAD BOX */}

<div style={{
maxWidth:900,
margin:"auto",
background:"white",
padding:30,
borderRadius:14,
boxShadow:"0 10px 30px rgba(0,0,0,0.06)"
}}>

<h3 style={{
marginBottom:20,
color:"#1a1a1a"
}}>
Upload jouw herinnering
</h3>

<input
placeholder="Naam"
value={name}
onChange={e=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
borderRadius:8,
border:"1px solid #ddd",
marginBottom:12
}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={e=>setMessage(e.target.value)}
style={{
width:"100%",
padding:12,
borderRadius:8,
border:"1px solid #ddd",
marginBottom:12
}}
/>

<label style={{
display:"inline-block",
background:"#d4a24c",
color:"white",
padding:"10px 18px",
borderRadius:8,
cursor:"pointer"
}}>

Kies foto's of video's

<input
type="file"
multiple
accept="image/*,video/*"
onChange={e=>setFiles(e.target.files)}
style={{display:"none"}}
/>

</label>

<br/>

<button
onClick={handleUpload}
style={{
marginTop:12,
background:"#d4a24c",
border:"none",
padding:"12px 22px",
color:"white",
borderRadius:8,
fontWeight:600,
cursor:"pointer"
}}
>
Upload
</button>

</div>

{/* GALLERY TITLE */}

<div style={{
maxWidth:900,
margin:"40px auto 10px auto",
padding:"0 20px"
}}>

<h2 style={{
fontSize:22,
color:"#1a1a1a"
}}>
Galerij (gedeeld door gasten)
</h2>

</div>

{/* GALLERY */}

<div style={{
maxWidth:900,
margin:"auto",
padding:"0 20px",
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>

{uploads.map((u,i)=>(

<div
key={u.id}
style={{
position:"relative",
aspectRatio:"1/1",
overflow:"hidden",
borderRadius:10,
cursor:"pointer"
}}
onClick={()=>setViewer(i)}
>

{u.type==="image" && (

<img
src={u.file_url}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

)}

{u.type==="video" && (

<div style={{position:"relative"}}>

<video
src={u.file_url}
muted
preload="metadata"
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

<div style={{
position:"absolute",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
fontSize:36,
color:"white"
}}>
▶
</div>

</div>

)}

</div>

))}

</div>

{/* VIEWER */}

{viewer!==null && (

<div
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"black",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:1000
}}
>

<button
onClick={()=>setViewer(null)}
style={{
position:"absolute",
top:20,
right:20,
fontSize:28,
color:"white",
background:"none",
border:"none",
cursor:"pointer"
}}
>
✕
</button>

<button
onClick={prev}
style={{
position:"absolute",
left:20,
fontSize:40,
color:"white",
background:"none",
border:"none"
}}
>
‹
</button>

<button
onClick={next}
style={{
position:"absolute",
right:20,
fontSize:40,
color:"white",
background:"none",
border:"none"
}}
>
›
</button>

{uploads[viewer].type==="image" && (

<img
src={uploads[viewer].file_url}
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

)}

{uploads[viewer].type==="video" && (

<video
src={uploads[viewer].file_url}
controls
autoPlay
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

)}

</div>

)}

</div>

)
}