"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EventPage(){

const params = useParams();
const slug = params.slug as string;

const [event,setEvent] = useState<any>(null);
const [uploads,setUploads] = useState<any[]>([]);
const [name,setName] = useState("");
const [message,setMessage] = useState("");
const [file,setFile] = useState<File | null>(null);
const [viewerIndex,setViewerIndex] = useState<number | null>(null);
const [progress,setProgress] = useState(0);
const [access,setAccess] = useState(false);
const [passwordInput,setPasswordInput] = useState("");

useEffect(()=>{

loadEvent();

const channel = supabase
.channel("uploads")
.on(
"postgres_changes",
{
event:"INSERT",
schema:"public",
table:"uploads"
},
()=>{
loadEvent();
}
)
.subscribe();

return()=>{
supabase.removeChannel(channel);
};

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

const xhr = new XMLHttpRequest();

xhr.upload.addEventListener("progress",(e)=>{
if(e.lengthComputable){
const percent = Math.round((e.loaded/e.total)*100);
setProgress(percent);
}
});

const formData = new FormData();
formData.append("file",file);

xhr.open(
"POST",
process.env.NEXT_PUBLIC_SUPABASE_URL +
"/storage/v1/object/event-uploads/" +
filePath
);

xhr.setRequestHeader(
"Authorization",
"Bearer " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

xhr.onload = async ()=>{

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
setProgress(0);

loadUploads(event.id);

};

xhr.send(file);

}

const imageCount = uploads.filter(u=>u.type==="image").length;
const videoCount = uploads.filter(u=>u.type==="video").length;

if(!event) return <div style={{padding:40}}>Loading...</div>;

if(event.password && !access){

return(

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"white",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}>

<div>

<h2>Event beveiligd</h2>

<input
placeholder="Voer wachtwoord in"
onChange={(e)=>setPasswordInput(e.target.value)}
style={{padding:10}}
/>

<button
onClick={()=>{
if(passwordInput === event.password){
setAccess(true);
}
}}
style={{marginLeft:10}}
>
Enter
</button>

</div>

</div>

);

}

return(

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"#f8fafc",
fontFamily:"sans-serif"
}}>

{/* HERO HEADER */}

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

<h1 style={{fontSize:34,fontWeight:700}}>
{event.name}
</h1>

<p style={{opacity:0.8}}>
{imageCount} foto's • {videoCount} video's
</p>

</div>

</div>

<div style={{maxWidth:900,margin:"auto",padding:20}}>

{/* UPLOAD CARD */}

<div style={{
background:"#1e293b",
padding:20,
borderRadius:14,
marginTop:-40
}}>

<h2>Deel jouw herinnering</h2>

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
onChange={(e)=>setFile(e.target.files?.[0] || null)}
/>

<button
onClick={upload}
style={{
marginTop:10,
background:"#f59e0b",
padding:"12px 20px",
borderRadius:8
}}
>
Upload
</button>

{progress>0 &&(

<div style={{marginTop:10}}>

<div style={{
height:8,
background:"#334155",
borderRadius:6
}}>

<div style={{
width:progress+"%",
height:8,
background:"#f59e0b",
borderRadius:6
}}/>

</div>

<p style={{fontSize:12}}>Uploading {progress}%</p>

</div>

)}

</div>

{/* MASONRY GALLERY */}

<div style={{
marginTop:40,
columnCount:2,
columnGap:12
}}>

{uploads.map((item,index)=>(

<div
key={item.id}
style={{
breakInside:"avoid",
marginBottom:12,
cursor:"pointer"
}}
onClick={()=>setViewerIndex(index)}
>

{item.type==="image" ? (

<img
src={item.file_url}
style={{width:"100%",borderRadius:12}}
/>

):( 

<video
src={item.file_url}
style={{width:"100%",borderRadius:12}}
/>

)}

</div>

))}

</div>

</div>

{/* FULLSCREEN VIEWER */}

{viewerIndex!==null &&(

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
style={{maxWidth:"90%",maxHeight:"90%"}}
/>

):( 

<video
src={uploads[viewerIndex].file_url}
controls
style={{maxWidth:"90%",maxHeight:"90%"}}
/>

)}

<button
onClick={()=>viewerIndex<uploads.length-1 && setViewerIndex(viewerIndex+1)}
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