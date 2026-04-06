"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"

export default function EventPage({ params }: { params: { slug: string } }){

const slug = params.slug

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])

const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")

useEffect(()=>{
loadEvent()
},[])

async function loadEvent(){

if(!slug) return

const {data:eventData,error} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

if(error){
console.error(error)
return
}

setEvent(eventData)

const {data:uploadData} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventData.id)
.order("created_at",{ascending:false})

setUploads(uploadData || [])

}

async function upload(){

if(!files || !event) return

for(const file of Array.from(files)){

const fileName = `${Date.now()}-${file.name}`

await supabase.storage
.from("uploads")
.upload(fileName,file)

const {data} = supabase.storage
.from("uploads")
.getPublicUrl(fileName)

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

loadEvent()

}

if(!event){

return(
<div style={{padding:40}}>
Loading...
</div>
)

}

return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
padding:20
}}>

{event.header_image && (

<img
src={event.header_image}
style={{
width:"100%",
height:260,
objectFit:"cover",
borderRadius:10
}}
/>

)}

<h1>{event.name}</h1>

<div style={{
background:"white",
padding:20,
borderRadius:12,
marginBottom:20
}}>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{width:"100%",padding:10,marginBottom:10}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{width:"100%",padding:10,marginBottom:10}}
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
padding:"10px 20px",
borderRadius:6
}}
>
Upload
</button>

</div>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:6
}}>

{uploads.map((u:any)=>{

if(u.type==="image"){

return(
<img
key={u.id}
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1",
objectFit:"cover",
borderRadius:6
}}
/>
)

}

return(

<video
key={u.id}
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1",
objectFit:"cover",
borderRadius:6
}}
controls
/>

)

})}

</div>

</div>

)

}