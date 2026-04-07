"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useRouter } from "next/navigation"

export default function Gallery(){

const params = useParams()
const router = useRouter()

const slug = params.slug as string

const [uploads,setUploads] = useState<any[]>([])
const [event,setEvent] = useState<any>(null)

useEffect(()=>{
load()
},[])

async function load(){

const {data:eventData} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

setEvent(eventData)

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventData.id)
.order("created_at",{ascending:false})

setUploads(data||[])

}

return(

<div style={{padding:20}}>

<button
onClick={()=>router.push(`/event/${slug}`)}
>
← Terug
</button>

<h2>Galerij (gedeeld door gasten)</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8,
marginTop:20
}}>

{uploads.map((u,i)=>{

return(

<div
key={u.id}
onClick={()=>router.push(`/event/${slug}/viewer?i=${i}`)}
style={{
cursor:"pointer",
position:"relative"
}}
>

{u.type==="image" && (
<img
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1/1",
objectFit:"cover",
borderRadius:8
}}
/>
)}

{u.type==="video" && (
<div style={{position:"relative"}}>

<video
src={u.file_url}
style={{
width:"100%",
aspectRatio:"1/1",
objectFit:"cover",
borderRadius:8
}}
/>

<div style={{
position:"absolute",
top:"50%",
left:"50%",
transform:"translate(-50%,-50%)",
fontSize:30
}}>
▶
</div>

</div>
)}

</div>

)

})}

</div>

</div>

)

}