"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function DownloadPage(){

const params = useParams()
const slug = params.slug as string

const [event,setEvent] = useState<any>(null)
const [count,setCount] = useState(0)

useEffect(()=>{
load()
},[])

async function load(){

const {data:eventData} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

if(!eventData) return

setEvent(eventData)

const {data:uploads} = await supabase
.from("uploads")
.select("id,type")
.eq("event_id",eventData.id)

const images = uploads?.filter(u=>u.type==="image") || []

setCount(images.length)

}

if(!event){
return <div style={{padding:40}}>Loading...</div>
}

const totalZips = Math.ceil(count / 100)

return(

<div style={{
minHeight:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#f8f6f2",
padding:20
}}>

<div style={{
maxWidth:500,
width:"100%",
textAlign:"center",
background:"#fff",
padding:"40px 30px",
borderRadius:20,
boxShadow:"0 20px 60px rgba(0,0,0,0.08)"
}}>

{/* 🔥 LOGO */}
<img
src="https://sharememories.nl/wp-content/uploads/2026/04/Untitled_design-removebg-preview.png"
style={{
width:200,
margin:"0 auto 25px auto",
display:"block",
objectFit:"contain",
filter:"drop-shadow(0 8px 20px rgba(0,0,0,0.15))"
}}
/>

{/* 🔥 TITLE */}
<h1 style={{
fontSize:28,
marginBottom:10
}}>
Download alle herinneringen 📸
</h1>

<p style={{
opacity:0.6,
fontSize:15,
marginBottom:25
}}>
Klik op de bestanden hieronder om alles te downloaden
</p>

{/* 🔥 BUTTONS */}
<div>

{Array.from({length: totalZips}, (_, i)=>{

const batch = i + 1

return(
<a
key={batch}
href={`/api/zip?event=${event.id}&batch=${batch}`}
style={{
display:"block",
marginTop:12,
padding:"16px",
borderRadius:12,
background:"#d4a24c",
color:"#fff",
textDecoration:"none",
fontWeight:600,
fontSize:16,
boxShadow:"0 6px 20px rgba(212,162,76,0.3)"
}}
>
Download ZIP {batch} ({(batch-1)*100} - {batch*100})
</a>
)

})}

</div>

</div>

</div>

)

}