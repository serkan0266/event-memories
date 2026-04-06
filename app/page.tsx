import Link from "next/link";

// Color constants based on showverhuur branding
const COLORS = {
  bg: "#F7F3EE",
  gold: "#C9A46C",
  text: "#1f2937",
  white: "#FFFFFF",
  dark: "#111827",
};

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: COLORS.bg,
        minHeight: "100vh",
        color: COLORS.text,
      }}
    >
      {/* HEADER SECTION (New) */}
      <header
        style={{
          background: "white",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          maxWidth: "100%",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <p
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: COLORS.dark,
            margin: 0,
          }}
        >
          SHOW<span style={{ color: COLORS.gold }}>VERHUUR</span>.MEMORIES
        </p>
        <nav style={{ display: "flex", gap: 30, alignItems: "center" }}>
          {["Memories", "Over ons", "Prijzen", "Contact"].map((item) => (
            <a
              key={item}
              href="#"
              style={{
                textDecoration: "none",
                color: COLORS.dark,
                fontWeight: 500,
              }}
            >
              {item}
            }
          />
          ))}
          <a
            href="https://showverhuur.nl/contact"
            style={{
              background: COLORS.gold,
              padding: "10px 20px",
              borderRadius: 6,
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Vraag informatie aan
          </a>
        </nav>
      </header>

      {/* HERO SECTION (Refined original) */}
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
        <div>
          <p
            style={{
              color: COLORS.gold,
              fontWeight: 600,
              marginBottom: 10,
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            SHOWVERHUUR MEMORIES
          </p>

          <h1
            style={{
              fontSize: 52,
              lineHeight: 1.1,
              marginBottom: 20,
              color: COLORS.dark,
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
              marginBottom: 35,
              maxWidth: 500,
              lineHeight: 1.6,
            }}
          >
            Laat gasten eenvoudig foto’s en video’s uploaden tijdens jullie
            gender reveal, bruiloft of feest. Alle herinneringen worden
            automatisch verzameld op één plek.
          </p>

          <a
            href="https://showverhuur.nl/contact"
            style={{
              background: COLORS.gold,
              padding: "16px 32px",
              borderRadius: 8,
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 4px 10px rgba(201,164,108,0.2)",
            }}
          >
            Start jouw Memories pagina
          </a>
        </div>

        <img
          src="https://images.unsplash.com/photo-1602631985686-1bb0e6a8696e"
          alt="Happy family celebrating"
          style={{
            width: "100%",
            borderRadius: 20,
            objectFit: "cover",
            height: "auto",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
          }}
        />
      </section>

      {/* PROCESS SECTION (New style, using original 'how works' items next to vertical image) */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "3fr 2fr",
            gap: 60,
            alignItems: "start",
          }}
        >
          <div>
            <h2
              style={{
                textAlign: "left",
                fontSize: 38,
                marginBottom: 50,
                color: COLORS.dark,
              }}
            >
              Hoe werkt Showverhuur Memories?
            </h2>

            {[
              {
                number: "1.",
                title: "Event pagina",
                text: "Voor jullie event wordt een speciale pagina aangemaakt waar gasten hun foto’s en video’s kunnen uploaden.",
              },
              {
                number: "2.",
                title: "Gasten uploaden",
                text: "Via een simpele link of QR-code kunnen gasten direct hun herinneringen delen tijdens het event.",
              },
              {
                number: "3.",
                title: "Alles op één plek",
                text: "Na het event kun je alle foto's en video’s eenvoudig downloaden en bewaren als blijvende herinnering.",
              },
            ].map((step, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr",
                  gap: 20,
                  alignItems: "start",
                  marginBottom: 30,
                  paddingBottom: 20,
                  borderBottom: `1px solid rgba(31,41,55,0.08)`,
                }}
              >
                <div
                  style={{
                    color: COLORS.gold,
                    fontSize: 42,
                    fontWeight: 700,
                    lineHeight: 1,
                    textAlign: "right",
                  }}
                >
                  {step.number}
                </div>
                <div>
                  <h3
                    style={{
                      marginBottom: 10,
                      color: COLORS.dark,
                      fontSize: 22,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p style={{ opacity: 0.8, lineHeight: 1.6, margin: 0 }}>
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <img
            src="https://images.unsplash.com/photo-1530103043960-ef38714abb15"
            alt="Balloon arch decor vertical"
            style={{
              width: "100%",
              borderRadius: 14,
              boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
              objectFit: "cover",
              maxHeight: "650px",
            }}
          />
        </div>
      </section>

      {/* EVENT TYPES SECTION (New, multi-column card grid using original list) */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 38,
            marginBottom: 60,
            color: COLORS.dark,
          }}
        >
          Perfect voor elk type event
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 20,
          }}
        >
          {[
            { title: "Gender Reveals", icon: "Gender" },
            { title: "Bruiloften", icon: "Bruiloft" },
            { title: "Baby Showers", icon: "Baby" },
            { title: "Verjaardagen", icon: "Verjaardag" },
            { title: "Bedrijfs-events", icon: "Zakelijk" },
          ].map((type) => (
            <div
              key={type.title}
              style={{
                background: "white",
                padding: "30px",
                borderRadius: 14,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
              }}
            >
              {/* Simple placeholder icons - replace with actual images/SVGs */}
              <div
                style={{
                  color: COLORS.gold,
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 10,
                }}
              >
                {type.icon === "Gender" && "Balloons"}
                {type.icon === "Bruiloft" && "Rings"}
                {type.icon === "Baby" && "Rattle"}
                {type.icon === "Verjaardag" && "Cake"}
                {type.icon === "Zakelijk" && "Connect"}
              </div>
              <p
                style={{
                  fontWeight: 600,
                  margin: 0,
                  fontSize: 16,
                  color: COLORS.dark,
                }}
              >
                {type.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* GALLERY SECTION (New, 4-item grid) */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
          }}
        >
          {[
            {
              src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30",
              alt: "Wedding couples under arch",
              title: "Bruiloften",
            },
            {
              src: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b",
              alt: "Baby shower party table decor",
              title: "Baby Showers",
            },
            {
              src: "https://images.unsplash.com/photo-1502691876148-a84978e59af8",
              alt: "Gender reveal party balloon release",
              title: "Gender Reveals",
            },
            {
              src: "https://images.unsplash.com/photo-1530103043960-ef38714abb15",
              alt: "Corporate party venue",
              title: "Bedrijfs-events",
            },
          ].map((item, index) => (
            <div key={index} style={{ position: "relative" }}>
              <img
                src={item.src}
                alt={item.alt}
                style={{
                  width: "100%",
                  borderRadius: 14,
                  objectFit: "cover",
                  aspectRatio: "1/1",
                }}
              />
              <p
                style={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  color: "white",
                  background: "rgba(17,24,39,0.5)",
                  padding: "6px 12px",
                  borderRadius: 6,
                  margin: 0,
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {item.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS SECTION (New) */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: 1200,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 38,
            marginBottom: 60,
            color: COLORS.dark,
          }}
        >
          De ervaringen van onze klanten
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 30,
          }}
        >
          {[
            {
              name: "Anna V.",
              text: "Het uploaden was ontzettend simpel voor al onze gasten. Echt geweldig!",
            },
            {
              name: "Tim L.",
              text: "Alle foto's en video's van de dag eindelijk op één plek. Een super waardevolle herinnering.",
            },
            {
              name: "Karin d. B.",
              text: "Hele fijne service, de pagina was zo klaar en zag er super uit. Een must-have voor elk event.",
            },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                background: "white",
                padding: 40,
                borderRadius: 14,
                boxShadow: "0 6px 15px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div
                style={{ color: COLORS.gold, fontSize: 32, marginBottom: 20 }}
              >
                ⭐⭐⭐⭐⭐
              </div>
              <p style={{ opacity: 0.8, lineHeight: 1.6, marginBottom: 20 }}>
                {t.text}
              </p>
              <p style={{ fontWeight: 600, margin: 0 }}>- {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM GRID SECTION (New) */}
      <section
        style={{
          padding: "80px 20px",
          maxWidth: "100%",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <a
          href="#"
          style={{
            color: COLORS.gold,
            textDecoration: "none",
            fontSize: 24,
            fontWeight: 700,
            display: "block",
            marginBottom: 40,
          }}
        >
          showerhuur.nl
        </a>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(10, 1fr)",
            gap: 5,
            padding: "0 20px",
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} style={{ aspectRatio: "1/1", position: "relative" }}>
              <img
                src={`https://images.unsplash.com/photo-15${i}02631985686-1bb0e6a8696e?ixid=MnwxMjA3fDB8MXxzZWFyY2h8${i+1}8fGF0JTIwYSUyMHBhcnR5fGVufDB8fHx8MTY3MTkxNjg3Mg&ixlib=rb-4.0.3&w=200&h=200&fit=crop`}
                alt={`Instagram image ${i + 1}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: 24,
                }}
              >
                ▶️
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER SECTION (Refined from original CTA) */}
      <footer
        style={{
          background: COLORS.dark,
          color: "white",
          padding: "100px 20px 50px 20px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: 38, marginBottom: 20 }}>
            Maak jullie herinneringen compleet
          </h2>

          <p
            style={{
              opacity: 0.8,
              marginBottom: 40,
              maxWidth: 600,
              margin: "0 auto 40px auto",
              lineHeight: 1.6,
            }}
          >
            Neem contact op met Showverhuur voor een Memories pagina voor jullie
            event.
          </p>

          <a
            href="https://showverhuur.nl/contact"
            style={{
              background: COLORS.gold,
              padding: "16px 32px",
              borderRadius: 8,
              color: "white",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 16,
              boxShadow: "0 4px 10px rgba(201,164,108,0.2)",
              display: "inline-block",
              marginBottom: 80,
            }}
          >
            Contact opnemen
          </a>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr repeat(3, auto)",
              gap: 80,
              textAlign: "left",
              paddingBottom: 40,
              borderBottom: `1px solid rgba(255,255,255,0.08)`,
            }}
          >
            <p
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: "white",
                margin: 0,
              }}
            >
              SHOW<span style={{ color: COLORS.gold }}>VERHUUR</span>.MEMORIES
            </p>
            {[
              {
                title: "Memories",
                links: ["Gender Reveal", "Bruiloft", "Babyshower"],
              },
              {
                title: "Over ons",
                links: ["Wie zijn wij", "Onze Services", "Portfolio"],
              },
              {
                title: "Contact",
                links: ["Contactformulier", "Offerte aanvragen"],
              },
            ].map((section) => (
              <div key={section.title}>
                <h4
                  style={{
                    color: COLORS.gold,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 20,
                  }}
                >
                  {section.title}
                </h4>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    lineHeight: 2,
                  }}
                >
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        style={{
                          textDecoration: "none",
                          color: "white",
                          opacity: 0.8,
                          fontSize: 14,
                        }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p
            style={{
              fontSize: 12,
              opacity: 0.5,
              marginTop: 30,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>© 2023 SHOWVERHUUR MEMORIES</span>
            <span>Algemene voorwaarden | Privacybeleid</span>
          </p>
        </div>
      </footer>
    </main>
  );
}