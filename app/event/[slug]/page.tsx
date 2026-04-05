"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useParams } from "next/navigation";

export default function EventPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [event, setEvent] = useState<any>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    loadEvent();
  }, [slug]);

  async function loadEvent() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (data) {
      setEvent(data);
      loadUploads(data.id);
    }
  }

  async function loadUploads(eventId: string) {
    const { data } = await supabase
      .from("uploads")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false });

    setUploads(data || []);
  }

  async function handleUpload() {
    if (!file || !event) return;

    const filePath = `${event.id}/${Date.now()}-${file.name}`;

    await supabase.storage
      .from("event-uploads")
      .upload(filePath, file);

    const fileUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL +
      "/storage/v1/object/public/event-uploads/" +
      filePath;

    const type = file.type.startsWith("video") ? "video" : "image";

    await supabase.from("uploads").insert({
      event_id: event.id,
      name,
      message,
      file_url: fileUrl,
      type,
    });

    setName("");
    setMessage("");
    setFile(null);

    loadUploads(event.id);
  }

  if (!event) return <div style={{ padding: 40 }}>Loading event...</div>;

  return (
    <div style={{ padding: 40, maxWidth: 700, margin: "0 auto" }}>
      <h1>{event.name}</h1>
      <p>Share your memories from this event</p>

      <input
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <textarea
        placeholder="Write a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        style={{ marginBottom: 20 }}
      />

      <button
        onClick={handleUpload}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none",
        }}
      >
        Upload memory
      </button>

      <hr style={{ margin: "40px 0" }} />

      <h2>Event memories</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {uploads.map((item) => (
          <div key={item.id}>
            {item.type === "image" ? (
              <img
                src={item.file_url}
                style={{ width: "100%", borderRadius: 8 }}
              />
            ) : (
              <video
                src={item.file_url}
                controls
                style={{ width: "100%", borderRadius: 8 }}
              />
            )}

            <p style={{ marginTop: 8 }}>
              <b>{item.name}</b>
            </p>

            <p>{item.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}