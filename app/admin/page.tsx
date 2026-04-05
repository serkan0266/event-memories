"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

const [allowed,setAllowed] = useState(false)
const [code,setCode] = useState("")

const [events,setEvents] = useState<any[]>([])
const [name,setName] = useState("")
const [slug,setSlug] = useState("")

useEffect(()=>{

const saved = localStorage.getItem("admin_access")

if(saved === "true"){
setAllowed(true)
loadEvents()
}

},[])


function login(){

if(code === "66"){
localStorage.setItem("admin_access","true")
setAllowed(true)
loadEvents()
}else{
alert("Verkeerde code")
}

}


async function loadEvents(){

const {data} = await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false})

setEvents(data || [])

}


async function createEvent(){

if(!name || !slug) return

await supabase.from("events").insert({
name:name,
slug:slug
})

setName("")
setSlug("")

loadEvents()

}


async function deleteEvent(id:string){

if(!confirm("Event verwijderen?")) return

await supabase
.from("events")
.delete()
.eq("id",id)

loadEvents()

}


/* LOGIN SCREEN */

if(!allowed){

return(

<div style={{
height:"100vh",
display:"flex",
alignItems:"center",
justifyContent:"center",
background:"#f5efe6"
}}>

<div style={{
background:"white",
padding:40,
borderRadius:12,
boxShadow:"0 10px 30px rgba(0,0,0,0.1)"
}}>

<h2>Admin toegang</h2>

<input
type="password"
placeholder="Code"
value={code}
onChange={e=>setCode(e.target.value)}
style={{
padding:10,
width:200,
marginTop:10
}}
/>

<br/><br/>

<button
onClick={login}
style={{
background:"#d4a24c",
border:"none",
padding:"10px 20px",
color:"white",
borderRadius:6
}}
>
Login
</button>

</div>

</div>

)

}


/* ADMIN PANEL */

return(

<div style={{
padding:40,
background:"#f5efe6",
minHeight:"100vh"
}}>

<h1 style={{marginBottom:20}}>Memories Admin</h1>


{/* CREATE EVENT */}

<div style={{
background:"white",
padding:20,
borderRadius:10,
marginBottom:30
}}>

<h3>Nieuw event</h3>

<input
placeholder="Event naam"
value={name}
onChange={e=>setName(e.target.value)}
style={{padding:10,marginRight:10}}
/>

<input
placeholder="Slug (bijv babyfeest)"
value={slug}
onChange={e=>setSlug(e.target.value)}
style={{padding:10,marginRight:10}}
/>

<button
onClick={createEvent}
style={{
background:"#d4a24c",
border:"none",
padding:"10px 20px",
color:"white",
borderRadius:6
}}
>
Maak event
</button>

</div>


{/* EVENT LIST */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",
gap:20
}}>

{events.map(event=>(

<div
key={event.id}
style={{
background:"white",
padding:20,
borderRadius:10
}}
>

<h3>{event.name}</h3>

<p>/event/{event.slug}</p>

<a
href={`/event/${event.slug}`}
target="_blank"
>
Open event
</a>

<br/><br/>

{/* QR CODE */}

<img
src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://memories.showverhuur.nl/event/${event.slug}`}
/>

<br/><br/>

<a
href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=https://memories.showverhuur.nl/event/${event.slug}`}
download
>
Download QR
</a>

<br/><br/>

<button
onClick={()=>deleteEvent(event.id)}
style={{
background:"red",
border:"none",
padding:"8px 14px",
color:"white",
borderRadius:6
}}
>
Verwijder
</button>

</div>

))}

</div>

</div>

)

}