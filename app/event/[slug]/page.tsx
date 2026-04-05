"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EventPage() {

const params = useParams();
const slug = params?.slug;

const [event,setEvent] = useState<any>(null);
const [uploads,setUploads] = useState<any[]>([]);

const [files,setFiles] = useState<FileList | null>(null);
const [name,setName] = useState("");
const [message,setMessage] = useState("");

const [uploading,setUploading] = useState(false);
const [progress,setProgress] = useState(0);

const [viewer,setViewer] = useState<number | null>(null);

const [touchStart,setTouchStart] = useState<number | null>(null);


useEffect(()=>{

if(slug) loadEvent()

},[slug])


async function loadEvent(){

const {data} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

setEvent(data)

if(data) loadUploads(data.id)

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

let done = 0

for(const file of Array.from(files)){

const path = `${event.id}/${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
console.log(error)
continue
}

const {data:publicUrl} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase.from("uploads").insert({

event_id:event.id,
name:name,
message:message,
file_url:publicUrl.publicUrl,
thumbnail_url:publicUrl.publicUrl,
type:file.type.startsWith("video") ? "video":"image"

})

done++

setProgress(Math.round(done/files.length*100))

}

setUploading(false)
setFiles(null)
setProgress(0)

loadUploads(event.id)

}


/* REALTIME UPDATES */

useEffect(()=>{

if(!event) return

const channel = supabase
.channel("uploads-realtime")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"uploads"
},
(payload)=>{

if(payload.new.event_id === event.id){

setUploads(prev=>[payload.new,...prev])

}

}
)
.subscribe()

return ()=>{

supabase.removeChannel(channel)

}

},[event])


/* SWIPE */

function handleTouchStart(e:any){

setTouchStart(e.touches[0].clientX)

}

function handleTouchEnd(e:any){

if(touchStart === null) return

const diff = touchStart - e.changedTouches[0].clientX

if(diff > 50){

next()

}

if(diff < -50){

prev()

}

setTouchStart(null)

}

function next(){

if(viewer === null) return

setViewer((viewer+1)%uploads.length)

}

function prev(){

if(viewer === null) return

setViewer((viewer-1+uploads.length)%uploads.length)

}



if(!event) return <div style={{padding:40}}>Loading...</div>

const photos = uploads.filter(u=>u.type==="image").length
const videos = uploads.filter(u=>u.type==="video").length


return(

<div style={{background:"#081a2f",minHeight:"100vh",color:"white"}}>


{/* HEADER */}

<div style={{
height:200,
backgroundImage:`url(${event.header_image})`,
backgroundSize:"cover",
backgroundPosition:"center",
position:"relative"
}}>

<div style={{
position:"absolute",
bottom:0,
left:0,
right:0,
padding:20,
background:"linear-gradient(transparent,rgba(0,0,0,0.8))"
}}>

<h1 style={{fontSize:28}}>{event.name}</h1>
<p>{photos} foto's • {videos} video's</p>

</div>

</div>


{/* UPLOAD BOX */}

<div style={{
maxWidth:700,
margin:"30px auto",
background:"#14263e",
padding:20,
borderRadius:16
}}>

<h3>Deel jouw herinnering</h3>

<input
placeholder="Naam"
value={name}
onChange={e=>setName(e.target.value)}
style={{
width:"100%",
padding:10,
marginBottom:10,
borderRadius:6,
border:"none"
}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={e=>setMessage(e.target.value)}
style={{
width:"100%",
padding:10,
borderRadius:6,
border:"none"
}}
/>

<br/><br/>

<input
type="file"
multiple
onChange={(e)=>setFiles(e.target.files)}
/>

<br/><br/>

<button
onClick={handleUpload}
style={{
background:"#d4a24c",
border:"none",
padding:"12px 22px",
borderRadius:8,
color:"white"
}}
>

Upload

</button>

{uploading && (

<div style={{marginTop:15}}>

<div style={{
height:6,
background:"#0b1628",
borderRadius:10
}}>

<div style={{
width:`${progress}%`,
height:6,
background:"#d4a24c"
}}/>

</div>

<p style={{fontSize:12}}>
Upload bezig... sluit deze pagina niet
</p>

</div>

)}

</div>


{/* INSTAGRAM GRID */}

<div style={{
maxWidth:1200,
margin:"0 auto",
padding:10,
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:6
}}>

{uploads.map((item,index)=>(

<div
key={item.id}
onClick={()=>setViewer(index)}
style={{
cursor:"pointer",
position:"relative",
overflow:"hidden",
borderRadius:6
}}
>

{item.type==="video" ? (

<>

<video
src={item.file_url}
preload="metadata"
muted
playsInline
style={{width:"100%",height:120,objectFit:"cover"}}
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

</>

):(

<img
src={item.file_url}
style={{width:"100%",height:120,objectFit:"cover"}}
/>

)}

</div>

))}

</div>


{/* FULLSCREEN VIEWER */}

{viewer!==null && (

<div
style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"black",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999
}}

onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}

>

<button
onClick={()=>setViewer(null)}
style={{
position:"absolute",
top:20,
right:20,
fontSize:30,
background:"none",
border:"none",
color:"white",
cursor:"pointer"
}}
>
✕
</button>


{uploads[viewer].type==="video" ? (

<video
src={uploads[viewer].file_url}
autoPlay
controls
style={{maxWidth:"90%",maxHeight:"90%"}}
/>

):(

<img
src={uploads[viewer].file_url}
style={{maxWidth:"90%",maxHeight:"90%"}}
/>

)}

</div>

)}

</div>

)

}