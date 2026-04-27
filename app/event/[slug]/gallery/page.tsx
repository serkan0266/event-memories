"use client"

import { useEffect,useState,useRef } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useRouter } from "next/navigation"

export default function Gallery(){

const params = useParams()
const router = useRouter()
const slug = params.slug as string

const [uploads,setUploads] = useState<any[]>([])
const [viewer,setViewer] = useState<number | null>(null)
const [uploaderId,setUploaderId] = useState("")

const touchStart = useRef(0)

useEffect(()=>{

let id = localStorage.getItem("uploaderId")

if(!id){
id = crypto.randomUUID()
localStorage.setItem("uploaderId",id)
}

setUploaderId(id)

load()

},[])

useEffect(()=>{
document.body.style.overflow = viewer!==null ? "hidden" : "auto"
},[viewer])

async function load(){

const {data:eventData} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventData.id)
.order("created_at",{ascending:false})

setUploads(data || [])

}


// DELETE
async function deletePhoto(upload:any){

if(!confirm("Foto verwijderen?")) return

const path = upload.file_url.split("/uploads/")[1]

if(path){
await supabase.storage.from("uploads").remove([path])
}

await supabase.from("uploads").delete().eq("id",upload.id)

setUploads(uploads.filter(u=>u.id!==upload.id))
setViewer(null)

}


return(

<div style={{
padding:20,
maxWidth:1100,
margin:"auto"
}}>

<button onClick={()=>router.push(`/event/${slug}`)}>
← Terug
</button>

<h2 style={{
textAlign:"center",
marginBottom:25
}}>
Galerij (gedeeld door gasten)
</h2>


{/* 🔥 PREMIUM GRID */}
<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",
gap:15
}}>

{uploads.map((u,i)=>(

<div
key={u.id}
onClick={()=>setViewer(i)}
style={{
position:"relative",
cursor:"pointer",
borderRadius:12,
overflow:"hidden"
}}
>

<img
src={u.file_url}
style={{
width:"100%",
height:240,
objectFit:"cover",
transition:"0.3s"
}}
/>

{/* overlay */}
<div style={{
position:"absolute",
bottom:0,
left:0,
right:0,
padding:10,
background:"linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
color:"#fff",
fontSize:13
}}>

<b>{u.name}</b>

{u.message && (
<div style={{fontSize:12,opacity:0.9}}>
{u.message}
</div>
)}

</div>

</div>

))}

</div>


{/* 🔥 FULLSCREEN VIEWER */}
{viewer!==null && (

<div
onTouchStart={(e)=>touchStart.current=e.touches[0].clientX}
onTouchEnd={(e)=>{

const diff=e.changedTouches[0].clientX-touchStart.current

if(diff>50){
setViewer(v=>v!==null && v>0 ? v-1 : v)
}

if(diff<-50){
setViewer(v=>v!==null && v<uploads.length-1 ? v+1 : v)
}

}}
style={{
position:"fixed",
top:0,
left:0,
width:"100vw",
height:"100vh",
background:"rgba(0,0,0,0.96)",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"center",
zIndex:1000
}}
>

{/* TOP BAR */}
<div style={{
position:"absolute",
top:20,
right:20,
display:"flex",
gap:10
}}>

{uploads[viewer].uploader_id === uploaderId && (
<button
onClick={()=>deletePhoto(uploads[viewer])}
style={iconBtn}
>
🗑️
</button>
)}

<button
onClick={()=>setViewer(null)}
style={iconBtn}
>
✕
</button>

</div>


{/* IMAGE */}
<img
src={uploads[viewer].file_url}
style={{
maxWidth:"90%",
maxHeight:"70vh",
borderRadius:12
}}
/>


{/* TEXT */}
<div style={{
color:"#fff",
marginTop:20,
textAlign:"center",
maxWidth:500,
padding:"0 20px"
}}>

<b style={{fontSize:16}}>
{uploads[viewer].name}
</b>

{uploads[viewer].message && (
<p style={{opacity:0.85,marginTop:5}}>
{uploads[viewer].message}
</p>
)}

</div>

</div>

)}

</div>

)

}

/* 🔥 STYLES */

const iconBtn = {
background:"rgba(255,255,255,0.9)",
border:"none",
borderRadius:"50%",
width:40,
height:40,
fontSize:18,
cursor:"pointer"
}