import { Link } from "react-router-dom";
import PropTypes from "prop-types";

MediaDisplay.propTypes = {
  media: PropTypes.shape({
    type: PropTypes.string.isRequired,
    header: PropTypes.string.isRequired,
    visibility: PropTypes.string,
    link: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        desc: PropTypes.string,
        ext: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
  displayItems: PropTypes.string.isRequired,
  displayType: PropTypes.string.isRequired,
};

function MediaDisplay({ media, displayItems, displayType }) {
  if (!media) return null;
  const { type, header, visibility, link, data } = media;

  return (
    <div className="grid grid-rows-[min-content_auto]">
      {/* Media header */}
      <div className="flex items-center justify-between">
        <div className="space-x-3">
          <h2 className="inline text-3xl font-bold">{header}</h2>
          <h2 className="inline text-3xl font-thin italic">{visibility}</h2>
        </div>
        {link !== "" && (
          <Link
            className="media__link rounded-full text-sm text-[#808080] hover:text-white hover:underline hover:underline-offset-2"
            to={link}
            href="#"
          >
            <span className="font-medium">See More </span>
            <i className="ri-arrow-right-line text-base"></i>
          </Link>
        )}
      </div>
      {/* Media content */}
      <div className={`${displayType} mt-4 justify-items-center`}>
        {data.map((med, index) => {
          const { name, desc, ext } = med;
          let MediaComponent;
          switch (displayItems) {
            case "1":
              MediaComponent = MediaItems;
              break;
            case "2":
              MediaComponent = MediaItems2;
              break;
            case "3":
              MediaComponent = MediaItems3;
              break;
            default:
              MediaComponent = MediaItems;
          }
          const extension = ext || "jpg";
          let src = `src/assets/img/${type}/${name}.${extension}`;
          return (
            <MediaComponent
              key={index}
              type={type}
              name={name}
              desc={desc}
              src={src}
            />
          );
        })}
      </div>
    </div>
  );
}

export default MediaDisplay;

MediaItems.propTypes = {
  name: PropTypes.string.isRequired,
  desc: PropTypes.string,
  src: PropTypes.string.isRequired,
};

function MediaItems({ name, desc, src }) {
  const imageClass =
    desc === undefined ? "w-[150px] rounded-full" : "w-[120px] rounded-[30px]";
  return (
    <div className="grid grid-cols-[170px] grid-rows-[150px_auto_max-content] items-center justify-items-center">
      <img
        className={`h-full border-[3px] object-cover ${imageClass}`}
        src={src}
        alt={name}
      />
      <span className="mt-2 text-center text-white">{name}</span>
      {desc && (
        <span className="mt-1 text-center text-sm text-[#808080]">{desc}</span>
      )}
    </div>
  );
}

MediaItems2.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  desc: PropTypes.string,
  src: PropTypes.string.isRequired,
};

function MediaItems2({ type, name, desc, src }) {
  const imageClass = type === "artist" ? "rounded-[100%]" : "rounded-lg";
  return (
    <div className="group relative aspect-[1/1.3] w-[170px] rounded-lg bg-white bg-opacity-10 transition-all duration-300 ease-in-out hover:bg-opacity-20">
      {type === "artist" && (
        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-[100%] bg-black">
          <i className="ri-close-large-line text-xs"></i>
        </div>
      )}
      <div className="absolute left-4 right-4 top-4 flex flex-col">
        <div className="relative">
          <img
            className={`aspect-square w-full object-cover ${imageClass}`}
            src={src}
            alt=""
          />
          <button className="absolute bottom-0 right-0 h-10 w-10 -translate-x-2 rounded-[100%] bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] opacity-0 transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:opacity-100">
            <i className="ri-play-fill text-xl"></i>
          </button>
        </div>
        <span className="mt-3 overflow-hidden text-ellipsis text-nowrap text-sm font-semibold">
          {name}
        </span>
        <span className="mt-1 overflow-hidden text-ellipsis text-nowrap text-xs font-medium text-[#b2b2b2]">
          {desc}
        </span>
      </div>
    </div>
  );
}

MediaItems3.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function MediaItems3({ type, name }) {
  const propsDiv =
    type === "genre" ? "col-span-2 aspect-[2/1]" : "col-span-1 aspect-[8/7]";
  const propsSpan = type === "genre" ? "top-5 text-4xl" : "top-3 text-2xl";
  return (
    <>
      <div
        className={`relative w-full overflow-hidden bg-pink-500 ${propsDiv}`}
      >
        <img
          className={`absolute bottom-0 right-0 aspect-square h-[5.5rem] translate-x-3 translate-y-3 rotate-[30deg]`}
          src="src/assets/img/artist/Sơn Tùng MTP.jpg"
          alt=""
        />
        <span className={`absolute left-5 font-bold ${propsSpan}`}>{name}</span>
      </div>
    </>
  );
}
