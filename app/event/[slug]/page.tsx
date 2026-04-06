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

const [uploading,setUploading] = useState(false)

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

loadUploads(data.id)

}


async function loadUploads(eventId:string){

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)
.order("created_at",{ascending:false})

setUploads(data || [])

}


async function handleUpload(){

if(!files || !event) return

setUploading(true)

for(const file of Array.from(files)){

const path = `${event.id}/${Date.now()}-${file.name}`

/* DIRECT UPLOAD NAAR STORAGE */

const {error:uploadError} = await supabase.storage
.from("uploads")
.upload(path,file)

if(uploadError){

console.error(uploadError)
alert("Upload mislukt")

continue

}

/* PUBLIC URL */

const {data:publicUrl} = supabase.storage
.from("uploads")
.getPublicUrl(path)

/* SAVE IN DATABASE */

await supabase
.from("uploads")
.insert({

event_id:event.id,
name:name,
message:message,
file_url:publicUrl.publicUrl,
type:file.type.startsWith("video") ? "video":"image"

})

}

setUploading(false)
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

<h1 style={{fontSize:34}}>
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

<h3>Upload jouw herinnering</h3>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:10,
border:"1px solid #ddd",
borderRadius:8
}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:10,
border:"1px solid #ddd",
borderRadius:8
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
disabled={uploading}
style={{
marginTop:10,
background:"#d4a24c",
border:"none",
padding:"12px 22px",
color:"white",
borderRadius:8
}}
>

{uploading ? "Upload bezig..." : "Upload"}

</button>

</div>


{/* GALLERY */}

<div style={{
maxWidth:900,
margin:"40px auto",
padding:"0 20px"
}}>

<h2>Galerij (gedeeld door gasten)</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>

{uploads.map((u)=>{

if(u.type==="image"){

return(
<img
key={u.id}
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1",
objectFit:"cover",
borderRadius:10
}}
/>
)

}

return(

<div key={u.id} style={{position:"relative"}}>

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
fontSize:30,
color:"white"
}}>
▶
</div>

</div>

)

})}

</div>

</div>

</div>

)

}