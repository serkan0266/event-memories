import Link from "next/link";



export default function Home() {

  return (

    <main

      style={{

        fontFamily: "system-ui",

        background: "#F7F3EE",

        minHeight: "100vh",

        color: "#1f2937",

      }}

    >

      {/* HERO */}

      <section

        style={{

          padding: "120px 20px",

          maxWidth: 1200,

          margin: "0 auto",

          display: "grid",

          gridTemplateColumns: "1fr 1fr",

          gap: 60,

          alignItems: "center",

        }}

      >

        <div>

          <p

            style={{

              color: "#C9A46C",

              fontWeight: 600,

              marginBottom: 10,

            }}

          >

            SHOWVERHUUR MEMORIES

          </p>



          <h1

            style={{

              fontSize: 48,

              lineHeight: 1.2,

              marginBottom: 20,

            }}

          >

            Verzamel alle herinneringen

            <br />

            van jouw event.

          </h1>



          <p

            style={{

              fontSize: 18,

              opacity: 0.8,

              marginBottom: 30,

              maxWidth: 500,

            }}

          >

            Laat gasten eenvoudig foto’s en video’s uploaden tijdens jullie

            gender reveal, bruiloft of feest. Alle herinneringen worden

            automatisch verzameld op één plek.

          </p>



          <a

            href="https://showverhuur.nl/contact"

            style={{

              background: "#C9A46C",

              padding: "14px 28px",

              borderRadius: 8,

              color: "white",

              textDecoration: "none",

              fontWeight: 600,

            }}

          >

            Vraag informatie aan

          </a>

        </div>



        <img

          src="https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e"

          style={{

            width: "100%",

            borderRadius: 20,

            objectFit: "cover",

          }}

        />

      </section>



      {/* FEATURES */}

      <section

        style={{

          padding: "80px 20px",

          maxWidth: 1100,

          margin: "0 auto",

        }}

      >

        <h2

          style={{

            textAlign: "center",

            fontSize: 34,

            marginBottom: 60,

          }}

        >

          Hoe werkt Showverhuur Memories?

        </h2>



        <div

          style={{

            display: "grid",

            gridTemplateColumns: "repeat(3,1fr)",

            gap: 30,

          }}

        >

          <div

            style={{

              background: "white",

              padding: 30,

              borderRadius: 14,

            }}

          >

            <h3 style={{ marginBottom: 10 }}>1. Event pagina</h3>

            <p style={{ opacity: 0.8 }}>

              Voor jullie event wordt een speciale pagina aangemaakt waar

              gasten hun foto’s en video’s kunnen uploaden.

            </p>

          </div>



          <div

            style={{

              background: "white",

              padding: 30,

              borderRadius: 14,

            }}

          >

            <h3 style={{ marginBottom: 10 }}>2. Gasten uploaden</h3>

            <p style={{ opacity: 0.8 }}>

              Via een simpele link of QR-code kunnen gasten direct hun

              herinneringen delen tijdens het event.

            </p>

          </div>



          <div

            style={{

              background: "white",

              padding: 30,

              borderRadius: 14,

            }}

          >

            <h3 style={{ marginBottom: 10 }}>3. Alles op één plek</h3>

            <p style={{ opacity: 0.8 }}>

              Na het event kun je alle foto's en video’s eenvoudig downloaden

              en bewaren als blijvende herinnering.

            </p>

          </div>

        </div>

      </section>



      {/* IMAGE SECTION */}

      <section

        style={{

          padding: "100px 20px",

          maxWidth: 1200,

          margin: "0 auto",

          display: "grid",

          gridTemplateColumns: "1fr 1fr",

          gap: 60,

          alignItems: "center",

        }}

      >

        <img

          src="https://images.unsplash.com/photo-1519741497674-611481863552"

          style={{

            width: "100%",

            borderRadius: 20,

          }}

        />



        <div>

          <h2

            style={{

              fontSize: 36,

              marginBottom: 20,

            }}

          >

            Perfect voor elk type event

          </h2>



          <p

            style={{

              fontSize: 18,

              opacity: 0.8,

              marginBottom: 20,

            }}

          >

            Showverhuur Memories wordt vaak gebruikt voor:

          </p>



          <ul style={{ lineHeight: 2 }}>

            <li>Gender Reveals</li>

            <li>Bruiloften</li>

            <li>Baby Showers</li>

            <li>Verjaardagen</li>

            <li>Bedrijfsevenementen</li>

          </ul>

        </div>

      </section>



      {/* CTA */}

      <section

        style={{

          background: "#111827",

          color: "white",

          padding: "80px 20px",

          textAlign: "center",

        }}

      >

        <h2 style={{ fontSize: 36, marginBottom: 20 }}>

          Maak jullie herinneringen compleet

        </h2>



        <p

          style={{

            opacity: 0.8,

            marginBottom: 30,

          }}

        >

          Neem contact op met Showverhuur voor een Memories pagina voor jullie

          event.

        </p>



        <a

          href="https://showverhuur.nl/contact"

          style={{

            background: "#C9A46C",

            padding: "14px 28px",

            borderRadius: 8,

            color: "white",

            textDecoration: "none",

            fontWeight: 600,

          }}

        >

          Contact opnemen

        </a>

      </section>

    </main>

  );

}