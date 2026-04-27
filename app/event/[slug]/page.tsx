"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useRouter } from "next/navigation"
import type { CSSProperties } from "react"

export default function EventPage(){

const params = useParams()
const router = useRouter()

const slug = params.slug as string

const [event,setEvent] = useState<any>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")
const [uploading,setUploading] = useState(false)
const [progress,setProgress] = useState(0)
const [count,setCount] = useState(0)
const [uploadedCount,setUploadedCount] = useState(0)
const [uploadDone,setUploadDone] = useState(false)
const [uploaderId,setUploaderId] = useState("")

useEffect(()=>{

let id = localStorage.getItem("uploaderId")

if(!id){
id = crypto.randomUUID()
localStorage.setItem("uploaderId",id)
}

setUploaderId(id)

loadEvent()

},[])

async function loadEvent(){

const {data} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

setEvent(data)

}

async function handlePhotos(e:any){

const files = e.target.files as FileList

if(!files || !event) return

// 🔥 LIMIET 100
if(files.length > 100){
alert("Maximaal 100 afbeeldingen tegelijk uploaden")
return
}

setUploading(true)
setUploadDone(false)
setCount(files.length)

let done = 0

const { data: userData } = await supabase.auth.getUser()
const userId = userData?.user?.id

if(!userId){
alert("Fout met gebruiker, probeer opnieuw")
setUploading(false)
return
}

const cleanSlug = event.slug.replace(/[^a-z0-9]/gi, "-").toLowerCase()

for(const file of Array.from(files) as File[]){

if(!file.type.startsWith("image")) continue

const cleanName = file.name.replace(/[^a-z0-9.]/gi, "-").toLowerCase()
const path = `${cleanSlug}/${Date.now()}-${cleanName}`

const {error} = await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
alert("Upload fout")
setUploading(false)
return
}

const {data:url} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase.from("uploads").insert({
event_id:event.id,
file_url:url.publicUrl,
type:"image",
name:name,
message:message,
uploader_id:uploaderId,
user_id:userId,
file_size: file.size
})

done++
setUploadedCount(done)
setProgress(Math.round((done/files.length)*100))

}

setUploading(false)
setUploadDone(true)

}

if(!event){
return <div style={{padding:40}}>Loading...</div>
}

const headerUrl = event.header_image || null

if(event.status==="closed"){

return(

<div style={{maxWidth:650,margin:"auto",padding:20,textAlign:"center"}}>

{headerUrl && (
<img src={headerUrl} style={{width:"100%",borderRadius:16,marginBottom:25}}/>
)}

<h1 style={{fontFamily:"cursive",fontSize:46}}>
{event.name}
</h1>

<p style={{fontSize:18,marginTop:20}}>
Inzendingen gesloten
</p>

<button
onClick={()=>router.push(`/event/${slug}/gallery`)}
style={{
marginTop:40,
background:"#d4a24c",
color:"#fff",
padding:"14px 30px",
borderRadius:12,
border:"none",
fontSize:16
}}
>
Galerij bekijken
</button>

</div>

)

}

return(

<div style={{maxWidth:650,margin:"auto",padding:20,textAlign:"center"}}>

{headerUrl && (
<img src={headerUrl} style={{width:"100%",borderRadius:16,marginBottom:25}}/>
)}

<h1 style={{fontFamily:"cursive",fontSize:46}}>
{event.name}
</h1>

<p style={{fontSize:18,marginTop:10,lineHeight:1.6}}>
Alle momenten van deze speciale dag komen hier samen ❤️
</p>

<div style={{marginTop:30}}>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{width:"100%",padding:14,borderRadius:10,border:"1px solid #ddd",marginBottom:10}}
/>

<textarea
placeholder="Laat een bericht achter..."
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{width:"100%",padding:14,borderRadius:10,border:"1px solid #ddd",marginBottom:20}}
/>

<label style={{
width:"100%",
padding:"18px",
border:"2px solid #ddd",
borderRadius:12,
cursor:"pointer",
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:10,
fontSize:18
}}>

<span style={{fontSize:22}}>📷</span>
Afbeeldingen toevoegen

<input
type="file"
multiple
accept="image/*"
onChange={handlePhotos}
style={{display:"none"}}
/>

</label>

<p style={{fontSize:13,color:"#666",marginTop:5}}>
Maximaal 50 afbeeldingen tegelijk
</p>

{/* 🔥 PREMIUM UPLOAD UI */}
{uploading && (

<div style={uploadBox}>

<p style={{fontWeight:600}}>
Foto’s uploaden... ({progress}%)
</p>

<p style={{fontSize:14,color:"#555"}}>
{uploadedCount} van {count} foto's verwerkt
</p>

<p style={{fontSize:13,color:"#999"}}>
Laat deze pagina open tot upload is voltooid
</p>

<div style={progressBar}>
<div style={{...progressFill,width: progress + "%"}}/>
</div>

</div>

)}

{/* ✅ SUCCESS */}
{uploadDone && (

<div style={successBox}>
<p>✅ Upload voltooid</p>
<p>Je foto's zijn succesvol toegevoegd</p>
</div>

)}

</div>

<button
onClick={()=>router.push(`/event/${slug}/gallery`)}
style={{
marginTop:40,
background:"#d4a24c",
color:"#fff",
padding:"14px 30px",
borderRadius:12,
border:"none",
fontSize:16
}}
>
Galerij bekijken
</button>

<div style={{marginTop:50,display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>

<img src="https://sharememories.nl/wp-content/uploads/2026/04/Untitled_design-removebg-preview.png" style={{width:110}}/>

<p style={{fontSize:14}}>
Powered by ShareMemories
</p>

</div>

</div>

)

}

/* ✅ TYPESCRIPT SAFE STYLES */

const uploadBox:CSSProperties = {
background:"#fff",
padding:20,
borderRadius:12,
boxShadow:"0 3px 10px rgba(0,0,0,0.05)",
marginTop:20
}

const progressBar:CSSProperties = {
width:"100%",
height:10,
background:"#eee",
borderRadius:10,
overflow:"hidden",
marginTop:10
}

const progressFill:CSSProperties = {
height:"100%",
background:"#d4a24c",
transition:"0.4s ease"
}

const successBox:CSSProperties = {
marginTop:20,
background:"#fff",
padding:20,
borderRadius:12,
boxShadow:"0 3px 10px rgba(0,0,0,0.05)",
textAlign:"center"
}