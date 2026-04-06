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

let list:any[] = []

for(const e of data){

const {data:uploads} = await supabase
.from("uploads")
.select("*")
.eq("event_id",e.id)

let photos = 0
let videos = 0

uploads?.forEach((u:any)=>{

if(u.type==="image") photos++
if(u.type==="video") videos++

})

list.push({
...e,
uploads:uploads?.length || 0,
photos,
videos,
storage:uploads?.length*5 || 0
})

}

setEvents(list)

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


async function uploadHeader(e:any,eventId:string){

const file = e.target.files[0]

if(!file) return

const path = `headers/${Date.now()}-${file.name}`

const {error} = await supabase.storage
.from("uploads")
.upload(path,file)

if(error){
alert("Upload fout")
return
}

const {data:url} = supabase.storage
.from("uploads")
.getPublicUrl(path)

await supabase
.from("events")
.update({header_image:url.publicUrl})
.eq("id",eventId)

alert("Header geupload")

loadEvents()

}


return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
padding:40
}}>

<h1>Memories Admin</h1>


{/* CREATE EVENT */}

<div style={{
background:"#eee",
padding:20,
borderRadius:12,
marginBottom:30
}}>

<h3>Nieuw event maken</h3>

<input
placeholder="Event naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{padding:10,marginRight:10}}
/>

<input
placeholder="Slug (bijv babyfeest)"
value={slug}
onChange={(e)=>setSlug(e.target.value)}
style={{padding:10,marginRight:10}}
/>

<button
onClick={createEvent}
style={{
background:"#d4a24c",
color:"white",
border:"none",
padding:"10px 16px",
borderRadius:6
}}
>
Maak event
</button>

</div>


{/* EVENTS */}

<div style={{
display:"flex",
flexWrap:"wrap",
gap:30
}}>

{events.map((e)=>{

const url = `https://memories.showverhuur.nl/event/${e.slug}`

return(

<div key={e.id}
style={{
background:"#f3f3f3",
padding:20,
borderRadius:14,
width:320
}}
>

<h3>{e.name}</h3>

<p>/event/{e.slug}</p>


{/* STATS */}

<p>📤 Uploads: {e.uploads}</p>
<p>📸 Foto's: {e.photos}</p>
<p>🎥 Video's: {e.videos}</p>
<p>💾 Storage: {e.storage} MB</p>


<a href={url} target="_blank">
Open event
</a>


{/* QR */}

<div style={{marginTop:10}}>

<QRCode value={url} size={150} />

</div>


{/* HEADER UPLOAD */}

<div style={{marginTop:10}}>

<input
type="file"
onChange={(ev)=>uploadHeader(ev,e.id)}
/>

</div>


{/* ZIP */}

<a
href={`/api/zip?event=${e.id}`}
style={{
display:"block",
marginTop:10,
background:"#d4a24c",
color:"white",
padding:"10px",
borderRadius:6,
textAlign:"center"
}}
>
Download alle media (ZIP)
</a>


{/* DELETE */}

<button
onClick={()=>deleteEvent(e.id)}
style={{
marginTop:10,
background:"red",
color:"white",
border:"none",
padding:"10px",
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