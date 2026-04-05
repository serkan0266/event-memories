export default function ProgressBar({ progress }: { progress: number }) {
  return (
    <div style={{
      width: "100%",
      background: "#334155",
      borderRadius: 6,
      height: 8,
      marginTop: 10
    }}>
      <div style={{
        width: progress + "%",
        height: 8,
        background: "#f59e0b",
        borderRadius: 6,
        transition: "width 0.2s"
      }} />
    </div>
  );
}