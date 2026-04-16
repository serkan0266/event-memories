"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams } from "next/navigation"

export default function DownloadPage(){

const params = useParams()
const slug = params.slug as string

const [event,setEvent] = useState<any>(null)
const [count,setCount] = useState(0)

useEffect(()=>{
load()
},[])

async function load(){

const {data:eventData} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

if(!eventData) return

setEvent(eventData)

const {data:uploads} = await supabase
.from("uploads")
.select("id,type")
.eq("event_id",eventData.id)

const images = uploads?.filter(u=>u.type==="image") || []

setCount(images.length)

}

if(!event){
return <div style={{padding:40}}>Loading...</div>
}

const totalZips = Math.ceil(count / 100)

return(

<div style={{
maxWidth:600,
margin:"auto",
padding:20,
textAlign:"center"
}}>

<h1 style={{fontSize:32}}>
Download alle herinneringen 📸
</h1>

<p style={{marginTop:10,opacity:0.7}}>
Klik op de bestanden hieronder om alles te downloaden
</p>

<div style={{marginTop:30}}>

{Array.from({length: totalZips}, (_, i)=>{

const batch = i + 1

return(
<a
key={batch}
href={`/api/zip?event=${event.id}&batch=${batch}`}
style={{
display:"block",
marginTop:10,
padding:"14px",
borderRadius:10,
background:"#d4a24c",
color:"#fff",
textDecoration:"none"
}}
>
Download ZIP {batch} ({(batch-1)*100} - {batch*100})
</a>
)

})}

</div>

</div>

)

}