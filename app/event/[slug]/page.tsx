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
const [files,setFiles] = useState<File[]>([]);
const [progress,setProgress] = useState(0);
const [viewer,setViewer] = useState<number | null>(null);

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

if(!files.length || !event) return;

let uploaded = 0;

for(const file of files){

const filePath = `${event.id}/${Date.now()}-${file.name}`;

await supabase.storage
.from("event-uploads")
.upload(filePath,file);

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

uploaded++;

setProgress(Math.round((uploaded/files.length)*100));

}

setFiles([]);
setName("");
setMessage("");
setProgress(0);

loadUploads(event.id);

}

const imageCount = uploads.filter(u=>u.type==="image").length;
const videoCount = uploads.filter(u=>u.type==="video").length;

if(!event) return <div style={{padding:40}}>Loading...</div>;

return(

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"#f8fafc",
fontFamily:"sans-serif"
}}>

{/* HEADER */}

<div style={{
height:300,
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
bottom:20,
left:20
}}>

<h1 style={{fontSize:32,fontWeight:700}}>
{event.name}
</h1>

<p>
{imageCount} foto's • {videoCount} video's
</p>

</div>

</div>

<div style={{maxWidth:900,margin:"auto",padding:20}}>

{/* UPLOAD FORM */}

<div style={{
background:"#1e293b",
padding:20,
borderRadius:12,
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
multiple
onChange={(e)=>setFiles(Array.from(e.target.files || []))}
style={{marginBottom:10}}
/>

<button
onClick={upload}
style={{
background:"#f59e0b",
padding:"12px 20px",
borderRadius:8,
border:"none"
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

<p style={{fontSize:12}}>
Uploading {progress}%
</p>

</div>

)}

</div>

{/* GALLERY */}

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
onClick={()=>setViewer(index)}
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

{viewer!==null &&(

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
onClick={()=>setViewer(null)}
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
onClick={()=>viewer>0 && setViewer(viewer-1)}
style={{
position:"absolute",
left:20,
fontSize:40,
color:"white"
}}
>
‹
</button>

{uploads[viewer].type==="image" ? (

<img
src={uploads[viewer].file_url}
style={{maxWidth:"90%",maxHeight:"90%"}}
/>

):( 

<video
src={uploads[viewer].file_url}
controls
style={{maxWidth:"90%",maxHeight:"90%"}}
/>

)}

<button
onClick={()=>viewer<uploads.length-1 && setViewer(viewer+1)}
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