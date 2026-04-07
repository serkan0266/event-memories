"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useRouter } from "next/navigation"

export default function Gallery(){

const params = useParams()
const router = useRouter()
const slug = params.slug as string

const [uploads,setUploads] = useState<any[]>([])

useEffect(()=>{ load() },[])

async function load(){

const {data:eventData} = await supabase
.from("events")
.select("*")
.eq("slug",slug)
.single()

const {data} = await supabase
.from("uploads")
.select("*")
.eq("event_id",eventData.id)
.order("created_at",{ascending:false})
.limit(120)

setUploads(data||[])

}

return(

<div style={{padding:20}}>

<button onClick={()=>router.push(`/event/${slug}`)}>
← Terug
</button>

<h2 style={{
textAlign:"center",
fontWeight:"bold",
marginTop:10
}}>
Galerij (gedeeld door gasten)
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8,
marginTop:20
}}>

{uploads.map((u,i)=>(

<div
key={u.id}
onClick={()=>router.push(`/event/${slug}/viewer?i=${i}`)}
style={{cursor:"pointer"}}
>

<img
src={u.file_url}
loading="lazy"
style={{
width:"100%",
aspectRatio:"1/1",
objectFit:"cover",
borderRadius:8
}}
/>

</div>

))}

</div>

</div>

)

}