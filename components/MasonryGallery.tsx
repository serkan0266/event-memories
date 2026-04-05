import Masonry from "react-masonry-css";

export default function MasonryGallery({ uploads, openViewer }: any) {

const breakpoints = {
default: 3,
768: 2,
500: 1
};

return (

<Masonry
breakpointCols={breakpoints}
className="masonry-grid"
columnClassName="masonry-column"
>

{uploads.map((item: any, index: number) => (

<div key={item.id} onClick={() => openViewer(index)}>

{item.type === "image" ? (

<img src={item.file_url} style={{ width: "100%", borderRadius: 12 }} />

) : (

<video src={item.file_url} style={{ width: "100%", borderRadius: 12 }} />

)}

</div>

))}

</Masonry>

);
}