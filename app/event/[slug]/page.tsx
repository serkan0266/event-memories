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
  }, []);

  async function loadEvent() {
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .single();

    setEvent(data);

    if (data) loadUploads(data.id);
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
    if (!files || !event) return;

    setUploading(true);

    let uploaded = 0;

    for (const file of Array.from(files)) {

      const filePath = `${event.id}/${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("uploads")
        .upload(filePath, file);

      if (error) continue;

      const { data: publicUrl } = supabase.storage
        .from("uploads")
        .getPublicUrl(filePath);

      await supabase.from("uploads").insert({
        event_id: event.id,
        file_url: publicUrl.publicUrl,
        type: file.type.startsWith("video") ? "video" : "image",
      });

      uploaded++;

      setProgress(Math.round((uploaded / files.length) * 100));
    }

    setUploading(false);
    setFiles(null);
    setProgress(0);

    loadUploads(event.id);
  }

  if (!event) return <div style={{ padding: 40 }}>Loading...</div>;

  const photos = uploads.filter((u) => u.type === "image").length;
  const videos = uploads.filter((u) => u.type === "video").length;

  return (
    <div style={{ background:"#0b1628", minHeight:"100vh", color:"white" }}>

      {/* HEADER */}
      <div style={{
        height:260,
        backgroundImage:`url(${event.header_image})`,
        backgroundSize:"cover",
        backgroundPosition:"center",
        position:"relative"
      }}>
        <div style={{
          position:"absolute",
          bottom:0,
          left:0,
          right:0,
          padding:30,
          background:"linear-gradient(transparent,rgba(0,0,0,0.7))"
        }}>
          <h1 style={{ fontSize:32 }}>{event.name}</h1>
          <p>{photos} foto's • {videos} video's</p>
        </div>
      </div>

      {/* UPLOAD BOX */}
      <div style={{
        maxWidth:700,
        margin:"40px auto",
        background:"#16243a",
        padding:25,
        borderRadius:14
      }}>

        <h3>Deel jouw herinnering</h3>

        <input
          type="file"
          multiple
          onChange={(e)=>setFiles(e.target.files)}
        />

        <br/><br/>

        <button
          onClick={handleUpload}
          style={{
            background:"#d4a24c",
            border:"none",
            padding:"12px 20px",
            borderRadius:8,
            color:"white",
            cursor:"pointer"
          }}
        >
          Upload
        </button>

        {uploading && (
          <div style={{ marginTop:20 }}>

            <div style={{
              height:8,
              background:"#0b1628",
              borderRadius:10
            }}>
              <div style={{
                width:`${progress}%`,
                height:8,
                background:"#d4a24c",
                borderRadius:10
              }}/>
            </div>

            <p style={{ fontSize:13, marginTop:8 }}>
              Upload bezig... sluit deze pagina niet.
            </p>

          </div>
        )}

      </div>

      {/* GALLERY */}
      <div style={{
        maxWidth:1200,
        margin:"0 auto",
        padding:20,
        display:"grid",
        gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))",
        gap:12
      }}>

        {uploads.map((item, index)=>(
          <div
            key={item.id}
            onClick={()=>setViewerIndex(index)}
            style={{
              cursor:"pointer",
              borderRadius:10,
              overflow:"hidden"
            }}
          >

            {item.type === "video" ? (

              <video
                src={item.file_url}
                style={{ width:"100%", height:260, objectFit:"cover" }}
              />

            ) : (

              <img
                src={item.file_url}
                style={{ width:"100%", height:260, objectFit:"cover" }}
              />

            )}

          </div>
        ))}

      </div>

      {/* FULLSCREEN VIEWER */}
      {viewerIndex !== null && (

        <div
          onClick={()=>setViewerIndex(null)}
          style={{
            position:"fixed",
            top:0,
            left:0,
            right:0,
            bottom:0,
            background:"rgba(0,0,0,0.95)",
            display:"flex",
            alignItems:"center",
            justifyContent:"center",
            zIndex:100
          }}
        >

          {uploads[viewerIndex].type === "video" ? (

            <video
              src={uploads[viewerIndex].file_url}
              controls
              style={{ maxWidth:"90%", maxHeight:"90%" }}
            />

          ) : (

            <img
              src={uploads[viewerIndex].file_url}
              style={{ maxWidth:"90%", maxHeight:"90%" }}
            />

          )}

        </div>

      )}

    </div>
  );
}