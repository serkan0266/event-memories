import ProgressBar from "./ProgressBar";

export default function UploadCard({
  name,
  setName,
  message,
  setMessage,
  setFile,
  upload,
  progress
}: any){

return (

<div style={{
  background:"#1e293b",
  padding:20,
  borderRadius:14
}}>

<h2>Deel jouw herinnering</h2>

<input
placeholder="Naam"
value={name}
onChange={(e)=>setName(e.target.value)}
style={{width:"100%",padding:10,marginBottom:10}}
/>

<textarea
placeholder="Wil je iets delen?"
value={message}
onChange={(e)=>setMessage(e.target.value)}
style={{width:"100%",padding:10,marginBottom:10}}
/>

<input
type="file"
onChange={(e)=>setFile(e.target.files?.[0] || null)}
/>

<button
onClick={upload}
style={{
marginTop:10,
background:"#f59e0b",
padding:"12px 20px",
borderRadius:8
}}
>
Upload
</button>

{progress > 0 && <ProgressBar progress={progress}/>}

</div>

);
}