import "../../assets/themify-icons/themify-icons.css";

function MediaDisplay({ media, displayType, children }) {
    const { src, header, descript, isLink, data } = media;
    return (
        <div className="grid grid-rows-[min-content_auto]">
            {/* Media header */}
            <div className="flex justify-between items-center">
                <div className="space-x-3">
                    <h2 className="inline font-bold text-3xl">{header}</h2>
                    <h2 className="inline font-thin text-3xl italic">{descript}</h2>
                </div>
                {isLink && (
                    <a className="media__link text-sm text-[#808080]" href="#">
                        See More
                        <i className="ti-arrow-right p-1"></i>
                    </a>
                )}
            </div>
            {/* Media content */}
            <div className={displayType}>
                {data.map((media) => {
                    const { name, artist } = media;
                    return <MediaContainer src={getImageSrc(src, `${name}`)} name={name} artist={artist} />;
                })}
            </div>
        </div >
    );
}

export default MediaDisplay;

function getImageSrc(src, name) {
    const extensions = ['jpg', 'jpeg', 'png', 'svg']; // Các phần mở rộng ảnh bạn muốn kiểm tra
    for (let ext of extensions) {
        const imagePath = `${src}${name}.${ext}`;
        const img = new Image();
        img.src = imagePath;
        if (img.complete) {
            return imagePath;
        }
    }
    return null;
}

function MediaContainer({ src, name, artist }) {
    const imageClass = artist === undefined ? "w-[150px] rounded-full" : "w-[120px] rounded-[30px]";
    return (
        <div className="grid grid-rows-[150px_auto_max-content] grid-cols-[170px] justify-items-center items-center">
            <img className={`h-full ${imageClass} border-[3px] object-cover`} src={src} alt={name} />
            <span className="mt-2 text-center text-white">{name}</span>
            {artist && <span className="mt-2 text-sm text-[#808080]">{artist}</span>}
        </div>
    );
}
