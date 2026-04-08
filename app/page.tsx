import Link from "next/link";

export default function Home() {

const gold = "#C9A46C"
const beige = "#F7F3EE"
const dark = "#111827"

const whatsapp =
"https://wa.me/31612394000?text=Wij%20willen%20graag%20een%20Memories%20pagina%20voor%20datum..."

return (

<main style={{
fontFamily:"system-ui",
background:beige,
color:"#1f2937"
}}>

{/* HERO */}

<section style={{
maxWidth:1200,
margin:"0 auto",
padding:"120px 20px",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",
alignItems:"center",
gap:70
}}>

<div>

<p style={{
color:gold,
fontWeight:600,
letterSpacing:1
}}>
SHOWVERHUUR MEMORIES
</p>

<h1 style={{
fontSize:"clamp(44px,6vw,70px)",
lineHeight:1.05,
margin:"20px 0"
}}>
Alle herinneringen
van jullie event
op één plek
</h1>

<p style={{
fontSize:20,
opacity:.75,
marginBottom:40,
maxWidth:500
}}>
Laat gasten foto's en video's uploaden via een QR code.
Alle momenten automatisch verzameld op één pagina.
</p>

<div style={{display:"flex",gap:15,flexWrap:"wrap"}}>

<a href={whatsapp} style={{
background:gold,
padding:"16px 32px",
borderRadius:12,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start Memories
</a>

<Link href="/demo" style={{
border:`2px solid ${gold}`,
padding:"16px 32px",
borderRadius:12,
textDecoration:"none",
color:"#333"
}}>
Bekijk demo
</Link>

</div>

</div>


{/* FLOATING GALLERY */}

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:15
}}>

<img src="https://images.unsplash.com/photo-1529636798458-92182e662485"
style={{width:"100%",borderRadius:16}}/>

<img src="https://images.unsplash.com/photo-1521334884684-d80222895322"
style={{width:"100%",borderRadius:16}}/>

<img src="https://images.unsplash.com/photo-1519741497674-611481863552"
style={{width:"100%",borderRadius:16}}/>

<img src="https://images.unsplash.com/photo-1504198453319-5ce911bafcde"
style={{width:"100%",borderRadius:16}}/>

</div>

</section>



{/* LIVE GALLERY */}

<section style={{
padding:"90px 20px"
}}>

<div style={{
maxWidth:1200,
margin:"0 auto"
}}>

<h2 style={{
fontSize:"clamp(30px,4vw,42px)",
textAlign:"center",
marginBottom:50
}}>
Alle foto's van jullie gasten
automatisch verzameld
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",
gap:15
}}>

{[
"https://images.unsplash.com/photo-1519741497674-611481863552",
"https://images.unsplash.com/photo-1529636798458-92182e662485",
"https://images.unsplash.com/photo-1504198453319-5ce911bafcde",
"https://images.unsplash.com/photo-1521334884684-d80222895322",
"https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
"https://images.unsplash.com/photo-1520857014576-2c4f4c972b57"
].map((img,i)=>(

<img key={i}
src={img}
style={{
width:"100%",
borderRadius:16,
objectFit:"cover"
}}
/>

))}

</div>

</div>

</section>



{/* HOW IT WORKS */}

<section style={{
background:"white",
padding:"100px 20px"
}}>

<div style={{maxWidth:1100,margin:"0 auto"}}>

<h2 style={{
textAlign:"center",
fontSize:"clamp(30px,4vw,42px)",
marginBottom:70
}}>
Hoe werkt het?
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",
gap:40
}}>

{[
{
title:"Wij maken jullie pagina",
text:"Elke klant krijgt een unieke event pagina."
},
{
title:"QR code voor gasten",
text:"Plaats de QR code op tafels of bij de ingang."
},
{
title:"Gasten uploaden foto's",
text:"Foto's en video's worden direct opgeslagen."
},
{
title:"Download alles",
text:"Na afloop download je alle herinneringen."
}
].map((step,i)=>(

<div key={i} style={{
background:"rgba(255,255,255,0.6)",
backdropFilter:"blur(10px)",
padding:30,
borderRadius:20,
boxShadow:"0 10px 40px rgba(0,0,0,0.05)"
}}>

<div style={{
fontSize:36,
color:gold,
fontWeight:700,
marginBottom:10
}}>
{i+1}
</div>

<h3 style={{marginBottom:10}}>
{step.title}
</h3>

<p style={{opacity:.7}}>
{step.text}
</p>

</div>

))}

</div>

</div>

</section>



{/* EVENTS */}

<section style={{
padding:"100px 20px",
maxWidth:1200,
margin:"0 auto"
}}>

<h2 style={{
textAlign:"center",
fontSize:"clamp(30px,4vw,42px)",
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

<div key={i} style={{
background:"white",
padding:35,
borderRadius:20,
boxShadow:"0 10px 40px rgba(0,0,0,0.05)"
}}>

<h3 style={{marginBottom:10}}>
{item}
</h3>

<p style={{opacity:.7}}>
Alle foto's en video's van gasten
automatisch verzameld.
</p>

</div>

))}

</div>

</section>



{/* PRICING */}

<section style={{
background:dark,
color:"white",
padding:"100px 20px"
}}>

<div style={{
maxWidth:520,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{
fontSize:42,
marginBottom:30
}}>
Memories pakket
</h2>

<div style={{
background:"#1F2937",
padding:50,
borderRadius:24
}}>

<h3 style={{
fontSize:56,
marginBottom:10
}}>
€49
</h3>

<p style={{opacity:.7}}>
eenmalig per event
</p>

<ul style={{
lineHeight:2,
marginTop:25
}}>
<li>Event pagina</li>
<li>QR code</li>
<li>Foto uploads</li>
<li>Video uploads</li>
<li>Download alles</li>
</ul>

<a href={whatsapp} style={{
display:"inline-block",
marginTop:30,
background:gold,
padding:"16px 34px",
borderRadius:12,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start via WhatsApp
</a>

</div>

</div>

</section>



{/* CTA */}

<section style={{
padding:"100px 20px",
textAlign:"center"
}}>

<h2 style={{
fontSize:"clamp(34px,4vw,46px)",
marginBottom:20
}}>
Maak jullie herinneringen compleet
</h2>

<p style={{
opacity:.7,
marginBottom:30
}}>
Start een Memories pagina voor jullie event.
</p>

<a href={whatsapp} style={{
background:gold,
padding:"16px 36px",
borderRadius:12,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start via WhatsApp
</a>

</section>

</main>

)
}