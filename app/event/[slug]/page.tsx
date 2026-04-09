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
const [progress,setProgress] = useState(0)
const [count,setCount] = useState(0)
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

setUploading(true)
setCount(files.length)

let done = 0

for(const file of Array.from(files) as File[]){

if(!file.type.startsWith("image")) continue

const path = `${event.id}/${Date.now()}-${file.name}`

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
uploader_id:uploaderId

})

done++

setProgress(Math.round((done/files.length)*100))

}

setUploading(false)
setProgress(0)

alert("Upload voltooid")

}

if(!event){
return <div style={{padding:40}}>Loading...</div>
}

if(event.status==="closed"){

return(

<div style={{maxWidth:650,margin:"auto",padding:20,textAlign:"center"}}>

{event.header_image && (
<img src={event.header_image} style={{width:"100%",borderRadius:16,marginBottom:25}}/>
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

<div style={{
maxWidth:650,
margin:"auto",
padding:20,
textAlign:"center"
}}>

{event.header_image && (

<img
src={event.header_image}
loading="eager"
fetchPriority="high"
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
fontSize:18,
marginTop:10,
lineHeight:1.6
}}>
Alle momenten van deze speciale dag komen hier samen ❤️
</p>

<div style={{marginTop:30}}>

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

<div style={{
display:"flex",
flexDirection:"column",
gap:15
}}>

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

<p style={{
fontSize:13,
color:"#666",
marginTop:-10
}}>
Maximaal 20 afbeeldingen tegelijk
</p>

<button
onClick={()=>window.open("https://www.dropbox.com/request/2qE262FJbK3WfdjhAvM1")}
style={{
width:"100%",
padding:"18px",
border:"2px solid #ddd",
borderRadius:12,
background:"#fff",
cursor:"pointer",
display:"flex",
alignItems:"center",
justifyContent:"center",
gap:10,
fontSize:18
}}
>

<span style={{fontSize:22}}>🎥</span>

Video toevoegen

</button>

</div>

{uploading && (

<p style={{
color:"red",
marginTop:20,
fontWeight:"bold"
}}>
Bezig met uploaden van {count} afbeeldingen ({progress}%)
Klik deze pagina niet weg
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