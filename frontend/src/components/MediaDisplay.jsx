import { useState, memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import { setCurrentTrack, setCurrentTime, setDuration } from '../features/player/slices/playerSlice';

const MediaDisplay = memo(({ media, displayItems, displayType }) => {
    if (!media) return null;
    const { type, title, visibility, link, data } = media;

    const dispatch = useDispatch();
    const handlePlay = ({ title, artist, imageurl, audiourl }) => () => {
        dispatch(setCurrentTrack({ title, artist, url: audiourl, thumbnail: imageurl }));
        dispatch(setCurrentTime(0));
        dispatch(setDuration(0));
    }

    const handleProfile = ({ artist }) => {

    }

    return (
        <section className="media__display grid grid-rows-[min-content_auto]">
            {/* media title container*/}
            <title className="media__title-container flex items-center justify-between">
                {/* media tile */}
                <h2 className="media__title space-x-3 text-3xl">
                    <span className="media__title-name font-bold">{title}</span>
                    <span className="media__title-visibility italic">
                        {visibility}
                    </span>
                </h2>
                {/* media link */}
                {link && (
                    <Link
                        className="media__link text-sm text-[#808080] hover:text-white hover:underline hover:underline-offset-2"
                        to={link}
                    >
                        <span className="media__link-desc font-medium">See More</span>
                        <i className="media__link-icon ri-arrow-right-line text-base"></i>
                    </Link>
                )}
            </title>
            {/* Media content */}
            <div className={`${displayType} mt-4 justify-items-center`}>
                {data.map((mediaData, index) => {
                    let MediaComponent;
                    switch (displayItems) {
                        case '1':
                            MediaComponent = MediaItems;
                            break;
                        case '2':
                            MediaComponent = MediaItems2;
                            break;
                        case '3':
                            MediaComponent = MediaItems3;
                            break;
                        default:
                            MediaComponent = MediaItems;
                    }
                    return (
                        <MediaComponent
                            key={index}
                            type={type}
                            mediaData={mediaData}
                            onClick={type == 'Song' ? handlePlay(mediaData) : handleProfile(mediaData)}
                        />
                    );
                })}
            </div>
        </section>
    );
});

MediaDisplay.displayName = 'MediaDisplay';
MediaDisplay.propTypes = {
    media: PropTypes.shape({
        type: PropTypes.string.isRequired,
        title: PropTypes.string,
        visibility: PropTypes.string,
        link: PropTypes.string,
        data: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                artist: PropTypes.string,
                genre: PropTypes.string,
                imageurl: PropTypes.string,
                audiourl: PropTypes.string,
                view: PropTypes.number,
            }),
        ),
    }).isRequired,
    displayItems: PropTypes.string,
    displayType: PropTypes.string,
};

export default MediaDisplay;

const MediaItems = memo(({ type, mediaData, onClick }) => {
    const { title, artist, imageurl } = mediaData;
    const isArtist = type === 'Artist';
    const imageClass = isArtist ? 'w-[150px] rounded-full' : 'w-[120px] rounded-[30px]';

    return (
        <div className="media-item group grid grid-cols-[170px] grid-rows-[150px_auto_max-content] items-center justify-items-center gap-2">
            <div className="relative h-full">
                <img
                    className={`media-item__image h-full border-[3px] object-cover hover:cursor-pointer ${imageClass}`}
                    src={imageurl}
                    alt={title}
                />
                <button className="media-item__play absolute bottom-1 right-1 h-10 w-10 -translate-x-2 rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] opacity-0 transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:opacity-100"
                    onClick={onClick}
                >
                    <i className="ri-play-fill text-xl"></i>
                </button>
            </div>
            <span className="media-item__name text-center">{isArtist ? artist : title}</span>
            {!isArtist && (<span className="media-item__desc text-center text-sm text-[#808080]">{artist}</span>)}
        </div>
    );
});

MediaItems.displayName = 'MediaItems';
MediaItems.propTypes = {
    type: PropTypes.string,
    mediaData: PropTypes.shape({
        title: PropTypes.string,
        artist: PropTypes.string,
        imageurl: PropTypes.string,
    }),
};

