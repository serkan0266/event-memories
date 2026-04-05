"use client";

import { useState } from "react";

export default function GalleryViewer({ uploads, startIndex, close }: any) {

  const [index,setIndex] = useState(startIndex);

  const item = uploads[index];

  function next(){
    if(index < uploads.length-1) setIndex(index+1);
  }

  function prev(){
    if(index > 0) setIndex(index-1);
  }

  return (

  <div style={{
    position:"fixed",
    inset:0,
    background:"rgba(0,0,0,0.95)",
    display:"flex",
    alignItems:"center",
    justifyContent:"center",
    zIndex:1000
  }}>

  <button
    onClick={close}
    style={{
      position:"absolute",
      top:20,
      right:20,
      fontSize:20,
      color:"white"
    }}
  >
    ✕
  </button>

  <button
    onClick={prev}
    style={{
      position:"absolute",
      left:20,
      fontSize:30,
      color:"white"
    }}
  >
    ‹
  </button>

  {item.type === "image" ? (
    <img
      src={item.file_url}
      style={{maxHeight:"90%",maxWidth:"90%"}}
    />
  ) : (
    <video
      src={item.file_url}
      controls
      style={{maxHeight:"90%",maxWidth:"90%"}}
    />
  )}

  <button
    onClick={next}
    style={{
      position:"absolute",
      right:20,
      fontSize:30,
      color:"white"
    }}
  >
    ›
  </button>

  </div>

  );
}