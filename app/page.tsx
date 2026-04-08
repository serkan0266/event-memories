"use client"

import Link from "next/link"

export default function Home(){

const gold="#C9A46C"
const light="#F7F3EE"
const dark="#111827"

const whatsapp="https://wa.me/31612394000"

return(

<main style={{fontFamily:"system-ui",background:light}}>


{/* HERO */}

<section style={{
padding:"120px 20px",
background:"linear-gradient(180deg,#F7F3EE,#ffffff)"
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
fontWeight:600,
textDecoration:"none"
}}>
Start je event
</a>

<Link href="/demo"
style={{
border:`2px solid ${gold}`,
padding:"14px 28px",
borderRadius:10
}}>
Ontdek hoe het werkt
</Link>

</div>

</div>


{/* HERO IMAGE */}

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



{/* EVENT TYPES */}

<section style={{
padding:"60px 20px",
textAlign:"center"
}}>

<h2 style={{fontSize:36}}>
Maak jouw evenement
<span style={{color:gold}}> onvergetelijk</span>
</h2>

<div style={{
marginTop:30,
display:"flex",
flexWrap:"wrap",
gap:12,
justifyContent:"center"
}}>

{[
"Bruiloft",
"Gender Reveal",
"Baby Shower",
"Verjaardag",
"Bedrijfsfeest"
].map((item,i)=>(

<div key={i}
style={{
border:`2px solid ${gold}`,
padding:"8px 18px",
borderRadius:20
}}
>
{item}
</div>

))}

</div>

</section>



{/* FEATURE BLOCK */}

<section style={{
padding:"120px 20px"
}}>

<div style={{
maxWidth:1100,
margin:"0 auto",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:60,
alignItems:"center"
}}>

<div>

<h2 style={{fontSize:34}}>
Op jouw jubileum is iedereen
de fotograaf
</h2>

<ul style={{marginTop:20,lineHeight:2}}>

<li>Unieke QR-code</li>
<li>Deelbare link naar je event</li>
<li>Geen app nodig, werkt op alle apparaten</li>
<li>Galerij met foto's en video's</li>
<li>Persoonlijke vormgeving</li>

</ul>

</div>

<img
src="https://images.unsplash.com/photo-1504198453319-5ce911bafcde"
style={{width:"100%",borderRadius:20}}
/>

</div>

</section>



{/* PHONE SECTION */}

<section style={{
padding:"120px 20px",
background:"#ffffff"
}}>

<div style={{
maxWidth:1100,
margin:"0 auto",
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",
gap:60,
alignItems:"center"
}}>

<img
src="https://images.unsplash.com/photo-1512428559087-560fa5ceab42"
style={{
width:"100%",
borderRadius:30
}}
/>

<div>

<h2 style={{fontSize:36}}>
Simpel, veilig en
<span style={{color:gold}}> voor iedereen</span>
</h2>

<p style={{marginTop:20,opacity:.7}}>

Gasten kunnen direct foto's en video's uploaden
zonder een account te maken.

</p>

<ul style={{marginTop:20,lineHeight:2}}>

<li>Ongelimiteerd aantal gebruikers</li>
<li>Persoonlijke berichten van gasten</li>
<li>Alles geleverd in één download</li>

</ul>

</div>

</div>

</section>



{/* SUPPORT */}

<section style={{
padding:"80px 20px"
}}>

<div style={{
maxWidth:900,
margin:"0 auto",
background:dark,
color:"white",
padding:40,
borderRadius:20,
display:"flex",
justifyContent:"space-between",
flexWrap:"wrap",
gap:20,
alignItems:"center"
}}>

<div>

<h3>Een écht goede klantenservice</h3>

<p style={{opacity:.7}}>
Wij helpen je altijd als je vragen hebt.
</p>

</div>

<a href={whatsapp}
style={{
background:gold,
padding:"12px 22px",
borderRadius:10,
color:"white",
textDecoration:"none"
}}>
WhatsApp ons
</a>

</div>

</section>



{/* PRICING */}

<section style={{
padding:"120px 20px",
textAlign:"center"
}}>

<h2 style={{fontSize:36}}>
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

<h3 style={{fontSize:50}}>€49</h3>

<ul style={{lineHeight:2,marginTop:20,textAlign:"left"}}>

<li>Unieke QR-code</li>
<li>Deelbare link naar je event</li>
<li>Geen app nodig</li>
<li>Galerij met foto's en video's</li>
<li>Persoonlijke vormgeving</li>
<li>Ongelimiteerd aantal gebruikers</li>
<li>Persoonlijke berichten van gasten</li>
<li>Alles geleverd in een bestand</li>
<li>Eigen header design</li>

</ul>

<a href={whatsapp}
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
background:"#1f2937",
color:"white",
padding:"60px 20px"
}}>

<div style={{
maxWidth:1100,
margin:"0 auto",
display:"flex",
justifyContent:"space-between",
flexWrap:"wrap",
gap:30
}}>

<div>

<h3>Showverhuur Memories</h3>

<p style={{opacity:.7}}>
Alle herinneringen van je event op één plek.
</p>

</div>

<div>

<p>Contact</p>
<p>info@showverhuur.nl</p>

</div>

</div>

</footer>

</main>

)
}