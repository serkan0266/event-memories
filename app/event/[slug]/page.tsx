"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function EventPage(){

const params = useParams()
const slug = params?.slug as string

const [event,setEvent] = useState<any>(null)
const [uploads,setUploads] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

if(!slug) return

loadEvent()

},[slug])


async function loadEvent(){

console.log("Slug:",slug)

const {data,error} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

console.log("Event:",data)
console.log("Error:",error)

if(error){
setLoading(false)
return
}

setEvent(data)

const {data:uploadData} = await supabase
.from("uploads")
.select("*")
.eq("event_id",data.id)
.order("created_at",{ascending:false})

setUploads(uploadData || [])

setLoading(false)

}


if(loading){

return(
<div style={{padding:40}}>
Loading event...
</div>
)

}

if(!event){

return(
<div style={{padding:40}}>
Event niet gevonden
</div>
)

}

return(

<div style={{
background:"#f5efe6",
minHeight:"100vh",
padding:40
}}>

<h1>{event.name}</h1>

<p>Slug: {slug}</p>

<p>Aantal uploads: {uploads.length}</p>

</div>

)

}