"use client"

import { useEffect,useState,useRef } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EventPage(){

const params = useParams()
const slug = params?.slug as string

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])
const [files,setFiles] = useState<FileList | null>(null)
const [name,setName] = useState("")
const [uploading,setUploading] = useState(false)
const [progress,setProgress] = useState(0)

const [viewer,setViewer] = useState<number | null>(null)

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

const {data:uploadData} = await supabase
.from("uploads")
.select("*")
.eq("event_id",data.id)
.order("created_at",{ascending:false})

setUploads(uploadData || [])

}


async function handleUpload(){

if(!files || !event) return

setUploading(true)

let count = 0

for(const file of Array.from(files)){

const path = `${event.id}/${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
console.log(error)
alert("Upload fout")
continue
}

const {data:url} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase.from("uploads").insert({

event_id:event.id,
name:name,
file_url:url.publicUrl,
type:file.type.startsWith("video") ? "video":"image"

})

count++
setProgress(Math.round((count/files.length)*100))

}

setUploading(false)
setFiles(null)
setName("")

loadEvent()

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


{/* HEADER */}

{event.header_image && (

<div style={{
width:"100%",
height:200,
overflow:"hidden"
}}>

<img
src={event.header_image}
style={{
width:"100%",
height:"100%",
objectFit:"cover"
}}
/>

</div>

)}


<div style={{
maxWidth:900,
margin:"auto",
padding:"25px 20px"
}}>

<h1 style={{
fontSize:30,
fontWeight:"700",
color:"#1a1a1a"
}}>
{event.name}
</h1>

<p style={{
color:"#555"
}}>
Deel jouw foto's en video's van dit moment
</p>

</div>


{/* UPLOAD CARD */}

<div style={{
maxWidth:900,
margin:"auto",
background:"white",
padding:25,
borderRadius:14
}}>

<h3 style={{
fontWeight:600,
marginBottom:10
}}>
Upload jouw herinnering
</h3>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:12,
border:"1px solid #ccc",
borderRadius:8
}}
/>


{/* BUTTONS */}

<div style={{
display:"flex",
gap:12,
marginBottom:10
}}>

<label style={{
flex:1,
background:"#d4a24c",
color:"white",
padding:"14px",
borderRadius:10,
textAlign:"center",
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

<button
onClick={handleUpload}
style={{
flex:1,
background:"#d4a24c",
border:"none",
padding:"14px",
color:"white",
borderRadius:10
}}
>
Upload
</button>

</div>


{files && (

<p style={{
fontSize:14,
marginBottom:10
}}>
{files.length} bestanden geselecteerd
</p>

)}


{/* UPLOAD PROGRESS */}

{uploading && (

<div>

<div style={{
background:"#eee",
height:10,
borderRadius:6,
overflow:"hidden",
marginBottom:8
}}>

<div style={{
width:`${progress}%`,
background:"#d4a24c",
height:"100%"
}}/>

</div>

<p style={{
fontSize:13,
color:"#666"
}}>
Bezig met uploaden... klik deze pagina niet weg.
</p>

</div>

)}

</div>



{/* GALLERY */}

<div style={{
maxWidth:900,
margin:"40px auto",
padding:"0 20px"
}}>

<h2 style={{
fontWeight:"700",
marginBottom:15
}}>
Galerij (gedeeld door gasten)
</h2>


<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>


{uploads.map((u,i)=>{

if(u.type==="image"){

return(

<img
key={u.id}
loading="lazy"
src={u.file_url}
onClick={()=>setViewer(i)}
style={{
width:"100%",
aspectRatio:"1",
objectFit:"cover",
borderRadius:10,
cursor:"pointer"
}}
/>

)

}


return(

<div
key={u.id}
onClick={()=>setViewer(i)}
style={{
position:"relative",
cursor:"pointer"
}}
>

<video
src={u.file_url}
preload="metadata"
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



{/* VIEWER */}

{viewer!==null && (

<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"black",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:1000
}}
onClick={()=>setViewer(null)}
>

{uploads[viewer].type==="image" && (

<img
src={uploads[viewer].file_url}
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

)}

{uploads[viewer].type==="video" && (

<video
src={uploads[viewer].file_url}
controls
autoPlay
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

)}

</div>

)}

</div>

)

}
