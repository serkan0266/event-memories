"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EventPage() {

const params = useParams();
const slug = params.slug as string;

const [event,setEvent] = useState<any>(null);
const [uploads,setUploads] = useState<any[]>([]);
const [name,setName] = useState("");
const [message,setMessage] = useState("");
const [file,setFile] = useState<File | null>(null);
const [viewerIndex,setViewerIndex] = useState<number | null>(null);

useEffect(()=>{
loadEvent();
},[slug]);

async function loadEvent(){

const {data} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.maybeSingle();

if(data){
setEvent(data);
loadUploads(data.id);
}

}

async function loadUploads(eventId:string){

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventId)
.order("created_at",{ascending:false});

setUploads(data || []);

}

async function upload(){

if(!file || !event) return;

const filePath = `${event.id}/${Date.now()}-${file.name}`;

const {error} = await supabase.storage
.from("event-uploads")
.upload(filePath,file);

if(error){
alert("Upload error");
return;
}

const fileUrl =
process.env.NEXT_PUBLIC_SUPABASE_URL +
"/storage/v1/object/public/event-uploads/" +
filePath;

const type = file.type.startsWith("video") ? "video" : "image";

await supabase.from("uploads").insert({
event_id:event.id,
name,
message,
file_url:fileUrl,
type
});

setName("");
setMessage("");
setFile(null);

loadUploads(event.id);

}

const imageCount = uploads.filter(u=>u.type==="image").length;
const videoCount = uploads.filter(u=>u.type==="video").length;

if(!event) return <div style={{padding:40}}>Loading...</div>;

return (

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"#f8fafc",
fontFamily:"sans-serif"
}}>

{/* HEADER */}

<div style={{
height:320,
backgroundImage:`url(${event.header_image || "https://images.unsplash.com/photo-1519681393784-d120267933ba"})`,
backgroundSize:"cover",
backgroundPosition:"center",
position:"relative"
}}>

<div style={{
position:"absolute",
inset:0,
background:"linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.8))"
}}/>

<div style={{
position:"absolute",
bottom:30,
left:30
}}>

<h1 style={{
fontSize:34,
fontWeight:700
}}>
{event.name}
</h1>

<p style={{opacity:0.8}}>
{imageCount} foto's • {videoCount} video's
</p>

</div>

</div>

<div style={{
maxWidth:900,
margin:"auto",
padding:20
}}>

{/* UPLOAD CARD */}

<div style={{
background:"#1e293b",
padding:20,
borderRadius:14,
marginTop:-40,
boxShadow:"0 20px 50px rgba(0,0,0,0.4)"
}}>

<h2 style={{marginBottom:15}}>Deel jouw herinnering</h2>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:10,
borderRadius:8,
border:"none"
}}
/>

<textarea
placeholder="Wil je iets delen met het stel?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{
width:"100%",
padding:12,
marginBottom:10,
borderRadius:8,
border:"none"
}}
/>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
/>

<button
onClick={upload}
style={{
marginTop:12,
padding:"12px 20px",
background:"#f59e0b",
border:"none",
borderRadius:8,
color:"#000",
fontWeight:600,
cursor:"pointer"
}}
>
Upload memory
</button>

</div>

{/* GALLERY */}

<h2 style={{
marginTop:40,
marginBottom:20
}}>
Memories
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(2,1fr)",
gap:14
}}>

{uploads.map((item,index)=>(

<div
key={item.id}
style={{
background:"#1e293b",
borderRadius:12,
overflow:"hidden",
cursor:"pointer"
}}
onClick={()=>setViewerIndex(index)}
>

{item.type==="image" ? (

<img
src={item.file_url}
style={{
width:"100%",
display:"block"
}}
/>

):( 

<video
src={item.file_url}
style={{
width:"100%"
}}
/>

)}

<div style={{padding:10}}>

<p style={{fontWeight:600}}>
{item.name}
</p>

<p style={{
fontSize:14,
opacity:0.7
}}>
{item.message}
</p>

</div>

</div>

))}

</div>

</div>

{/* FULLSCREEN VIEWER */}

{viewerIndex !== null && (

<div style={{
position:"fixed",
inset:0,
background:"rgba(0,0,0,0.95)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:1000
}}>

<button
onClick={()=>setViewerIndex(null)}
style={{
position:"absolute",
top:20,
right:20,
fontSize:24,
color:"white"
}}
>
✕
</button>

<button
onClick={()=>viewerIndex>0 && setViewerIndex(viewerIndex-1)}
style={{
position:"absolute",
left:20,
fontSize:40,
color:"white"
}}
>
‹
</button>

{uploads[viewerIndex].type==="image" ? (

<img
src={uploads[viewerIndex].file_url}
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

):( 

<video
src={uploads[viewerIndex].file_url}
controls
style={{
maxWidth:"90%",
maxHeight:"90%"
}}
/>

)}

<button
onClick={()=>viewerIndex < uploads.length-1 && setViewerIndex(viewerIndex+1)}
style={{
position:"absolute",
right:20,
fontSize:40,
color:"white"
}}
>
›
</button>

</div>

)}

</div>

);

}