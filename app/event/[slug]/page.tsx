"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useRouter } from "next/navigation"

export default function EventPage(){

const params = useParams()
const router = useRouter()
const slug = params.slug as string

const [event,setEvent] = useState<any>(null)
const [name,setName] = useState("")
const [message,setMessage] = useState("")
const [uploading,setUploading] = useState(false)
const [uploadCount,setUploadCount] = useState(0)
const [progress,setProgress] = useState(0)

useEffect(()=>{ loadEvent() },[])

async function loadEvent(){

const {data} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

setEvent(data)

}

async function handleFiles(e:any){

const files = e.target.files

if(!files || !event) return

setUploading(true)
setUploadCount(files.length)

let done = 0

for(const file of Array.from(files)){

const path = `${event.id}/${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
alert("Upload fout")
return
}

const {data:url} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase.from("uploads").insert({

event_id:event.id,
file_url:url.publicUrl,
type:file.type.startsWith("video")?"video":"image",
name:name,
message:message

})

done++
setProgress(Math.round((done/files.length)*100))

}

setUploading(false)
setProgress(0)

alert("Upload klaar!")

}

if(!event) return <div style={{padding:40}}>Loading...</div>

return(

<div style={{
maxWidth:650,
margin:"auto",
padding:20,
textAlign:"center"
}}>

{event.header_image && (

<img
src={event.header_image}
style={{
width:"100%",
borderRadius:16,
marginBottom:25
}}
/>

)}

<h1 style={{
fontFamily:"cursive",
fontSize:46
}}>
{event.name}
</h1>

<p style={{
marginTop:10,
fontSize:16,
lineHeight:1.6
}}>
Laat ons zien hoe je je vermaakt! Laat je foto's en video's deel uitmaken van de herinneringen aan deze speciale dag voor ons ❤️
</p>

<div style={{marginTop:35}}>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:14,
borderRadius:10,
border:"1px solid #ddd",
marginBottom:10
}}
/>

<textarea
placeholder="Laat een bericht achter..."
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{
width:"100%",
padding:14,
borderRadius:10,
border:"1px solid #ddd",
marginBottom:20
}}
/>

<label style={{
padding:"18px 25px",
border:"2px solid #ddd",
borderRadius:12,
cursor:"pointer",
display:"inline-flex",
alignItems:"center",
gap:10,
fontSize:18
}}>

<span>📷</span>

Foto of video toevoegen

<input
type="file"
multiple
onChange={handleFiles}
style={{display:"none"}}
/>

</label>

{uploading && (

<p style={{
color:"red",
marginTop:15
}}>
Bezig met uploaden van {uploadCount} bestanden ({progress}%)  
Klik niet weg
</p>

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

<div style={{
marginTop:50,
display:"flex",
flexDirection:"column",
alignItems:"center",
gap:10
}}>

<img
src="https://showverhuur.nl/wp-content/uploads/2026/04/Memories-logo.png"
style={{width:110}}
/>

<p style={{fontSize:14}}>
Powered by Showverhuur.nl
</p>

</div>

</div>

)

}