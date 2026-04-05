"use client";

import { useEffect,useState } from "react";
import { supabase } from "@/lib/supabase";
import JSZip from "jszip";

export default function AdminPage(){

const [events,setEvents] = useState<any[]>([]);
const [selectedEvent,setSelectedEvent] = useState<any>(null);
const [uploads,setUploads] = useState<any[]>([]);
const [newEvent,setNewEvent] = useState("");

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

async function createEvent(){

if(!newEvent) return;

const slug = newEvent
.toLowerCase()
.replace(/\s+/g,"-");

await supabase
.from("events")
.insert({
name:newEvent,
slug
});

setNewEvent("");

loadEvents();

}

async function deleteEvent(event:any){

const confirmDelete = confirm("Event verwijderen inclusief uploads?");

if(!confirmDelete) return;

const {data:files} = await supabase
.from("uploads")
.select("*")
.eq("event_id",event.id);

for(const file of files || []){

const path = file.file_url.split("/event-uploads/")[1];

await supabase.storage
.from("event-uploads")
.remove([path]);

}

await supabase
.from("uploads")
.delete()
.eq("event_id",event.id);

await supabase
.from("events")
.delete()
.eq("id",event.id);

setSelectedEvent(null);

loadEvents();

}

async function openEvent(event:any){

setSelectedEvent(event);

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",event.id);

setUploads(data || []);

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

<h1 style={{fontSize:32}}>Showverhuur Memories</h1>

{/* CREATE EVENT */}

<div style={{
marginTop:30,
background:"#1e293b",
padding:20,
borderRadius:10
}}>

<h2>Nieuw event maken</h2>

<input
placeholder="Event naam"
value={newEvent}
onChange={(e)=>setNewEvent(e.target.value)}
style={{
padding:10,
width:"100%",
marginBottom:10
}}
/>

<button
onClick={createEvent}
style={{
background:"#22c55e",
padding:"10px 20px",
borderRadius:8
}}
>
Event maken
</button>

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
borderRadius:10
}}
>

<h3>{event.name}</h3>

<p>/event/{event.slug}</p>

<button
onClick={()=>openEvent(event)}
style={{marginRight:10}}
>
Open
</button>

<button
onClick={()=>deleteEvent(event)}
style={{
background:"#ef4444",
color:"white"
}}
>
Delete
</button>

</div>

))}

</div>

{/* EVENT DETAIL */}

{selectedEvent && (

<div style={{marginTop:40}}>

<h2>{selectedEvent.name}</h2>

<p>/event/{selectedEvent.slug}</p>

<button
onClick={downloadZip}
style={{
background:"#22c55e",
padding:"10px 20px",
borderRadius:8
}}
>
Download ZIP
</button>

<p style={{marginTop:20}}>
Uploads: {uploads.length}
</p>

</div>

)}

</div>

);

}