"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function DownloadPage(){

const params = useParams()
const slug = params.slug as string

const [event,setEvent] = useState<any>(null)
const [count,setCount] = useState(0)

const [input,setInput] = useState("")
const [unlocked,setUnlocked] = useState(false)

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


// 🔒 ALS wachtwoord bestaat → eerst invoer tonen
if(event.download_password && !unlocked){

return(

<div style={{
minHeight:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#f8f6f2"
}}>

<div style={{
background:"#fff",
padding:40,
borderRadius:20,
textAlign:"center",
boxShadow:"0 20px 60px rgba(0,0,0,0.1)"
}}>

<h2>Beveiligde download 🔒</h2>

<p style={{opacity:0.7,marginTop:10}}>
Voer het wachtwoord in om toegang te krijgen
</p>

<input
type="password"
placeholder="Wachtwoord"
value={input}
onChange={(e)=>setInput(e.target.value)}
style={{
marginTop:20,
padding:12,
borderRadius:10,
border:"1px solid #ddd",
width:"100%"
}}
/>

<button
onClick={()=>{
if(input === event.download_password){
setUnlocked(true)
}else{
alert("Verkeerd wachtwoord")
}
}}
style={{
marginTop:15,
padding:"12px 20px",
background:"#d4a24c",
color:"#fff",
border:"none",
borderRadius:10,
width:"100%"
}}
>
Ontgrendelen
</button>

</div>

</div>

)

}


// 🔥 NORMALE DOWNLOAD PAGINA
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

<img
src="https://sharememories.nl/wp-content/uploads/2026/04/Untitled_design-removebg-preview.png"
style={{
width:200,
margin:"0 auto 25px auto",
display:"block"
}}
/>

<h1 style={{fontSize:28}}>
Download alle herinneringen 📸
</h1>

<div style={{marginTop:20}}>

{Array.from({length: totalZips}, (_, i)=>{

const batch = i + 1

return(
<a
key={batch}
href={`/api/zip?event=${event.id}&batch=${batch}`}
style={{
display:"block",
marginTop:10,
padding:"16px",
borderRadius:12,
background:"#d4a24c",
color:"#fff",
textDecoration:"none"
}}
>
Download ZIP {batch}
</a>
)

})}

</div>

</div>

</div>

)

}