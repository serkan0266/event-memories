"use client"

import { useEffect } from "react"

export default function Home(){

const gold="#C9A46C"
const green="#22c55e"
const light="#F7F3EE"
const dark="#111827"

const whatsapp="https://wa.me/31612394000"

useEffect(()=>{

document.querySelectorAll("a[href^='#']").forEach(anchor=>{
anchor.addEventListener("click",function(e){
e.preventDefault()
const target=document.querySelector(this.getAttribute("href")!)
target?.scrollIntoView({behavior:"smooth"})
})
})

},[])

return(

<main style={{fontFamily:"system-ui",background:light}}>

{/* HEADER */}

<header style={{
position:"sticky",
top:0,
background:"white",
padding:"18px 30px",
zIndex:100,
borderBottom:"1px solid #eee"
}}>

<div style={{
maxWidth:1200,
margin:"0 auto",
display:"flex",
alignItems:"center",
justifyContent:"space-between"
}}>

{/* LOGO */}

<img
src="/memories-logo.png"
style={{height:32}}
/>

{/* NAV */}

<div style={{display:"flex",gap:25,alignItems:"center"}}>

<a href="#hoe"
style={{textDecoration:"none",color:"#333"}}>
Hoe werkt het
</a>

<a href="#demo"
style={{textDecoration:"none",color:"#333"}}>
Gratis demo
</a>

<a
href={whatsapp}
style={{
background:gold,
padding:"10px 18px",
borderRadius:8,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start event
</a>

</div>

</div>

</header>



{/* HERO */}

<section style={{
padding:"120px 20px"
}}>

<div style={{
maxWidth:1200,
margin:"0 auto",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:80,
alignItems:"center"
}}>

<div>

<h1 style={{
fontSize:"clamp(40px,6vw,60px)",
lineHeight:1.1
}}>
Verzamel foto's en video's
<span style={{color:gold}}> op één plek </span>
via een QR-code
</h1>

<p style={{
marginTop:20,
fontSize:18,
opacity:.7,
maxWidth:500
}}>
Laat gasten foto's en video's uploaden tijdens jullie event.
Geen app nodig. Werkt direct via de QR-code.
</p>

<div style={{marginTop:30,display:"flex",gap:15}}>

<a href={whatsapp}
style={{
background:gold,
padding:"14px 28px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start je event
</a>

<a href="#demo"
style={{
border:`2px solid ${gold}`,
padding:"14px 28px",
borderRadius:10
}}>
Bekijk demo
</a>

</div>

</div>


<img
src="https://images.unsplash.com/photo-1519741497674-611481863552"
style={{
width:"100%",
borderRadius:20,
boxShadow:"0 30px 80px rgba(0,0,0,0.15)"
}}
/>

</div>

</section>



{/* HOE WERKT HET */}

<section id="hoe" style={{padding:"120px 20px"}}>

<div style={{
maxWidth:1100,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{fontSize:38}}>
Hoe werkt het
</h2>

<div style={{
marginTop:60,
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:30
}}>

{[
"Wij maken jullie eventpagina",
"Plaats QR-code op het event",
"Gasten uploaden foto's",
"Download alles na afloop"
].map((step,i)=>(

<div key={i}
style={{
background:"white",
padding:35,
borderRadius:20,
boxShadow:"0 20px 60px rgba(0,0,0,0.06)"
}}
>

<h3>{i+1}</h3>

<p style={{marginTop:10,opacity:.7}}>
{step}
</p>

</div>

))}

</div>

</div>

</section>



{/* DEMO */}

<section id="demo" style={{
padding:"120px 20px",
background:"#ffffff"
}}>

<div style={{
maxWidth:1000,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{fontSize:38}}>
Bekijk een voorbeeld pagina
</h2>

<p style={{marginTop:15,opacity:.7}}>
Zo ziet een Memories eventpagina eruit.
</p>

<a
href="/demo"
style={{
marginTop:30,
display:"inline-block",
background:gold,
padding:"14px 28px",
borderRadius:10,
color:"white",
textDecoration:"none"
}}>
Open demo
</a>

</div>

</section>



{/* PAKKET */}

<section style={{
padding:"120px 20px",
textAlign:"center"
}}>

<h2 style={{fontSize:38}}>
Memories pakket
</h2>

<div style={{
marginTop:50,
maxWidth:500,
marginInline:"auto",
background:"white",
padding:40,
borderRadius:20,
boxShadow:"0 30px 80px rgba(0,0,0,0.1)"
}}>

<h3 style={{fontSize:48}}>€49</h3>

<ul style={{
lineHeight:2,
marginTop:20,
textAlign:"left",
listStyle:"none",
padding:0
}}>

{[
"Unieke QR-code",
"Deelbare link naar je event",
"Geen app nodig, werkt op alle apparaten",
"Galerij met foto's en video's",
"Persoonlijke vormgeving",
"Ongelimiteerd aantal gebruikers",
"Persoonlijke berichten van gasten",
"Alles geleverd in een bestand",
"Eigen header design voor pagina"
].map((item,i)=>(

<li key={i} style={{display:"flex",gap:10}}>

<span style={{color:green,fontWeight:700}}>✔</span>

{item}

</li>

))}

</ul>

<a
href={whatsapp}
style={{
marginTop:30,
display:"inline-block",
background:gold,
padding:"14px 28px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start je event
</a>

</div>

</section>



{/* FOOTER */}

<footer style={{
background:dark,
color:"white",
padding:"60px 20px",
textAlign:"center"
}}>

<p>© Showverhuur Memories</p>

</footer>

</main>

)
}