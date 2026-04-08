"use client"

export default function Home() {
  const gold = "#C9A46C"
  const light = "#F7F3EE"
  const dark = "#111827"
  const green = "#22c55e"

  const whatsapp =
    "https://wa.me/31612394000?text=Wij%20willen%20graag%20een%20Memories%20pagina%20voor%20datum..."

  const features = [
    "Unieke QR-code",
    "Deelbare link naar je event",
    "Geen app nodig, werkt op alle apparaten",
    "Galerij met foto's en video's",
    "Persoonlijke vormgeving",
    "Ongelimiteerd aantal gebruikers",
    "Persoonlijke berichten van gasten",
    "Alles geleverd in een bestand",
    "Eigen header (afbeelding) design voor de pagina",
  ]

  return (
    <>
      {/* Page styles (responsive + animations) */}
      <style>{`
        html{scroll-behavior:smooth}
        .container{max-width:1200px;margin:0 auto;padding:0 20px}
        .hero{
          background:
            radial-gradient(900px 400px at 85% 10%, rgba(201,164,108,0.18), transparent 60%),
            radial-gradient(700px 300px at 10% 0%, rgba(201,164,108,0.12), transparent 60%),
            linear-gradient(180deg, #F7F3EE 0%, #ffffff 100%);
        }
        .grid-hero{
          display:grid;gap:60px;align-items:center;
          grid-template-columns: 1.1fr 0.9fr;
        }
        .cta{display:flex;gap:14px;flex-wrap:wrap;margin-top:28px}
        .btn-primary{
          background:${gold};color:white;text-decoration:none;
          padding:14px 26px;border-radius:10px;font-weight:600;display:inline-block
        }
        .btn-outline{
          border:2px solid ${gold};color:#333;text-decoration:none;
          padding:14px 26px;border-radius:10px;font-weight:600;display:inline-block
        }
        .hero-img{
          width:100%;border-radius:22px;
          box-shadow:0 30px 80px rgba(0,0,0,0.15)
        }
        .iphone{
          width:300px;height:600px;background:#000;border-radius:42px;
          padding:14px;box-shadow:0 25px 70px rgba(0,0,0,0.25);margin:auto
        }
        .iphone-screen{
          width:100%;height:100%;border-radius:30px;overflow:hidden;background:#111
        }
        .iphone-screen img{width:100%;height:100%;object-fit:cover}
        .qr-box{
          position:relative;width:240px;height:240px;background:#eee;
          margin:40px auto;border-radius:20px;display:flex;align-items:center;justify-content:center
        }
        .scan-line{
          position:absolute;left:0;width:100%;height:4px;background:${gold};
          box-shadow:0 0 18px ${gold};animation:scan 3s linear infinite
        }
        @keyframes scan{
          0%{top:10px}
          50%{top:200px}
          100%{top:10px}
        }
        .features{
          list-style:none;padding:0;margin:20px 0 0 0;line-height:2
        }
        .features li{display:flex;gap:10px;align-items:flex-start}
        .check{color:${green};font-weight:800}
        header{
          position:sticky;top:0;background:#fff;border-bottom:1px solid #eee;z-index:50
        }
        .nav{
          display:flex;align-items:center;justify-content:space-between;height:70px
        }
        .nav-links{display:flex;gap:26px;align-items:center}
        .nav-links a{text-decoration:none;color:#333;font-weight:500}
        .nav-links .start{
          background:${gold};color:#fff;padding:10px 18px;border-radius:8px;font-weight:600
        }
        section{padding:110px 0}
        .center{text-align:center}
        .pricing{
          max-width:520px;margin:40px auto 0 auto;background:#fff;padding:40px;border-radius:20px;
          box-shadow:0 30px 80px rgba(0,0,0,0.1)
        }
        .pricing h3{font-size:48px;margin:0}
        footer{background:${dark};color:white;padding:60px 20px;text-align:center}
        @media (max-width:900px){
          .grid-hero{grid-template-columns:1fr;gap:40px}
          .iphone{width:260px;height:520px}
        }
      `}</style>

      <main style={{ fontFamily: "system-ui", background: light }}>
        {/* HEADER */}
        <header>
          <div className="container nav">
            <img src="/memories-logo.png" style={{ height: 34 }} />
            <div className="nav-links">
              <a href="#hoe">Hoe werkt het</a>
              <a href="#demo">Gratis demo</a>
              <a className="start" href={whatsapp}>
                Start event
              </a>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="container grid-hero">
            <div>
              <h1 style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 1.1 }}>
                Verzamel foto's en video's
                <span style={{ color: gold }}> op één plek </span>
                via een QR-code
              </h1>

              <p style={{ marginTop: 18, fontSize: 18, opacity: 0.75 }}>
                Laat gasten foto's en video's uploaden tijdens jullie event.
                Geen app nodig. Werkt direct via de QR-code.
              </p>

              <div className="cta">
                <a href={whatsapp} className="btn-primary">
                  Start je event
                </a>

                <a href="#demo" className="btn-outline">
                  Bekijk demo
                </a>
              </div>
            </div>

            <img
              className="hero-img"
              src="https://images.unsplash.com/photo-1519741497674-611481863552"
            />
          </div>
        </section>

        {/* HOE WERKT HET */}
        <section id="hoe">
          <div className="container center">
            <h2 style={{ fontSize: 38 }}>Hoe werkt het</h2>

            {/* QR scan */}
            <div className="qr-box">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=memories"
                style={{ width: 180 }}
              />
              <div className="scan-line"></div>
            </div>

            <p style={{ opacity: 0.7 }}>
              Gasten scannen de QR-code en uploaden direct foto's en video's.
            </p>
          </div>
        </section>

        {/* DEMO + IPHONE */}
        <section id="demo" style={{ background: "#fff" }}>
          <div
            className="container"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div className="iphone">
              <div className="iphone-screen">
                <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30" />
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: 36 }}>
                Simpel, veilig en{" "}
                <span style={{ color: gold }}>voor iedereen</span>
              </h2>

              <p style={{ marginTop: 20, opacity: 0.7 }}>
                Gasten kunnen direct foto's en video's uploaden zonder een
                account te maken.
              </p>

              <ul className="features">
                <li>
                  <span className="check">✔</span> Ongelimiteerd aantal gebruikers
                </li>
                <li>
                  <span className="check">✔</span> Persoonlijke berichten van
                  gasten
                </li>
                <li>
                  <span className="check">✔</span> Download alle foto's na het
                  event
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* PAKKET */}
        <section className="center">
          <div className="container">
            <h2 style={{ fontSize: 38 }}>Memories pakket</h2>

            <div className="pricing">
              <h3>€49</h3>

              <ul className="features">
                {features.map((f, i) => (
                  <li key={i}>
                    <span className="check">✔</span> {f}
                  </li>
                ))}
              </ul>

              <a
                href={whatsapp}
                style={{
                  marginTop: 30,
                  display: "inline-block",
                  background: gold,
                  padding: "14px 28px",
                  borderRadius: 10,
                  color: "white",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                Start je event
              </a>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <p>© Showverhuur Memories</p>
        </footer>
      </main>
    </>
  )
}