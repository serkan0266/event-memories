"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function EventPage({ params }: { params: { slug: string } }) {

const slug = params.slug

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])

const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")

const [viewer,setViewer] = useState<number | null>(null)

useEffect(()=>{

if(!slug) return

loadEvent()

},[slug])


async function loadEvent(){

const {data,error} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

if(error){
console.error(error)
return
}

setEvent(data)

loadUploads(data.id)

}


async function loadUploads(eventId:string){

const {data,error} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)
.order("created_at",{ascending:false})

if(error){
console.error(error)
return
}

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

loadUploads(event.id)

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

<div style={{
maxWidth:900,
margin:"auto",
padding:"40px 20px"
}}>

<h1 style={{
fontSize:34,
color:"#1a1a1a"
}}>
{event.name}
</h1>

<p style={{color:"#666"}}>
Deel jouw foto's en video's van dit moment
</p>

</div>


{/* UPLOAD */}

<div style={{
maxWidth:900,
margin:"auto",
background:"white",
padding:30,
borderRadius:14
}}>

<h3 style={{marginBottom:20}}>Upload jouw herinnering</h3>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
border:"1px solid #ddd",
borderRadius:8,
marginBottom:10
}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{
width:"100%",
padding:12,
border:"1px solid #ddd",
borderRadius:8,
marginBottom:10
}}
/>

<label style={{
background:"#d4a24c",
color:"white",
padding:"10px 18px",
borderRadius:8,
cursor:"pointer"
}}>

Kies bestanden

<input
type="file"
multiple
accept="image/*,video/*"
onChange={(e)=>setFiles(e.target.files)}
style={{display:"none"}}
/>

</label>

<br/>

<button
onClick={handleUpload}
style={{
marginTop:10,
background:"#d4a24c",
border:"none",
padding:"12px 22px",
color:"white",
borderRadius:8
}}
>
Upload
</button>

</div>


{/* GALLERY */}

<div style={{
maxWidth:900,
margin:"40px auto",
padding:"0 20px"
}}>

<h2 style={{marginBottom:15}}>
Galerij (gedeeld door gasten)
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>

{uploads.map((u,i)=>(

<div
key={u.id}
style={{
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
fontSize:30,
color:"white"
}}>
▶
</div>

</div>

)}

</div>

))}

</div>

</div>

</div>

)

}