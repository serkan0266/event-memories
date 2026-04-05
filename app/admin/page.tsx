"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  const createEvent = async () => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

    const { data } = await supabase
      .from("events")
      .insert({
        name,
        slug,
        date
      })
      .select()
      .single();

    const url =
      "https://event-memories-three.vercel.app/event/" + slug;

    setLink(url);
  };

  return (
    <div style={{ padding: 40, maxWidth: 500 }}>
      <h1>Create Event</h1>

      <input
        placeholder="Event name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }}
      />

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 20 }}
      />

      <button
        onClick={createEvent}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none"
        }}
      >
        Create Event
      </button>

      {link && (
        <div style={{ marginTop: 30 }}>
          <p>Event link:</p>
          <a href={link} target="_blank">{link}</a>
        </div>
      )}
    </div>
  );
}