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

setUploads(data || [])

}

return(

<div style={{
padding:20,
maxWidth:900,
margin:"auto"
}}>

<button
onClick={()=>router.push(`/event/${slug}`)}
style={{marginBottom:10}}
>
← Terug
</button>

<h2 style={{
textAlign:"center",
fontWeight:"bold",
marginBottom:20
}}>
Galerij (gedeeld door gasten)
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:8
}}>

{uploads.map((u,i)=>{

return(

<div
key={u.id}
onClick={()=>router.push(`/event/${slug}/viewer?i=${i}`)}
style={{
position:"relative",
cursor:"pointer"
}}
>

<img
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
bottom:0,
left:0,
right:0,
padding:6,
background:"linear-gradient(transparent,rgba(0,0,0,0.7))",
color:"#fff",
fontSize:12
}}>

<b>{u.name}</b>

{u.message && (
<div style={{fontSize:11}}>
{u.message}
</div>
)}

</div>

</div>

)

})}

</div>

</div>

)

}