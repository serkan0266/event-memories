"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"

export default function EventPage({params}:any){

const slug = params.slug

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])

const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")

const [viewer,setViewer] = useState<number | null>(null)

useEffect(()=>{
load()
},[])

async function load(){

const {data:eventData} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

setEvent(eventData)

const {data:uploadData} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventData.id)
.order("created_at",{ascending:false})

setUploads(uploadData || [])

}

async function upload(){

if(!files) return

for(const file of Array.from(files)){

const fileName = `${Date.now()}-${file.name}`

await supabase.storage
.from("uploads")
.upload(`media/${fileName}`,file)

const {data} = supabase.storage
.from("uploads")
.getPublicUrl(`media/${fileName}`)

await supabase.from("uploads").insert({

event_id:event.id,
file_url:data.publicUrl,
name,
message,
type:file.type.startsWith("video") ? "video" : "image"

})

}

setFiles(null)
setName("")
setMessage("")

load()

}

if(!event) return <div style={{padding:40}}>Loading...</div>

return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
fontFamily:"sans-serif"
}}>

{/* HEADER */}

{event.header_image && (

<div style={{
width:"100%",
height:260,
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
maxWidth:1000,
margin:"0 auto",
padding:20
}}>

<h1 style={{
fontSize:34,
marginBottom:6
}}>
{event.name}
</h1>

<p style={{color:"#777"}}>
{uploads.filter(u=>u.type==="image").length} foto's • {uploads.filter(u=>u.type==="video").length} video's
</p>

{/* UPLOAD CARD */}

<div style={{
background:"white",
padding:25,
borderRadius:14,
boxShadow:"0 10px 30px rgba(0,0,0,0.08)",
marginTop:20,
marginBottom:30
}}>

<h3 style={{marginBottom:15}}>
Deel jouw herinnering
</h3>

<input
placeholder="Naam"
value={name}
onChange={e=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
border:"1px solid #ddd",
borderRadius:8,
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
border:"1px solid #ddd",
borderRadius:8,
marginBottom:12
}}
/>

<input
type="file"
multiple
onChange={(e)=>setFiles(e.target.files)}
/>

<br/><br/>

<button
onClick={upload}
style={{
background:"#d4a24c",
color:"white",
border:"none",
padding:"12px 26px",
borderRadius:8,
fontWeight:600,
cursor:"pointer"
}}
>
Upload herinnering
</button>

</div>

{/* GALLERY */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:6
}}>

{uploads.map((u,index)=>(

<div
key={u.id}
onClick={()=>setViewer(index)}
style={{
aspectRatio:"1",
cursor:"pointer",
overflow:"hidden",
borderRadius:8
}}
>

{u.type==="image" ? (

<img
src={u.file_url}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

):( 

<div style={{position:"relative",height:"100%"}}>

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
color:"white",
pointerEvents:"none"
}}>
▶
</div>

</div>

)}

</div>

))}

</div>

</div>

{/* FULLSCREEN VIEWER */}

{viewer!==null && (

<div
style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.95)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999
}}
>

<button
onClick={()=>setViewer(null)}
style={{
position:"absolute",
top:30,
right:30,
fontSize:32,
color:"white",
background:"none",
border:"none",
cursor:"pointer"
}}
>
✕
</button>

{uploads[viewer].type==="image" ? (

<img
src={uploads[viewer].file_url}
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

):( 

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