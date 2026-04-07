"use client"

import { useEffect,useState } from "react"
import { supabase } from "@/lib/supabase"
import { useParams,useSearchParams,useRouter } from "next/navigation"

export default function Viewer(){

const params = useParams()
const search = useSearchParams()
const router = useRouter()

const slug = params.slug as string
const startIndex = Number(search.get("i")||0)

const [uploads,setUploads] = useState<any[]>([])
const [index,setIndex] = useState(startIndex)

let touchStart = 0

function handleTouchStart(e:any){
touchStart = e.touches[0].clientX
}

function handleTouchEnd(e:any){

let touchEnd = e.changedTouches[0].clientX

if(touchStart - touchEnd > 50){
setIndex(Math.min(index+1,uploads.length-1))
}

if(touchEnd - touchStart > 50){
setIndex(Math.max(index-1,0))
}

}

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

setUploads(data||[])

}

if(!uploads.length) return <div>Loading...</div>

const item = uploads[index]

return(

<div
onTouchStart={handleTouchStart}
onTouchEnd={handleTouchEnd}
style={{
background:"#000",
height:"100vh",
display:"flex",
flexDirection:"column",
justifyContent:"center",
alignItems:"center",
color:"#fff"
}}
>

<button
onClick={()=>router.back()}
style={{
position:"absolute",
top:20,
right:20,
fontSize:24
}}
>
✕
</button>

<p>{index+1} / {uploads.length}</p>

{item.type==="image" && (

<img
src={item.file_url}
style={{
maxHeight:"80vh",
maxWidth:"100%"
}}
/>

)}

{item.type==="video" && (

<video
src={item.file_url}
controls
style={{
maxHeight:"80vh"
}}
/>

)}

<p style={{marginTop:10}}>
{item.name}
</p>

</div>

)

}