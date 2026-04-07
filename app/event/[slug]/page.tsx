"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useRouter } from "next/navigation"

export default function EventPage(){

const params = useParams()
const router = useRouter()

const slug = params.slug as string

const [event,setEvent] = useState<any>(null)
const [files,setFiles] = useState<FileList|null>(null)
const [name,setName] = useState("")
const [uploading,setUploading] = useState(false)
const [progress,setProgress] = useState(0)

useEffect(()=>{
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

async function upload(){

if(!files || !event) return

setUploading(true)

let done = 0

for(const file of Array.from(files)){

const path = `${event.id}/${Date.now()}-${file.name}`

const {error} = await supabase
.storage
.from("uploads")
.upload(path,file)

if(error){
alert("Upload fout")
return
}

const {data:url} = supabase
.storage
.from("uploads")
.getPublicUrl(path)

await supabase.from("uploads").insert({
event_id:event.id,
file_url:url.publicUrl,
type:file.type.startsWith("video")?"video":"image",
name:name
})

done++
setProgress(Math.round((done/files.length)*100))

}

setUploading(false)
setFiles(null)
setProgress(0)

alert("Upload klaar")

}

if(!event) return <div>Loading...</div>

return(

<div style={{padding:20,maxWidth:600,margin:"auto"}}>

{event.header_image && (
<img
src={event.header_image}
style={{
width:"100%",
borderRadius:16,
marginBottom:20
}}
/>
)}

<h1 style={{fontWeight:"bold"}}>{event.name}</h1>

<p>Deel jouw foto's en video's van dit moment</p>

<div style={{
background:"#fff",
padding:20,
borderRadius:12,
marginTop:20
}}>

<h3 style={{color:"#000"}}>Upload jouw herinnering</h3>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:10
}}
/>

<input
type="file"
multiple
onChange={(e)=>setFiles(e.target.files)}
/>

<p style={{color:"green"}}>
{files ? `${files.length} bestanden geselecteerd` : ""}
</p>

<button
disabled={!files}
onClick={upload}
style={{
marginTop:10,
background:files?"#d4a24c":"#ccc",
color:"#fff",
padding:"12px 20px",
border:"none",
borderRadius:8
}}
>
Upload
</button>

{uploading && (
<p style={{color:"red"}}>
Bezig met uploaden ({progress}%) klik niet weg
</p>
)}

</div>

<button
onClick={()=>router.push(`/event/${slug}/gallery`)}
style={{
marginTop:30,
background:"#d4a24c",
color:"#fff",
padding:"12px 20px",
borderRadius:10,
border:"none"
}}
>
Galerij bekijken
</button>

<p style={{marginTop:40,textAlign:"center"}}>
Powered by Showverhuur Memories
</p>

</div>

)

}