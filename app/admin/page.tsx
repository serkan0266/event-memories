"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import QRCode from "react-qr-code"

export default function AdminPage(){

const [events,setEvents] = useState<any[]>([])
const [name,setName] = useState("")
const [slug,setSlug] = useState("")

useEffect(()=>{
loadEvents()
},[])

async function loadEvents(){

const {data} = await supabase
.from("events")
.select("*")
.order("created_at",{ascending:false})

if(!data) return

let eventsWithStats:any[] = []

for(const e of data){

const {data:uploads} = await supabase
.from("uploads")
.select("*")
.eq("event_id",e.id)

let photos = 0
let videos = 0
let storage = 0

uploads?.forEach((u:any)=>{

if(u.type==="image") photos++
if(u.type==="video") videos++

})

uploads?.forEach((u:any)=>{

if(u.file_url){

storage += 5 // simpele schatting per bestand

}

})

eventsWithStats.push({
...e,
uploads:uploads?.length || 0,
photos,
videos,
storage
})

}

setEvents(eventsWithStats)

}


async function createEvent(){

if(!name || !slug) return

await supabase.from("events").insert({
name,
slug
})

setName("")
setSlug("")

loadEvents()

}

async function deleteEvent(id:string){

if(!confirm("Event verwijderen?")) return

await supabase.from("events").delete().eq("id",id)

loadEvents()

}

return(

<div style={{padding:40}}>

<h1>Memories Admin</h1>


{/* CREATE EVENT */}

<div style={{
background:"#eee",
padding:20,
borderRadius:10,
marginBottom:30
}}>

<h3>Nieuw event maken</h3>

<input
placeholder="Event naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{marginRight:10,padding:8}}
/>

<input
placeholder="Slug (bijv babyfeest)"
value={slug}
onChange={(e)=>setSlug(e.target.value)}
style={{marginRight:10,padding:8}}
/>

<button
onClick={createEvent}
style={{
background:"#d4a24c",
color:"white",
padding:"10px 16px",
border:"none",
borderRadius:6
}}
>
Maak event
</button>

</div>


{/* EVENTS */}

<div style={{display:"flex",gap:30,flexWrap:"wrap"}}>

{events.map((e)=>{

const url = `https://memories.showverhuur.nl/event/${e.slug}`

return(

<div key={e.id}
style={{
background:"#f5f5f5",
padding:20,
borderRadius:12,
width:300
}}
>

<h3>{e.name}</h3>

<p>/event/{e.slug}</p>


{/* STATS */}

<div style={{marginBottom:10}}>

<p>📤 Uploads: {e.uploads}</p>
<p>📸 Foto's: {e.photos}</p>
<p>🎥 Video's: {e.videos}</p>
<p>💾 Storage: {e.storage} MB</p>

</div>


<a href={url} target="_blank">
Open event
</a>


<div style={{marginTop:10}}>

<QRCode value={url} size={150} />

</div>


<button
onClick={()=>deleteEvent(e.id)}
style={{
marginTop:10,
background:"red",
color:"white",
border:"none",
padding:"8px 12px",
borderRadius:6
}}
>
Verwijder event
</button>

</div>

)

})}

</div>

</div>

)

}