import Link from "next/link";

export default function Home() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b1628",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        fontFamily: "sans-serif"
      }}
    >
      <h1 style={{ fontSize: 48, marginBottom: 10 }}>
        Showverhuur Memories
      </h1>

      <p style={{ opacity: 0.7, marginBottom: 40 }}>
        Upload en verzamel herinneringen van jouw event
      </p>

      <div style={{ display: "flex", gap: 20 }}>
        <Link
          href="/admin"
          style={{
            background: "#f59e0b",
            padding: "14px 26px",
            borderRadius: 8,
            color: "white",
            textDecoration: "none",
            fontWeight: 600
          }}
        >
          Admin Dashboard
        </Link>

        <Link
          href="/event/test"
          style={{
            background: "#1f2937",
            padding: "14px 26px",
            borderRadius: 8,
            color: "white",
            textDecoration: "none"
          }}
        >
          Demo Event
        </Link>
      </div>
    </div>
  );
}