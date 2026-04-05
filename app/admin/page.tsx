"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabase";
import JSZip from "jszip";
import QRCode from "qrcode.react";

export default function AdminPage(){

const [events,setEvents] = useState<any[]>([]);
const [uploads,setUploads] = useState<any[]>([]);
const [selectedEvent,setSelectedEvent] = useState<any>(null);

useEffect(()=>{
loadEvents();
},[]);

async function loadEvents(){

const {data} = await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false});

setEvents(data || []);

}

async function loadUploads(event:any){

setSelectedEvent(event);

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",event.id);

setUploads(data || []);

}

const imageCount = uploads.filter(u=>u.type==="image").length;
const videoCount = uploads.filter(u=>u.type==="video").length;

async function downloadZip(){

const zip = new JSZip();

for(const item of uploads){

const response = await fetch(item.file_url);
const blob = await response.blob();

zip.file(item.file_url.split("/").pop(),blob);

}

const content = await zip.generateAsync({type:"blob"});

const link = document.createElement("a");
link.href = URL.createObjectURL(content);
link.download = selectedEvent.slug + ".zip";
link.click();

}

async function downloadPhotos(){

const zip = new JSZip();

for(const item of uploads.filter(u=>u.type==="image")){

const res = await fetch(item.file_url);
const blob = await res.blob();

zip.file(item.file_url.split("/").pop(),blob);

}

const content = await zip.generateAsync({type:"blob"});

const link = document.createElement("a");
link.href = URL.createObjectURL(content);
link.download = "photos.zip";
link.click();

}

async function downloadVideos(){

const zip = new JSZip();

for(const item of uploads.filter(u=>u.type==="video")){

const res = await fetch(item.file_url);
const blob = await res.blob();

zip.file(item.file_url.split("/").pop(),blob);

}

const content = await zip.generateAsync({type:"blob"});

const link = document.createElement("a");
link.href = URL.createObjectURL(content);
link.download = "videos.zip";
link.click();

}

return(

<div style={{
background:"#0f172a",
minHeight:"100vh",
color:"white",
padding:40
}}>

<h1 style={{fontSize:32,fontWeight:700}}>
Admin Dashboard
</h1>

{/* EVENTS LIST */}

<h2 style={{marginTop:30}}>Events</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:20
}}>

{events.map(event=>(

<div
key={event.id}
style={{
background:"#1e293b",
padding:20,
borderRadius:10,
cursor:"pointer"
}}
onClick={()=>loadUploads(event)}
>

<h3>{event.name}</h3>
<p>{event.slug}</p>

</div>

))}

</div>

{/* EVENT DETAIL */}

{selectedEvent && (

<div style={{marginTop:40}}>

<h2>{selectedEvent.name}</h2>

<p>
{imageCount} foto's • {videoCount} video's
</p>

{/* QR CODE */}

<div style={{marginTop:20}}>

<p>QR code voor gasten</p>

<QRCode
value={
window.location.origin +
"/event/" +
selectedEvent.slug
}
/>

</div>

{/* DOWNLOAD BUTTONS */}

<div style={{marginTop:30,display:"flex",gap:10}}>

<button
onClick={downloadPhotos}
style={{
padding:"10px 16px",
background:"#f59e0b",
border:"none",
borderRadius:6
}}
>
Download Photos
</button>

<button
onClick={downloadVideos}
style={{
padding:"10px 16px",
background:"#f59e0b",
border:"none",
borderRadius:6
}}
>
Download Videos
</button>

<button
onClick={downloadZip}
style={{
padding:"10px 16px",
background:"#22c55e",
border:"none",
borderRadius:6
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