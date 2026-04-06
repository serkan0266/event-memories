"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EventPage(){

const params = useParams()
const slug = params?.slug as string

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])

const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")

const [viewer,setViewer] = useState<number | null>(null)

const [touchStart,setTouchStart] = useState<number | null>(null)
const [touchEnd,setTouchEnd] = useState<number | null>(null)

useEffect(()=>{

if(!slug) return
loadEvent()

},[slug])


async function loadEvent(){

const {data} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

if(!data) return

setEvent(data)

const {data:uploadData} = await supabase
.from("uploads")
.select("*")
.eq("event_id",data.id)
.order("created_at",{ascending:false})

setUploads(uploadData || [])

}


async function handleUpload(){

if(!files || !event) return

for(const file of Array.from(files)){

const path = `${event.id}/${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
alert("Upload fout")
continue
}

const {data:url} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase.from("uploads").insert({

event_id:event.id,
name,
message,
file_url:url.publicUrl,
type:file.type.startsWith("video") ? "video":"image"

})

}

loadEvent()

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


{/* HEADER IMAGE */}

{event.header_image && (

<div style={{
width:"100%",
height:220,
overflow:"hidden"
}}>

<img
src={event.header_image}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>

)}


{/* TITLE */}

<div style={{
maxWidth:900,
margin:"auto",
padding:"25px 20px"
}}>

<h1 style={{
fontSize:30,
fontWeight:"700",
color:"#1a1a1a"
}}>
{event.name}
</h1>

<p style={{
color:"#555",
marginTop:6
}}>
Deel jouw foto's en video's van dit moment
</p>

</div>


{/* UPLOAD */}

<div style={{
maxWidth:900,
margin:"auto",
background:"white",
padding:25,
borderRadius:14,
boxShadow:"0 6px 20px rgba(0,0,0,0.05)"
}}>

<h3 style={{
fontWeight:600,
color:"#1a1a1a",
marginBottom:15
}}>
Upload jouw herinnering
</h3>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:10,
border:"1px solid #ccc",
borderRadius:8,
color:"#000"
}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:12,
border:"1px solid #ccc",
borderRadius:8,
color:"#000"
}}
/>

<label style={{
background:"#d4a24c",
color:"white",
padding:"10px 16px",
borderRadius:8,
cursor:"pointer",
display:"inline-block",
marginBottom:10
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
background:"#d4a24c",
border:"none",
padding:"12px 22px",
color:"white",
borderRadius:8,
fontWeight:600
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

<h2 style={{
fontWeight:"700",
marginBottom:15,
color:"#1a1a1a"
}}>
Galerij (gedeeld door gasten)
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>

{uploads.map((u,i)=>{

if(u.type==="image"){

return(

<img
key={u.id}
src={u.file_url}
onClick={()=>setViewer(i)}
style={{
width:"100%",
aspectRatio:"1",
objectFit:"cover",
borderRadius:10,
cursor:"pointer"
}}
/>

)

}

return(

<div
key={u.id}
onClick={()=>setViewer(i)}
style={{
position:"relative",
cursor:"pointer"
}}
>

<video
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1",
objectFit:"cover",
borderRadius:10
}}
/>

<div style={{
position:"absolute",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
fontSize:32,
color:"white"
}}>
▶
</div>

</div>

)

})}

</div>

</div>


{/* FULLSCREEN VIEWER */}

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
color:"white",
fontSize:30,
background:"none",
border:"none"
}}
>
✕
</button>

<button
onClick={prev}
style={{
position:"absolute",
left:20,
color:"white",
fontSize:40,
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
color:"white",
fontSize:40,
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
