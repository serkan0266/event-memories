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
padding:"80px 20px",
display:"grid",
gap:60
}}>

<div>

<p style={{color:gold,fontWeight:600}}>
SHOWVERHUUR MEMORIES
</p>

<h1 style={{
fontSize:"clamp(34px,6vw,60px)",
lineHeight:1.1,
margin:"20px 0"
}}>
Alle herinneringen
van jullie event
op één plek
</h1>

<p style={{
fontSize:18,
opacity:.8,
marginBottom:30,
maxWidth:500
}}>
Laat gasten foto's en video's uploaden via een QR code.
Perfect voor gender reveals, bruiloften en events.
</p>

<div style={{
display:"flex",
gap:12,
flexWrap:"wrap"
}}>

<a href={whatsapp} style={{
background:gold,
padding:"14px 26px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start Memories
</a>

<Link href="/demo" style={{
border:`2px solid ${gold}`,
padding:"14px 26px",
borderRadius:10,
textDecoration:"none",
color:"#333"
}}>
Bekijk demo
</Link>

</div>

</div>

<img
src="https://images.unsplash.com/photo-1529636798458-92182e662485"
style={{
width:"100%",
borderRadius:20
}}
/>

</section>


{/* QR SECTION */}

<section style={{
maxWidth:1200,
margin:"0 auto",
padding:"80px 20px",
display:"grid",
gap:50
}}>

<img
src="https://images.unsplash.com/photo-1593642634367-d91a135587b5"
style={{width:"100%",borderRadius:20}}
/>

<div>

<h2 style={{
fontSize:"clamp(28px,4vw,40px)",
marginBottom:20
}}>
Scan de QR code
en deel herinneringen
</h2>

<p style={{
fontSize:18,
opacity:.8,
marginBottom:20
}}>
Plaats een QR code op tafels of bij de ingang van jullie event.
Gasten scannen en uploaden direct foto's en video's.
</p>

<ul style={{lineHeight:2}}>
<li>📷 Foto uploads</li>
<li>🎥 Video uploads</li>
<li>🔒 Privé event pagina</li>
<li>⬇️ Download alles</li>
</ul>

</div>

</section>


{/* EVENTS */}

<section style={{
padding:"80px 20px",
maxWidth:1200,
margin:"0 auto"
}}>

<h2 style={{
textAlign:"center",
fontSize:"clamp(28px,4vw,40px)",
marginBottom:50
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
padding:30,
borderRadius:16,
boxShadow:"0 10px 30px rgba(0,0,0,0.05)"
}}>

<h3 style={{marginBottom:10}}>{item}</h3>

<p style={{opacity:.7}}>
Alle foto's en video's van jullie gasten
worden automatisch verzameld.
</p>

</div>

))}

</div>

</section>


{/* HOW IT WORKS */}

<section style={{
background:"white",
padding:"80px 20px"
}}>

<div style={{maxWidth:1100,margin:"0 auto"}}>

<h2 style={{
textAlign:"center",
fontSize:"clamp(28px,4vw,40px)",
marginBottom:60
}}>
Hoe werkt het?
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",
gap:30
}}>

{[
"Wij maken jullie event pagina",
"QR code voor gasten",
"Gasten uploaden foto's",
"Download alles na afloop"
].map((step,i)=>(

<div key={i} style={{textAlign:"center"}}>

<div style={{
fontSize:36,
color:gold,
fontWeight:600,
marginBottom:10
}}>
{i+1}
</div>

<p>{step}</p>

</div>

))}

</div>

</div>

</section>


{/* PRICING */}

<section style={{
background:dark,
color:"white",
padding:"80px 20px"
}}>

<div style={{
maxWidth:500,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{fontSize:38,marginBottom:20}}>
Memories pakket
</h2>

<div style={{
background:"#1F2937",
padding:40,
borderRadius:20
}}>

<h3 style={{fontSize:44}}>
€49
</h3>

<ul style={{lineHeight:2,marginTop:20}}>
<li>Event pagina</li>
<li>QR code</li>
<li>Foto uploads</li>
<li>Video uploads</li>
<li>Download alles</li>
</ul>

<a href={whatsapp} style={{
display:"inline-block",
marginTop:25,
background:gold,
padding:"14px 28px",
borderRadius:10,
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
padding:"80px 20px",
textAlign:"center"
}}>

<h2 style={{
fontSize:"clamp(30px,4vw,44px)",
marginBottom:20
}}>
Maak jullie herinneringen compleet
</h2>

<p style={{opacity:.7,marginBottom:25}}>
Start een Memories pagina voor jullie event.
</p>

<a href={whatsapp} style={{
background:gold,
padding:"14px 28px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
WhatsApp ons
</a>

</section>

</main>

)
}