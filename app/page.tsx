import Link from "next/link";

export default function Home() {

const gold = "#C9A46C"
const beige = "#F7F3EE"
const dark = "#111827"

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
padding:"140px 20px",
display:"grid",
gridTemplateColumns:"1.1fr 1fr",
gap:80,
alignItems:"center"
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
fontSize:60,
lineHeight:1.05,
margin:"20px 0"
}}>
Alle herinneringen
van jullie event
op één plek
</h1>

<p style={{
fontSize:18,
opacity:.8,
maxWidth:520,
marginBottom:35
}}>
Laat gasten foto's en video's uploaden via een QR code.
Perfect voor gender reveals, bruiloften en events.
</p>

<div style={{display:"flex",gap:15}}>

<Link href="/contact" style={{
background:gold,
padding:"14px 30px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start Memories
</Link>

<Link href="/demo" style={{
border:`2px solid ${gold}`,
padding:"14px 30px",
borderRadius:10,
textDecoration:"none",
color:"#333"
}}>
Bekijk demo
</Link>

</div>

</div>

{/* PHONE MOCKUP */}

<div style={{
position:"relative",
display:"flex",
justifyContent:"center"
}}>

<img
src="https://images.unsplash.com/photo-1556656793-08538906a9f8"
style={{
width:260,
borderRadius:40,
boxShadow:"0 30px 60px rgba(0,0,0,0.25)"
}}
/>

<div style={{
position:"absolute",
top:30,
right:-40,
background:"white",
padding:18,
borderRadius:14,
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}}>
📷 Foto geüpload
</div>

<div style={{
position:"absolute",
bottom:40,
left:-50,
background:"white",
padding:18,
borderRadius:14,
boxShadow:"0 10px 25px rgba(0,0,0,0.1)"
}}>
🎥 Video toegevoegd
</div>

</div>

</section>

{/* QR EXPLAIN */}

<section style={{
maxWidth:1200,
margin:"0 auto",
padding:"120px 20px",
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:80,
alignItems:"center"
}}>

<img
src="https://images.unsplash.com/photo-1593642634367-d91a135587b5"
style={{width:"100%",borderRadius:20}}
/>

<div>

<h2 style={{fontSize:40,marginBottom:20}}>
Scan de QR code
en deel herinneringen
</h2>

<p style={{
fontSize:18,
opacity:.8,
marginBottom:25
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

{/* LIVE MOMENTS */}

<section style={{
padding:"100px 20px"
}}>

<div style={{
maxWidth:1200,
margin:"0 auto"
}}>

<img
src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
style={{
width:"100%",
borderRadius:20
}}
/>

</div>

</section>

{/* USE CASES */}

<section style={{
padding:"120px 20px",
maxWidth:1200,
margin:"0 auto"
}}>

<h2 style={{
textAlign:"center",
fontSize:40,
marginBottom:70
}}>
Perfect voor elk event
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:30
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
borderRadius:18,
boxShadow:"0 10px 30px rgba(0,0,0,0.05)",
textAlign:"center"
}}>

<h3>{item}</h3>

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
padding:"120px 20px"
}}>

<div style={{maxWidth:1100,margin:"0 auto"}}>

<h2 style={{
textAlign:"center",
fontSize:40,
marginBottom:80
}}>
Hoe werkt het?
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:40
}}>

{[
"Wij maken jullie event pagina",
"QR code voor gasten",
"Gasten uploaden foto's",
"Download alles na afloop"
].map((step,i)=>(

<div key={i} style={{textAlign:"center"}}>

<div style={{
fontSize:42,
color:gold,
fontWeight:600,
marginBottom:15
}}>
{i+1}
</div>

<p>{step}</p>

</div>

))}

</div>

</div>

</section>

{/* FEATURES */}

<section style={{
padding:"120px 20px",
maxWidth:1100,
margin:"0 auto"
}}>

<h2 style={{
textAlign:"center",
fontSize:40,
marginBottom:60
}}>
Waarom Showverhuur Memories
</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:30
}}>

{[
"Foto & video uploads",
"QR code toegang",
"Privé event pagina",
"Alles downloaden",
"Onbeperkte uploads",
"Eenvoudig te gebruiken"
].map((item,i)=>(

<div key={i} style={{
background:"white",
padding:35,
borderRadius:18,
boxShadow:"0 10px 30px rgba(0,0,0,0.05)"
}}>
{item}
</div>

))}

</div>

</section>

{/* PRICING */}

<section style={{
background:dark,
color:"white",
padding:"120px 20px"
}}>

<div style={{
maxWidth:500,
margin:"0 auto",
textAlign:"center"
}}>

<h2 style={{fontSize:42,marginBottom:20}}>
Memories pakket
</h2>

<div style={{
background:"#1F2937",
padding:45,
borderRadius:22
}}>

<h3 style={{fontSize:46}}>
€49
</h3>

<ul style={{lineHeight:2,marginTop:20,opacity:.85}}>
<li>Event pagina</li>
<li>QR code</li>
<li>Foto uploads</li>
<li>Video uploads</li>
<li>Download alles</li>
</ul>

<Link href="/contact" style={{
display:"inline-block",
marginTop:30,
background:gold,
padding:"14px 30px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Start Memories
</Link>

</div>

</div>

</section>

{/* FAQ */}

<section style={{
padding:"120px 20px",
maxWidth:800,
margin:"0 auto"
}}>

<h2 style={{
textAlign:"center",
fontSize:38,
marginBottom:50
}}>
Veelgestelde vragen
</h2>

<div style={{lineHeight:2}}>

<p><strong>Hoe uploaden gasten foto's?</strong><br/>
Via de QR code die naar jullie event pagina gaat.</p>

<br/>

<p><strong>Kunnen we alles downloaden?</strong><br/>
Ja, alle foto's en video's zijn te downloaden.</p>

<br/>

<p><strong>Is de pagina privé?</strong><br/>
Ja, alleen mensen met de link of QR code hebben toegang.</p>

</div>

</section>

{/* CTA */}

<section style={{
padding:"120px 20px",
textAlign:"center"
}}>

<h2 style={{fontSize:44,marginBottom:20}}>
Maak jullie herinneringen compleet
</h2>

<p style={{opacity:.7,marginBottom:30}}>
Start een Memories pagina voor jullie event.
</p>

<Link href="/contact" style={{
background:gold,
padding:"14px 30px",
borderRadius:10,
color:"white",
textDecoration:"none",
fontWeight:600
}}>
Contact opnemen
</Link>

</section>

</main>

)
}