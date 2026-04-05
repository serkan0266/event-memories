"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EventPage({ params }: any) {
  const slug = params.slug;

  const [event, setEvent] = useState<any>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [files, setFiles] = useState<FileList | null>(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  useEffect(() => {
    loadEvent();
    loadUploads();
  }, []);

  async function loadEvent() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    setEvent(data);
  }

  async function loadUploads() {
    const { data } = await supabase
      .from("uploads")
      .select("*")
    .eq("slug", slug)
      .order("created_at", { ascending: false });

    setUploads(data || []);
  }

  async function handleUpload() {
    if (!files) return;

    setUploading(true);
    let done = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const path = `${slug}/${Date.now()}_${file.name}`;

      await supabase.storage.from("uploads").upload(path, file);

      const { data: publicUrl } = supabase.storage
        .from("uploads")
        .getPublicUrl(path);

      await supabase.from("uploads").insert({
        event_slug: slug,
        file_url: publicUrl.publicUrl,
        type: file.type.startsWith("video") ? "video" : "image",
      });

      done++;
      setProgress(Math.round((done / files.length) * 100));
    }

    setUploading(false);
    setProgress(0);
    setFiles(null);

    loadUploads();
  }

  function next() {
    if (viewerIndex === null) return;
    if (viewerIndex < uploads.length - 1) setViewerIndex(viewerIndex + 1);
  }

  function prev() {
    if (viewerIndex === null) return;
    if (viewerIndex > 0) setViewerIndex(viewerIndex - 1);
  }

  if (!event) return null;

  return (
    <div
      style={{
        background: "#F7F3EE",
        minHeight: "100vh",
        fontFamily: "system-ui",
      }}
    >

      {/* HERO HEADER */}

      <div
        style={{
          position: "relative",
          height: 260,
          overflow: "hidden",
        }}
      >
        {event.header_image && (
          <img
            src={event.header_image}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              position: "absolute",
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
          }}
        />

        {/* logo */}

        <img
          src="/logo.png"
          style={{
            position: "absolute",
            top: 20,
            left: 20,
            height: 40,
          }}
        />

        {/* titel */}

        <div
          style={{
            position: "absolute",
            bottom: 25,
            left: 25,
            color: "white",
          }}
        >
          <h1 style={{ margin: 0 }}>{event.name}</h1>
          <p>{uploads.length} herinneringen</p>
        </div>
      </div>

      {/* UPLOAD CARD */}

      <div
        style={{
          maxWidth: 800,
          margin: "40px auto",
          background: "white",
          padding: 30,
          borderRadius: 14,
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
        }}
      >
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(e.target.files)}
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          style={{
            marginTop: 15,
            padding: "12px 20px",
            background: "#C9A46C",
            border: "none",
            borderRadius: 8,
            color: "white",
            cursor: "pointer",
          }}
        >
          Upload
        </button>

        {uploading && (
          <div style={{ marginTop: 15 }}>
            <div
              style={{
                height: 8,
                background: "#eee",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: progress + "%",
                  height: 8,
                  background: "#C9A46C",
                }}
              />
            </div>

            <p style={{ marginTop: 8 }}>
              {progress}% upload — grote video's kunnen even duren.
              Sluit deze pagina niet.
            </p>
          </div>
        )}
      </div>

      {/* GALLERY */}

      <div
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          columnCount: 3,
          columnGap: 12,
          padding: "0 20px",
        }}
      >
        {uploads.map((item, i) => (
          <div
            key={item.id}
            onClick={() => setViewerIndex(i)}
            style={{
              marginBottom: 12,
              breakInside: "avoid",
              cursor: "pointer",
            }}
          >
            {item.type === "image" ? (
              <img
                src={item.file_url}
                style={{
                  width: "100%",
                  borderRadius: 12,
                }}
              />
            ) : (
              <video
                style={{
                  width: "100%",
                  borderRadius: 12,
                }}
              >
                <source src={item.file_url} />
              </video>
            )}
          </div>
        ))}
      </div>

      {/* FULLSCREEN VIEWER */}

      {viewerIndex !== null && (
        <div
          onClick={() => setViewerIndex(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            style={{
              position: "absolute",
              left: 30,
              fontSize: 40,
              color: "white",
              background: "none",
              border: "none",
            }}
          >
            ‹
          </button>

          {uploads[viewerIndex].type === "image" ? (
            <img
              src={uploads[viewerIndex].file_url}
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            />
          ) : (
            <video
              controls
              autoPlay
              style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            >
              <source src={uploads[viewerIndex].file_url} />
            </video>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            style={{
              position: "absolute",
              right: 30,
              fontSize: 40,
              color: "white",
              background: "none",
              border: "none",
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}