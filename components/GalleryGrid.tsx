export default function GalleryGrid({ uploads, openViewer }: any) {

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 14,
      }}
    >
      {uploads.map((item: any, index: number) => (
        <div
          key={item.id}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => openViewer(index)}
        >
          {item.type === "image" ? (
            <img
              src={item.file_url}
              style={{ width: "100%", display: "block" }}
            />
          ) : (
            <video
              src={item.file_url}
              style={{ width: "100%" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}