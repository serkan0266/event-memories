import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui",
        background: "#F7F3EE",
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
          gap: 80,
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
              fontSize: 52,
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Verzamel alle
            <br />
            herinneringen
            <br />
            van jullie event
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

          <Link
            href="/contact"
            style={{
              background: "#C9A46C",
              padding: "14px 28px",
              borderRadius: 10,
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Vraag informatie aan
          </Link>
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

      {/* HOW IT WORKS */}
      <section
        style={{
          padding: "100px 20px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 38,
            marginBottom: 60,
          }}
        >
          Hoe werkt het?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 30,
          }}
        >
          {[
            {
              title: "Event pagina",
              text: "Voor jullie event maken we een speciale pagina waar gasten hun foto's kunnen uploaden.",
            },
            {
              title: "QR Code",
              text: "Plaats de QR code op tafels zodat gasten direct hun foto's kunnen delen.",
            },
            {
              title: "Uploaden",
              text: "Gasten uploaden eenvoudig foto's en video's via hun telefoon.",
            },
            {
              title: "Herinneringen",
              text: "Na het event kunnen jullie alles downloaden en bewaren.",
            },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 30,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  color: "#C9A46C",
                  marginBottom: 10,
                }}
              >
                {i + 1}
              </div>

              <h3 style={{ marginBottom: 10 }}>{item.title}</h3>

              <p style={{ opacity: 0.7 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMAGE + TEXT */}
      <section
        style={{
          padding: "120px 20px",
          background: "white",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 80,
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
                fontSize: 38,
                marginBottom: 20,
              }}
            >
              Alle herinneringen
              <br />
              op één plek
            </h2>

            <p
              style={{
                fontSize: 18,
                opacity: 0.8,
                marginBottom: 20,
              }}
            >
              Tijdens een event maken gasten vaak honderden foto's en video's.
              Met Showverhuur Memories verzamel je alles automatisch op één
              centrale plek.
            </p>

            <ul style={{ lineHeight: 2 }}>
              <li>📷 Foto uploads</li>
              <li>🎥 Video uploads</li>
              <li>📥 Alles downloaden</li>
              <li>🔒 Privé event pagina</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          padding: "100px 20px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontSize: 36,
            marginBottom: 60,
          }}
        >
          Perfect voor elk type event
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 30,
          }}
        >
          {[
            "Gender Reveals",
            "Bruiloften",
            "Baby Showers",
            "Verjaardagen",
            "Bedrijfsevenementen",
            "Feesten",
          ].map((event, i) => (
            <div
              key={i}
              style={{
                background: "white",
                padding: 30,
                borderRadius: 16,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {event}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          background: "#111827",
          color: "white",
          padding: "100px 20px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 40, marginBottom: 20 }}>
          Maak jullie herinneringen compleet
        </h2>

        <p
          style={{
            opacity: 0.8,
            marginBottom: 30,
          }}
        >
          Vraag een Memories pagina aan voor jullie event.
        </p>

        <Link
          href="/contact"
          style={{
            background: "#C9A46C",
            padding: "14px 28px",
            borderRadius: 10,
            color: "white",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Contact opnemen
        </Link>
      </section>
    </main>
  );
}