"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function UploadForm({ eventId }: { eventId: string }) {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    setUploading(true);

    const filePath = `${eventId}/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("event-uploads")
      .upload(filePath, file);

    if (uploadError) {
      console.error(uploadError);
      alert("Upload failed");
      setUploading(false);
      return;
    }

    const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/event-uploads/${filePath}`;

    const type = file.type.startsWith("video") ? "video" : "image";

    const { error: dbError } = await supabase.from("uploads").insert({
      event_id: eventId,
      name,
      message,
      file_url: fileUrl,
      type,
    });

    if (dbError) {
      console.error(dbError);
      alert("Database error");
    } else {
      alert("Upload successful");
      setName("");
      setMessage("");
      setFile(null);
    }

    setUploading(false);
  };

  return (
    <div style={{ marginTop: 30 }}>
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
        disabled={uploading}
        style={{
          padding: "12px 20px",
          background: "black",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {uploading ? "Uploading..." : "Upload memory"}
      </button>
    </div>
  );
}