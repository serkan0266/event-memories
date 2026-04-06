"use client"

import { useEffect,useState,useRef } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EventPage(){

const params = useParams()
const slug = params?.slug as string

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])
const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [uploading,setUploading] = useState(false)
const [progress,setProgress] = useState(0)
const [uploadDone,setUploadDone] = useState(false)

const [viewer,setViewer] = useState<number | null>(null)

const startX = useRef(0)

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

setUploading(true)
setUploadDone(false)

let count = 0

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
name:name,
file_url:url.publicUrl,
type:file.type.startsWith("video") ? "video":"image"

})

count++
setProgress(Math.round((count/files.length)*100))

}

setUploading(false)
setUploadDone(true)

setTimeout(()=>{
setUploadDone(false)
},3000)

setFiles(null)
setName("")
setProgress(0)

loadEvent()

}


/* swipe */

function handleTouchStart(e:any){
startX.current = e.touches[0].clientX
}

function handleTouchEnd(e:any){

if(viewer===null) return

const diff = e.changedTouches[0].clientX - startX.current

if(diff > 60){
setViewer((viewer-1+uploads.length)%uploads.length)
}

if(diff < -60){
setViewer((viewer+1)%uploads.length)
}

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

{event.header_image && (

<div style={{
width:"100%",
height:200,
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


<div style={{
maxWidth:900,
margin:"auto",
padding:"25px 20px"
}}>

<h1 style={{
fontSize:32,
fontWeight:"800",
color:"#111"
}}>
{event.name}
</h1>

<p style={{
color:"#444"
}}>
Deel jouw foto's en video's van dit moment
</p>

</div>


{/* UPLOAD CARD */}

<div style={{
maxWidth:900,
margin:"auto",
background:"white",
padding:25,
borderRadius:14
}}>

<h3 style={{
fontWeight:700,
marginBottom:12,
color:"#000"
}}>
Upload jouw herinnering
</h3>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:14,
marginBottom:14,
border:"1px solid #ccc",
borderRadius:8,
color:"#111"
}}
/>


{/* BUTTONS */}

<div style={{
display:"flex",
gap:12,
marginBottom:12
}}>

<label style={{
flex:1,
background:"#d4a24c",
color:"white",
padding:"14px",
borderRadius:10,
textAlign:"center",
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

<button
onClick={handleUpload}
disabled={!files || uploading}
style={{
flex:1,
background: files ? "#d4a24c" : "#cfcfcf",
border:"none",
padding:"14px",
color:"white",
borderRadius:10,
cursor: files ? "pointer":"not-allowed",
transform: uploading ? "scale(0.97)" : "scale(1)",
transition:"0.2s"
}}
>

{uploading ? "Upload bezig..." : "Upload"}

</button>

</div>


{/* FILE COUNT */}

{files && (

<p style={{
fontSize:14,
marginBottom:10,
color:"green",
fontWeight:600
}}>
{files.length} bestanden geselecteerd
</p>

)}


{/* PROGRESS */}

{uploading && (

<div>

<div style={{
background:"#eee",
height:10,
borderRadius:6,
overflow:"hidden",
marginBottom:6
}}>

<div style={{
width:`${progress}%`,
background:"#d4a24c",
height:"100%",
transition:"0.3s"
}}/>

</div>

<p style={{
fontSize:14,
color:"red",
fontWeight:"bold"
}}>
Bezig met uploaden... ({progress}%)
klik deze pagina niet weg.
</p>

</div>

)}


{/* UPLOAD DONE MESSAGE */}

{uploadDone && (

<p style={{
marginTop:10,
color:"green",
fontWeight:700
}}>
Upload voltooid ✅
</p>

)}

</div>



{/* GALLERY */}

<div style={{
maxWidth:900,
margin:"40px auto",
padding:"0 20px"
}}>

<h2 style={{
fontWeight:"800",
marginBottom:18,
color:"#000"
}}>
Galerij (gedeeld door gasten)
</h2>


<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:10
}}>


{uploads.map((u,i)=>{

return(

<div key={u.id}>

{u.type==="image" ? (

<img
loading="lazy"
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

):(


<div
onClick={()=>setViewer(i)}
style={{
position:"relative"
}}
>

<video
src={u.file_url+"#t=1"}
preload="metadata"
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
fontSize:30,
color:"white"
}}>
▶
</div>

</div>

)}

{u.name && (

<p style={{
fontSize:13,
marginTop:6,
color:"#333"
}}>
{u.name}
</p>

)}

</div>

)

})}

</div>

</div>



{/* VIEWER */}

{viewer!==null && (

<div
onTouchStart={handleTouchStart}
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
fontSize:26,
color:"white",
background:"none",
border:"none"
}}
>
✕
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