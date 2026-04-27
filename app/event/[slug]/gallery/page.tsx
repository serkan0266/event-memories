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
const [offset,setOffset] = useState(0)

const touchStart = useRef(0)
const dragging = useRef(false)

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


/* 🔥 SWIPE LOGIC */

function handleTouchStart(e:any){
dragging.current = true
touchStart.current = e.touches[0].clientX
}

function handleTouchMove(e:any){
if(!dragging.current) return

const current = e.touches[0].clientX
const diff = current - touchStart.current

setOffset(diff)
}

function handleTouchEnd(){

dragging.current = false

const threshold = 80

if(offset > threshold){
setViewer(v=>v!==null && v>0 ? v-1 : v)
}
else if(offset < -threshold){
setViewer(v=>v!==null && v<uploads.length-1 ? v+1 : v)
}

setOffset(0)
}

return(

<div style={{padding:15,maxWidth:1400,margin:"auto"}}>

<button onClick={()=>router.push(`/event/${slug}`)}>
← Terug
</button>

<h2 style={{textAlign:"center",marginBottom:20}}>
Galerij (gedeeld door gasten)
</h2>


{/* MASONRY */}
<div style={{
columnCount: window.innerWidth < 600 ? 2 : 3,
columnGap:"12px"
}}>

{uploads.map((u,i)=>(

<div
key={u.id}
onClick={()=>setViewer(i)}
style={{
marginBottom:12,
breakInside:"avoid",
cursor:"pointer",
position:"relative",
borderRadius:12,
overflow:"hidden"
}}
>

<img src={u.file_url} style={{width:"100%"}}/>

<div style={{
position:"absolute",
bottom:0,
left:0,
right:0,
padding:10,
background:"linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
color:"#fff",
fontSize:13
}}>

<b>{u.name}</b>

{u.message && (
<div style={{fontSize:12}}>
{u.message}
</div>
)}

</div>

</div>

))}

</div>


{/* FULLSCREEN */}
{viewer!==null && (

<div
onTouchStart={handleTouchStart}
onTouchMove={handleTouchMove}
onTouchEnd={handleTouchEnd}
style={{
position:"fixed",
top:0,
left:0,
width:"100vw",
height:"100vh",
background:"#000",
display:"flex",
flexDirection:"column",
zIndex:999999
}}
>

{/* TOP */}
<div style={{
position:"absolute",
top:20,
right:20,
display:"flex",
gap:10,
zIndex:10
}}>

{uploads[viewer].uploader_id === uploaderId && (
<button onClick={()=>deletePhoto(uploads[viewer])} style={iconBtn}>
🗑️
</button>
)}

<button onClick={()=>setViewer(null)} style={iconBtn}>
✕
</button>

</div>


{/* SLIDER */}
<div style={{
flex:1,
display:"flex",
alignItems:"center",
justifyContent:"center",
overflow:"hidden"
}}>

<div style={{
display:"flex",
transform:`translateX(${offset}px)`,
transition: dragging.current ? "none" : "transform 0.3s ease"
}}>

<img
src={uploads[viewer].file_url}
style={{
maxWidth:"90vw",
maxHeight:"65vh",
borderRadius:12
}}
/>

</div>

</div>


{/* TEXT */}
<div style={{
color:"#fff",
textAlign:"center",
padding:"20px"
}}>

<b style={{fontSize:18}}>
{uploads[viewer].name}
</b>

{uploads[viewer].message && (
<p style={{marginTop:8}}>
{uploads[viewer].message}
</p>
)}

</div>

</div>

)}

</div>

)

}

const iconBtn = {
background:"rgba(255,255,255,0.9)",
border:"none",
borderRadius:"50%",
width:42,
height:42,
fontSize:18,
cursor:"pointer"
}