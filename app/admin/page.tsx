"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabase";
import JSZip from "jszip";

export default function AdminPage(){

const [events,setEvents] = useState<any[]>([]);
const [uploads,setUploads] = useState<any[]>([]);
const [selectedEvent,setSelectedEvent] = useState<any>(null);

const [stats,setStats] = useState({
events:0,
uploads:0,
photos:0,
videos:0
});

useEffect(()=>{
loadEvents();
loadStats();
},[]);

async function loadEvents(){

const {data} = await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false});

setEvents(data || []);

}

async function loadStats(){

const {data:events} = await supabase.from("events").select("*");
const {data:uploads} = await supabase.from("uploads").select("*");

setStats({
events:events?.length || 0,
uploads:uploads?.length || 0,
photos:uploads?.filter(u=>u.type==="image").length || 0,
videos:uploads?.filter(u=>u.type==="video").length || 0
});

}

async function loadUploads(event:any){

setSelectedEvent(event);

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",event.id);

setUploads(data || []);

}

async function uploadHeader(e:any){

const file = e.target.files[0];

const path = "headers/" + Date.now() + file.name;

await supabase.storage
.from("event-uploads")
.upload(path,file);

const url =
process.env.NEXT_PUBLIC_SUPABASE_URL +
"/storage/v1/object/public/event-uploads/" +
path;

await supabase
.from("events")
.update({header_image:url})
.eq("id",selectedEvent.id);

loadEvents();

}

async function downloadZip(){

const zip = new JSZip();

for(const item of uploads){

const res = await fetch(item.file_url);
const blob = await res.blob();

zip.file(item.file_url.split("/").pop(),blob);

}

const content = await zip.generateAsync({type:"blob"});

const link = document.createElement("a");
link.href = URL.createObjectURL(content);
link.download = selectedEvent.slug + ".zip";
link.click();

}

return(

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"#f8fafc",
padding:40,
fontFamily:"sans-serif"
}}>

<h1 style={{fontSize:32,fontWeight:700}}>
Showverhuur Memories Dashboard
</h1>

{/* ANALYTICS */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:20,
marginTop:30
}}>

<Card title="Events" value={stats.events}/>
<Card title="Uploads" value={stats.uploads}/>
<Card title="Photos" value={stats.photos}/>
<Card title="Videos" value={stats.videos}/>

</div>

{/* EVENTS */}

<h2 style={{marginTop:40}}>Events</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:20,
marginTop:20
}}>

{events.map(event=>(

<div
key={event.id}
style={{
background:"#1e293b",
padding:20,
borderRadius:12,
cursor:"pointer"
}}
onClick={()=>loadUploads(event)}
>

<h3>{event.name}</h3>
<p style={{opacity:0.7}}>
/event/{event.slug}
</p>

</div>

))}

</div>

{/* EVENT DETAIL */}

{selectedEvent && (

<div style={{marginTop:50}}>

<h2>{selectedEvent.name}</h2>

<p style={{opacity:0.7}}>
/event/{selectedEvent.slug}
</p>

{/* QR LINK */}

<div style={{marginTop:20}}>

<h3>Event link</h3>

<a
href={"/event/"+selectedEvent.slug}
target="_blank"
style={{color:"#f59e0b"}}
>
/event/{selectedEvent.slug}
</a>

</div>

{/* HEADER UPLOAD */}

<div style={{marginTop:20}}>

<h3>Header afbeelding uploaden</h3>

<input type="file" onChange={uploadHeader}/>

</div>

{/* DOWNLOAD */}

<div style={{marginTop:30}}>

<button
onClick={downloadZip}
style={{
padding:"10px 16px",
background:"#22c55e",
border:"none",
borderRadius:8,
cursor:"pointer"
}}
>
Download ZIP
</button>

</div>

</div>

)}

</div>

);

}

function Card({title,value}:any){

return(

<div style={{
background:"#1e293b",
padding:20,
borderRadius:12
}}>

<p style={{opacity:0.7}}>
{title}
</p>

<h2 style={{fontSize:28,fontWeight:700}}>
{value}
</h2>

</div>

);

}