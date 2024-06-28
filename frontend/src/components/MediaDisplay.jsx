import { memo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const IMG_URL = "src/assets/img/";

const MediaDisplay = memo(({ media, displayItems, displayType }) => {
	if (!media) return null;
	const { type, title, visibility, link, data } = media;
	return (
		<div className="media__display grid grid-rows-[min-content_auto]">
			{/* media title container*/}
			<div className="media__title-container flex justify-between items-center">
				{/* media tile */}
				<div className="media__title text-3xl space-x-3">
					<span className="media__title-name font-bold">{title}</span>
					<span className="media__title-visibility italic">{visibility}</span>
				</div>
				{/* media link */}
				{link && (
					<Link
						className="media__link text-sm text-[#808080] hover:underline hover:underline-offset-2 hover:text-white"
						to={link}>
						<span className="media__link-desc font-medium">See More</span>
						<i className="media__link-icon ri-arrow-right-line text-base"></i>
					</Link>
				)}
			</div>
			{/* Media content */}
			<div className={`${displayType} justify-items-center mt-4`}>
				{data.map((media, index) => {
					let { name, desc, ext } = media;
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
					let src = `${IMG_URL}${type}/${name}.${extension}`;
					if (!desc) desc = type;
					return <MediaComponent key={index} type={type} name={name} desc={desc} src={src} />;
				})}
			</div>
		</div>
	);
});

MediaDisplay.propTypes = {
	media: PropTypes.shape({
		type: PropTypes.string.isRequired,
		title: PropTypes.string,
		visibility: PropTypes.string,
		link: PropTypes.string.isRequired,
		data: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				desc: PropTypes.string,
				ext: PropTypes.string,
			})
		).isRequired,
	}).isRequired,
	displayItems: PropTypes.string.isRequired,
	displayType: PropTypes.string.isRequired,
};

export default MediaDisplay;

const MediaItems = memo(({ name, desc, src }) => {
	const imageClass = desc === "Artist" ? "w-[150px] rounded-full" : "w-[120px] rounded-[30px]";
	return (
		<div className="media-item grid grid-rows-[150px_auto_max-content] grid-cols-[170px] gap-2 justify-items-center items-center">
			<img className={`media-item__image h-full border-[3px] object-cover ${imageClass}`} src={src} alt={name} />
			<span className="media-item__name text-center">{name}</span>
			{desc && <span className="media-item__desc text-sm text-center text-[#808080]">{desc}</span>}
		</div>
	);
});

MediaItems.propTypes = {
	name: PropTypes.string,
	desc: PropTypes.string,
	src: PropTypes.string,
};

const MediaItems2 = memo(({ type, name, desc, src }) => {
	const imageClass = type === "Artist" ? "rounded-full" : "rounded-lg";
	return (
		<div className="media-item group relative w-[170px] aspect-[1/1.3] rounded-lg bg-white bg-opacity-10 
										hover:bg-opacity-20 transition-all duration-300 ease-in-out">
			{type === "Artist" && (
				<i className="ri-close-large-line absolute top-3 right-3 flex justify-center items-center 
											w-5 h-5 text-xs rounded-full bg-opacity-40 bg-black">
				</i>
			)}
			<div className="media-item__content absolute left-4 right-4 top-4 flex flex-col font-medium">
				<div className="media-item__image relative">
					<img
						className={`media-item__img w-full aspect-square object-cover ${imageClass}`}
						src={src} alt=""
					/>
					<button className="media-item__play absolute bottom-0 right-0 w-10 h-10 -translate-x-2 rounded-full 
														 bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] opacity-0 group-hover:opacity-100 
														 group-hover:-translate-y-2 transition-all duration-300 ease-in-out">
						<i className="ri-play-fill text-xl"></i>
					</button>
				</div>
				<span className="media-item__name text-sm text-nowrap text-ellipsis overflow-hidden mt-3">{name}</span>
				<span className="media-item__desc text-[13px] text-nowrap text-ellipsis overflow-hidden mt-1 text-[#b2b2b2]">{desc}</span>
			</div>
		</div>
	);
});

MediaItems2.propTypes = {
	type: PropTypes.string,
	name: PropTypes.string,
	desc: PropTypes.string,
	src: PropTypes.string,
};

const MediaItems3 = memo(({ type, name, desc, src }) => {
	const propsDiv = type === "genre" ? "col-span-2 aspect-[2/1]" : "col-span-1 aspect-[8/7]";
	const propsSpan = type === "genre" ? "top-5 text-4xl" : "top-3 text-2xl";
	return (
		<div className={`media-item-3 relative w-full bg-pink-500 overflow-hidden ${propsDiv}`}>
			<img
				className={`media-item-3__img absolute bottom-0 right-0 h-[5.5rem] aspect-square translate-x-3 translate-y-3 rotate-[30deg]`}
				src={src}
				alt={name}
			/>
			<span className={`media-item-3__name absolute left-5 font-bold ${propsSpan}`}>{name}</span>
		</div>
	);
});

MediaItems3.propTypes = {
	type: PropTypes.string,
	name: PropTypes.string,
	desc: PropTypes.string,
	src: PropTypes.string,
};
