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

if(!files.length || !event) return;

let uploaded = 0;

for(const file of files){

const path = `${event.id}/${Date.now()}-${file.name}`;

await supabase.storage
.from("event-uploads")
.upload(path,file);

const url =
process.env.NEXT_PUBLIC_SUPABASE_URL +
"/storage/v1/object/public/event-uploads/" +
path;

const type = file.type.startsWith("video") ? "video" : "image";

await supabase.from("uploads").insert({
event_id:event.id,
name,
message,
file_url:url,
type
});

uploaded++;
setProgress(Math.round((uploaded/files.length)*100));

}

setFiles([]);
setProgress(0);
loadUploads(event.id);

}

if(!event) return <div>Loading...</div>;

const header =
event.header_image ||
"https://images.unsplash.com/photo-1511285560929-80b456fea0bc";

return(

<div style={{
background:"#F5F1E9",
minHeight:"100vh",
fontFamily:"Inter"
}}>

{/* HERO */}

<div style={{
height:420,
backgroundImage:`url(${header})`,
backgroundSize:"cover",
backgroundPosition:"center",
position:"relative"
}}>

<div style={{
position:"absolute",
inset:0,
background:"linear-gradient(to bottom,rgba(0,0,0,0.2),rgba(0,0,0,0.6))"
}}/>

<div style={{
position:"absolute",
bottom:40,
left:"10%",
color:"white"
}}>

<h1 style={{
fontSize:40,
fontWeight:700
}}>
{event.name}
</h1>

<p style={{opacity:0.9}}>
{uploads.length} herinneringen gedeeld
</p>

</div>

</div>

{/* CONTENT */}

<div style={{
maxWidth:1100,
margin:"auto",
padding:"60px 20px"
}}>

{/* UPLOAD CARD */}

<div style={{
background:"white",
borderRadius:16,
padding:30,
boxShadow:"0 10px 30px rgba(0,0,0,0.08)"
}}>

<h2 style={{marginBottom:20}}>
Deel jullie herinnering
</h2>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{
width:"100%",
padding:12,
border:"1px solid #ddd",
borderRadius:8,
marginBottom:10
}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{
width:"100%",
padding:12,
border:"1px solid #ddd",
borderRadius:8,
marginBottom:10
}}
/>

<input
type="file"
multiple
onChange={(e)=>setFiles(Array.from(e.target.files || []))}
style={{marginBottom:20}}
/>

<button
onClick={upload}
style={{
background:"#C8A46A",
color:"white",
padding:"14px 28px",
borderRadius:8,
border:"none",
fontWeight:600,
cursor:"pointer"
}}
>
Upload herinnering
</button>

{progress>0 &&(

<div style={{marginTop:20}}>
Uploading {progress}%
</div>

)}

</div>

{/* GALLERY */}

<div style={{
marginTop:50,
columns:"3 280px",
columnGap:"16px"
}}>

{uploads.map(item=>(

<div
key={item.id}
style={{
breakInside:"avoid",
marginBottom:16,
borderRadius:14,
overflow:"hidden",
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}}
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
controls
style={{
width:"100%"
}}
/>

)}

</div>

))}

</div>

</div>

</div>

);

}