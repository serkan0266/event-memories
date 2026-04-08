"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {

const gold = "#C9A46C"
const beige = "#F7F3EE"
const dark = "#0f172a"

const whatsapp =
"https://wa.me/31612394000?text=Wij%20willen%20graag%20een%20Memories%20pagina%20voor%20datum..."

const photos = [
"https://images.unsplash.com/photo-1529636798458-92182e662485",
"https://images.unsplash.com/photo-1521334884684-d80222895322",
"https://images.unsplash.com/photo-1519741497674-611481863552",
"https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
]

return (

<main style={{
fontFamily:"system-ui",
background:beige,
color:"#1f2937"
}}>

{/* HERO */}

<section style={{
padding:"140px 20px",
maxWidth:1200,
margin:"0 auto",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:80,
alignItems:"center"
}}>

<div>

<motion.h1
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{duration:.8}}
style={{
fontSize:"clamp(48px,6vw,80px)",
lineHeight:1.05
}}
>
Alle herinneringen
van jullie event
op één plek
</motion.h1>

<p style={{
fontSize:20,
marginTop:20,
opacity:.8
}}>
Gasten scannen een QR code en uploaden foto's.
Alles komt automatisch op jullie eventpagina.
</p>

<div style={{marginTop:40,display:"flex",gap:15}}>

<a href={whatsapp}
style={{
background:gold,
padding:"16px 34px",
borderRadius:14,
color:"white",
textDecoration:"none",
fontWeight:600
}}
>
Start Memories
</a>

<Link href="/demo"
style={{
border:`2px solid ${gold}`,
padding:"16px 34px",
borderRadius:14
}}
>
Bekijk demo
</Link>

</div>

</div>


{/* FLOATING PHOTO WALL */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:20
}}>

{photos.map((img,i)=>(

<motion.img
key={i}
src={img}
initial={{opacity:0,y:40}}
animate={{opacity:1,y:0}}
transition={{delay:i*0.2}}
style={{
width:"100%",
borderRadius:20,
boxShadow:"0 20px 60px rgba(0,0,0,0.2)"
}}
/>

))}

</div>

</section>



{/* QR SCAN ANIMATION */}

<section style={{
background:"white",
padding:"120px 20px"
}}>

<div style={{
maxWidth:900,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{
fontSize:42,
marginBottom:50
}}>
Hoe het werkt
</h2>


{/* QR VISUAL */}

<div style={{
position:"relative",
width:260,
height:260,
margin:"0 auto",
borderRadius:20,
background:"#eee",
display:"flex",
alignItems:"center",
justifyContent:"center"
}}>

<img
src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=memories"
style={{width:200}}
/>

{/* scanning line */}

<motion.div
animate={{y:[-100,100,-100]}}
transition={{duration:3,repeat:Infinity}}
style={{
position:"absolute",
width:"100%",
height:4,
background:gold,
boxShadow:`0 0 20px ${gold}`
}}
/>

</div>

<p style={{marginTop:30,opacity:.7}}>
Gasten scannen de QR code en uploaden direct foto's.
</p>

</div>

</section>



{/* AUTO PHOTO WALL */}

<section style={{
padding:"120px 20px",
overflow:"hidden"
}}>

<motion.div
animate={{x:["0%","-50%"]}}
transition={{
repeat:Infinity,
duration:20,
ease:"linear"
}}
style={{
display:"flex",
gap:20
}}
>

{[...photos,...photos,...photos].map((img,i)=>(

<img
key={i}
src={img}
style={{
width:260,
height:180,
objectFit:"cover",
borderRadius:16
}}
/>

))}

</motion.div>

</section>



{/* EVENTS */}

<section style={{
padding:"120px 20px",
maxWidth:1200,
margin:"0 auto"
}}>

<h2 style={{
textAlign:"center",
fontSize:46,
marginBottom:60
}}>
Perfect voor elk event
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:25
}}>

{[
"Gender Reveals",
"Bruiloften",
"Baby Showers",
"Verjaardagen",
"Bedrijfsevenementen",
"Feesten"
].map((item,i)=>(

<motion.div
key={i}
whileHover={{y:-8}}
style={{
background:"white",
padding:40,
borderRadius:24,
boxShadow:"0 20px 60px rgba(0,0,0,0.06)"
}}
>

<h3>{item}</h3>

<p style={{opacity:.7}}>
Alle foto's van gasten automatisch verzameld.
</p>

</motion.div>

))}

</div>

</section>



{/* PRICING */}

<section style={{
background:dark,
color:"white",
padding:"140px 20px"
}}>

<div style={{
maxWidth:520,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{fontSize:48}}>
Memories pakket
</h2>

<div style={{
marginTop:40,
padding:60,
borderRadius:30,
background:"#1e293b"
}}>

<h3 style={{fontSize:70}}>
€49
</h3>

<p style={{opacity:.7}}>
eenmalig per event
</p>

<a href={whatsapp}
style={{
display:"inline-block",
marginTop:30,
background:gold,
padding:"18px 40px",
borderRadius:14,
color:"white",
textDecoration:"none",
fontWeight:600
}}
>
Start via WhatsApp
</a>

</div>

</div>

</section>

</main>

)
}