const MediaItems2 = memo(({ type, mediaData, onClick }) => {
    const { title, artist, imageurl } = mediaData;
    const isArtist = type === 'Artist';
    const imageClass = isArtist ? 'rounded-full' : 'rounded-lg';

    return (
        <div className="media-item group relative aspect-[1/1.3] w-[170px] rounded-lg bg-white bg-opacity-10 transition-all duration-300 ease-in-out hover:bg-opacity-20">
            {isArtist && (
                <i className="ri-close-large-line absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-black bg-opacity-40 text-xs"></i>
            )}
            <div className="media-item__content absolute left-4 right-4 top-4 flex flex-col font-medium">
                <div className="media-item__image relative">
                    <img
                        className={`media-item__img aspect-square w-full object-cover hover:cursor-pointer ${imageClass}`}
                        src={imageurl}
                        alt={title}
                    />
                    <button className="media-item__play absolute bottom-0 right-0 h-10 w-10 -translate-x-2 rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] opacity-0 transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:opacity-100"
                        onClick={onClick}
                    >
                        <i className="ri-play-fill text-xl"></i>
                    </button>
                </div>
                <span className="media-item__name mt-3 overflow-hidden text-ellipsis text-nowrap text-sm">
                    {isArtist ? artist : title}
                </span>
                <span className="media-item__desc mt-1 overflow-hidden text-ellipsis text-nowrap text-[13px] text-[#b2b2b2]">
                    {type}
                </span>
            </div>
        </div>
    );
});

MediaItems2.displayName = 'MediaItems2';
MediaItems2.propTypes = MediaItems.propTypes;

const MediaItems3 = memo(({ type, mediaData }) => {
    const propsDiv =
        type === 'genre'
            ? 'col-span-2 aspect-[2/1]'
            : 'col-span-1 aspect-[8/7]';
    const propsSpan = type === 'genre' ? 'top-5 text-4xl' : 'top-3 text-2xl';
    return (
        <div
            className={`media-item-3 relative w-full overflow-hidden bg-pink-500 ${propsDiv}`}
        >
            <img
                className={`media-item-3__img absolute bottom-0 right-0 aspect-square h-[5.5rem] translate-x-3 translate-y-3 rotate-[30deg]`}
                src={imageurl}
                alt={title}
            />
            <span
                className={`media-item-3__name absolute left-5 font-bold ${propsSpan}`}
            >
                {title}
            </span>
        </div>
    );
});

MediaItems3.displayName = 'MediaItems3';
MediaItems3.propTypes = MediaItems.propTypes;

const MediaItems4 = memo(({ mediaList }) => {
    const [menuVisible, setMenuVisible] = useState(null);

    const toggleMenu = (index) => {
        setMenuVisible(menuVisible === index ? null : index);
    };

    return mediaList.map((media, index) => {
        const { title, view, duration, imageurl } = media;
        return (
            <div key={index} className="flex w-full justify-between items-center px-8">
                <div className="flex items-center space-x-8">
                    <span className="w-2">{index + 1}</span>
                    <img
                        className="w-14 aspect-square object-cover"
                        src={imageurl}
                        alt={title}
                    />
                    <span>{title}</span>
                </div>
                <span>{view}</span>
                <span>{duration}</span>
                <button
                    className="relative"
                    onClick={() => toggleMenu(index)}>
                    <i className="ri-more-fill text-2xl"></i>
                    {menuVisible === index && (
                        <div className="absolute right-0 z-[2] mt-2 w-40 h-max rounded-xl text-sm border-[2px] shadow-md border-[#999] bg-[#222]">
                            <ul>
                                <li className="cursor-pointer flex space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                    <i className="ri-share-line text-xl leading-none"></i>
                                    <span>Share</span>
                                </li>
                                <li className="cursor-pointer flex space-x-2 rounded-b-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                    <i className="ri-error-warning-line text-xl leading-none"></i>
                                    <span>Report</span>
                                </li>
                            </ul>
                        </div>
                    )}
                </button>
            </div>
        );
    });
});

MediaItems4.displayName = 'MediaItems4';
MediaItems4.propTypes = {
    mediaList: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            view: PropTypes.number,
            duration: PropTypes.string,
            imageurl: PropTypes.string,
        }),
    ),
};

export { MediaItems, MediaItems2, MediaItems3, MediaItems4 };