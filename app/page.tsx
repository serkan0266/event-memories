"use client"

import {
QrCode,
Upload,
Images,
Download,
Link as LinkIcon,
MessageCircle
} from "lucide-react"

export default function Home(){

const gold="#C9A46C"
const green="#22c55e"
const light="#F7F3EE"
const dark="#111827"

const whatsapp="https://wa.me/31612394000"

const features=[
"Unieke QR-code",
"Deelbare link naar je event",
"Geen app nodig, werkt op alle apparaten",
"Galerij met foto's en video's",
"Persoonlijke vormgeving",
"Ongelimiteerd aantal gebruikers",
"Persoonlijke berichten van gasten",
"Alles geleverd in een bestand",
"Eigen header design"
]

const steps=[
{
icon:<LinkIcon size={32}/>,
title:"Persoonlijke eventpagina",
text:"Voor jullie evenement maken wij een unieke Memories pagina met een eigen QR-code en link waar gasten foto's, video's en berichten kunnen uploaden."
},
{
icon:<QrCode size={32}/>,
title:"QR-code op het event",
text:"Plaats de QR-code op tafels of bij de ingang zodat gasten hem eenvoudig kunnen scannen."
},
{
icon:<Upload size={32}/>,
title:"Gasten uploaden herinneringen",
text:"Tijdens het evenement kunnen gasten foto's en video's uploaden en een boodschap voor jullie achterlaten."
},
{
icon:<Images size={32}/>,
title:"Alles op één galerij",
text:"Alle foto's en video's worden automatisch verzameld op jullie Memories pagina."
},
{
icon:<Download size={32}/>,
title:"Alles geleverd na afloop",
text:"Na het evenement ontvangen jullie alle foto's, video's en berichten overzichtelijk in één bestand."
}
]

return(

<>
<style>{`

html{scroll-behavior:smooth}

.container{
max-width:1200px;
margin:auto;
padding:0 20px
}

header{
position:sticky;
top:0;
background:white;
border-bottom:1px solid #eee;
z-index:50
}

.nav{
max-width:1400px;
margin:auto;
display:flex;
align-items:center;
justify-content:space-between;
height:80px;
padding:0 30px
}

.nav img{
height:48px
}

.navlinks{
display:flex;
gap:30px;
align-items:center
}

.startbtn{
background:${gold};
padding:10px 18px;
border-radius:8px;
color:white;
text-decoration:none;
font-weight:600
}

.hero{
background:
radial-gradient(circle at 80% 0%,rgba(201,164,108,.2),transparent),
linear-gradient(#F7F3EE,#fff);
padding:120px 0
}

.heroGrid{
display:grid;
grid-template-columns:1fr 1fr;
gap:60px;
align-items:center
}

.heroImg{
width:100%;
border-radius:20px;
box-shadow:0 30px 80px rgba(0,0,0,.15)
}

.cta{
display:flex;
gap:15px;
margin-top:25px;
flex-wrap:wrap
}

.btnPrimary{
background:${gold};
padding:14px 28px;
border-radius:10px;
color:white;
text-decoration:none;
font-weight:600
}

.btnOutline{
border:2px solid ${gold};
padding:14px 28px;
border-radius:10px;
text-decoration:none
}

.section{
padding:110px 0
}

.steps{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
gap:30px;
position:relative
}

.step{
background:white;
padding:30px;
border-radius:20px;
box-shadow:0 20px 60px rgba(0,0,0,.06);
text-align:left
}

.stepIcon{
color:${gold};
margin-bottom:10px
}

.iphone{
width:280px;
height:560px;
background:black;
border-radius:40px;
padding:12px;
margin:auto;
box-shadow:0 30px 80px rgba(0,0,0,.3)
}

.iphoneScreen{
width:100%;
height:100%;
border-radius:28px;
overflow:hidden
}

.iphoneScreen img{
width:100%;
height:100%;
object-fit:cover
}

.qrBox{
width:220px;
height:220px;
background:#eee;
margin:40px auto;
position:relative;
display:flex;
align-items:center;
justify-content:center;
border-radius:20px
}

.scan{
position:absolute;
width:100%;
height:4px;
background:${gold};
box-shadow:0 0 20px ${gold};
animation:scan 3s linear infinite
}

@keyframes scan{
0%{top:10px}
50%{top:200px}
100%{top:10px}
}

.pricing{
max-width:500px;
margin:auto;
background:white;
padding:40px;
border-radius:20px;
box-shadow:0 30px 80px rgba(0,0,0,.1)
}

.features{
list-style:none;
padding:0;
line-height:2
}

.check{
color:${green};
font-weight:800
}

footer{
background:${dark};
color:white;
padding:60px;
text-align:center
}

@media(max-width:900px){

.heroGrid{
grid-template-columns:1fr
}

}

`}</style>

<main style={{fontFamily:"system-ui",background:light}}>

<header>
<div className="nav">

<img src="/memories-logo.png"/>

<div className="navlinks">

<a href="#hoe">Hoe werkt het</a>
<a href="#demo">Gratis demo</a>

<a className="startbtn" href={whatsapp}>
Start event
</a>

</div>

</div>
</header>


<section className="hero">

<div className="container heroGrid">

<div>

<h1 style={{fontSize:"clamp(40px,6vw,64px)",lineHeight:1.1}}>
Verzamel foto's en video's
<span style={{color:gold}}> op één plek </span>
via een QR-code
</h1>

<p style={{marginTop:20,opacity:.7,fontSize:18}}>
Laat gasten foto's en video's uploaden tijdens jullie event.
Geen app nodig. Werkt direct via de QR-code.
</p>

<div className="cta">

<a href={whatsapp} className="btnPrimary">
Start je event
</a>

<a href="#demo" className="btnOutline">
Bekijk demo
</a>

</div>

</div>

<img
className="heroImg"
src="https://images.unsplash.com/photo-1519741497674-611481863552"
/>

</div>

</section>


<section id="hoe" className="section">

<div className="container">

<h2 style={{textAlign:"center",fontSize:38,marginBottom:60}}>
Hoe werkt Memories?
</h2>

<div className="steps">

{steps.map((s,i)=>(
<div key={i} className="step">

<div className="stepIcon">
{s.icon}
</div>

<h3>{s.title}</h3>

<p style={{opacity:.7,marginTop:10}}>
{s.text}
</p>

</div>
))}

</div>

</div>

</section>


<section id="demo" className="section" style={{background:"#fff"}}>

<div className="container heroGrid">

<div className="iphone">

<div className="iphoneScreen">

<img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"/>

</div>

</div>

<div>

<h2 style={{fontSize:36}}>
Simpel, veilig en
<span style={{color:gold}}> voor iedereen</span>
</h2>

<div className="qrBox">

<img
src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=memories"
/>

<div className="scan"></div>

</div>

<p style={{opacity:.7}}>
Gasten scannen de QR-code en uploaden direct foto's en video's.
</p>

</div>

</div>

</section>


<section className="section">

<div className="container" style={{textAlign:"center"}}>

<h2 style={{fontSize:36}}>
Memories pakket
</h2>

<div className="pricing">

<h3 style={{fontSize:48}}>€49</h3>

<ul className="features">

{features.map((f,i)=>(
<li key={i}>
<span className="check">✔</span> {f}
</li>
))}

</ul>

<a
href={whatsapp}
className="btnPrimary"
style={{display:"inline-block",marginTop:25}}
>
Start je event
</a>

</div>

</div>

</section>


<footer>

<p>© Showverhuur Memories</p>

</footer>

</main>

</>
)
}