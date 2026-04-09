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

if(viewer!==null){
document.body.style.overflow="hidden"
}else{
document.body.style.overflow="auto"
}

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


async function deletePhoto(id:string){

if(!confirm("Foto verwijderen?")) return

await supabase
.from("uploads")
.delete()
.eq("id",id)

setUploads(uploads.filter(u=>u.id!==id))
setViewer(null)

}


return(

<div style={{
padding:20,
maxWidth:900,
margin:"auto"
}}>

<button
onClick={()=>router.push(`/event/${slug}`)}
style={{marginBottom:10}}
>
← Terug
</button>

<h2 style={{
textAlign:"center",
fontWeight:"bold",
marginBottom:20
}}>
Galerij (gedeeld door gasten)
</h2>


<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>

{uploads.map((u,i)=>{

return(

<div
key={u.id}
onClick={()=>setViewer(i)}
style={{
position:"relative",
cursor:"pointer"
}}
>

<img
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1/1",
objectFit:"cover",
borderRadius:8
}}
/>

<div style={{
position:"absolute",
bottom:0,
left:0,
right:0,
padding:6,
background:"linear-gradient(transparent,rgba(0,0,0,0.7))",
color:"#fff",
fontSize:12
}}>

<b>{u.name}</b>

{u.message && (
<div style={{fontSize:11}}>
{u.message}
</div>
)}

</div>

</div>

)

})}

</div>


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
background:"rgba(0,0,0,0.95)",
display:"flex",
flexDirection:"column",
alignItems:"center",
justifyContent:"flex-start",
paddingTop:80,
overflowY:"auto",
overscrollBehavior:"contain",
WebkitOverflowScrolling:"touch",
zIndex:1000
}}
>


{/* ICONS */}

<div style={{
position:"absolute",
top:20,
right:20,
display:"flex",
gap:12,
alignItems:"center"
}}>

{uploads[viewer].uploader_id === uploaderId && (

<button
onClick={()=>deletePhoto(uploads[viewer].id)}
style={{
background:"rgba(255,255,255,0.9)",
border:"none",
borderRadius:"50%",
width:40,
height:40,
fontSize:18,
cursor:"pointer"
}}
>
🗑️
</button>

)}

<button
onClick={()=>setViewer(null)}
style={{
background:"rgba(255,255,255,0.9)",
border:"none",
borderRadius:"50%",
width:40,
height:40,
fontSize:18,
cursor:"pointer"
}}
>
✕
</button>

</div>


<img
src={uploads[viewer].file_url}
style={{
maxWidth:"90%",
maxHeight:"60vh",
borderRadius:10
}}
/>


<div style={{
color:"#fff",
marginTop:15,
textAlign:"center",
maxWidth:500,
paddingBottom:40
}}>

<b>{uploads[viewer].name}</b>

{uploads[viewer].message && (
<p>{uploads[viewer].message}</p>
)}

</div>

</div>

)}

</div>

)

}