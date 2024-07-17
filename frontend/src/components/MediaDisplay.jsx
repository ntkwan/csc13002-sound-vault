import { useState, useEffect, memo } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { useGetProfileByIdQuery } from '@services/api';
import { selectCurrentProfile } from '@services/selectors';
import { PlayButton, ReportFrame } from '.';
import { useSong } from '@hooks';

const MediaDisplay = memo(({ media, displayItems, displayType }) => {
    const [currentSong, isPlaying, activateSong] = useSong();
    const myProfileData = useSelector(selectCurrentProfile);
    const myProfileID = myProfileData.id;
    const navigate = useNavigate();
    const handleProfile = (id) => {
        if (myProfileID === id) {
            navigate('/profile');
        } else {
            navigate(`/profile/${id}`);
        }
    };

    const handlePlaylist = (id) => {
        navigate(`/playlist/${id}`);
    };

    const { type, title, visibility, link, data } = media;
    if (!data || !data.length) return;

    return media ? (
        <section className="media__display grid grid-rows-[min-content_auto]">
            {/* media title container*/}
            <title className="media__title-container flex items-center justify-between">
                {/* media tile */}
                {title && (
                    <h2 className="media__title space-x-3 text-3xl">
                        <span className="media__title-name font-bold">
                            {title}
                        </span>
                        <span className="media__title-visibility italic">
                            {visibility}
                        </span>
                    </h2>
                )}
                {/* media link */}
                {link && (
                    <Link
                        className="media__link text-sm text-[#999] hover:text-white hover:underline hover:underline-offset-2"
                        to={link}
                    >
                        <span className="media__link-desc font-medium">
                            See More
                        </span>
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
                        case '4':
                            MediaComponent = MediaItems4;
                            break;
                        default:
                            MediaComponent = MediaItems;
                    }

                    let onClickImage, onClickButton, isOnPlaying;
                    if (type == 'Song') {
                        onClickImage = () => activateSong(mediaData);
                        onClickButton = onClickImage;
                        isOnPlaying = currentSong == mediaData.id && isPlaying;
                    } else if (type == 'Artist') {
                        onClickImage = () => handleProfile(mediaData.id);
                        isOnPlaying = false;
                    } else if (type == 'Album') {
                        onClickImage = () => handlePlaylist(mediaData.id);
                        isOnPlaying = false;
                    }
                    return (
                        <MediaComponent
                            key={index}
                            type={type}
                            mediaData={mediaData}
                            onClickImage={onClickImage}
                            onClickButton={onClickButton}
                            isOnPlaying={isOnPlaying}
                            index={index}
                        />
                    );
                })}
            </div>
        </section>
    ) : null;
});

MediaDisplay.displayName = 'MediaDisplay';
MediaDisplay.propTypes = {
    media: PropTypes.shape({
        type: PropTypes.string,
        title: PropTypes.string,
        visibility: PropTypes.string,
        link: PropTypes.string,
        data: PropTypes.array,
    }),
    displayItems: PropTypes.string,
    displayType: PropTypes.string,
};

export default MediaDisplay;

function prevent(fn, defaultOnly) {
    return (e, ...params) => {
        e && e.preventDefault();
        !defaultOnly && e && e.stopPropagation();
        fn(e, ...params);
    };
}

prevent.prototype = {
    fn: PropTypes.func.isRequired,
    defaultOnly: PropTypes.bool,
};

const MediaItems = memo(
    ({ type, mediaData, onClickImage, onClickButton, isOnPlaying }) => {
        // Song
        const { title, artist, image } = mediaData;
        // Artist
        const { name, imageurl } = mediaData;
        // Album
        const { playlist_owner } = mediaData;
        const { data: owner } = useGetProfileByIdQuery(playlist_owner);
        // image
        const { url } = image || imageurl;

        if (type == 'Album' && !owner) return null;

        let imageClass = 'w-[130px] rounded-[30px]';
        let cart_title, card_desc;
        if (type == 'Artist') {
            imageClass = 'w-[160px] rounded-full';
            cart_title = name;
            card_desc = '';
        } else if (type == 'Song') {
            cart_title = title;
            card_desc = artist;
        } else if (type == 'Album') {
            cart_title = name;
            card_desc = owner.name;
        }

        return (
            <div className="media-item group w-full flex-col space-y-2">
                <div className="relative m-auto w-[160px]">
                    {url ? (
                        <img
                            className={`media-item__image m-auto h-[160px] border-[3px] object-cover hover:cursor-pointer ${imageClass}`}
                            src={url}
                            alt={cart_title}
                            onClick={onClickImage}
                        />
                    ) : (
                        <div className="">
                            <i className="bx bxs-user-circle aspect-square h-full -translate-y-2 text-[170px] leading-none"></i>
                        </div>
                    )}
                    <PlayButton
                        onClick={onClickButton}
                        isOnPlaying={isOnPlaying}
                    />
                </div>
                <p className="media-item__name overflow-hidden text-ellipsis text-nowrap text-center">
                    {cart_title}
                </p>
                {card_desc && (
                    <p className="media-item__desc overflow-hidden text-ellipsis text-nowrap text-center text-sm text-[#808080]">
                        {card_desc}
                    </p>
                )}
            </div>
        );
    },
);

MediaItems.displayName = 'MediaItems';
MediaItems.propTypes = {
    type: PropTypes.string,
    mediaData: PropTypes.shape({
        id: PropTypes.string,
        title: PropTypes.string,
        artist: PropTypes.string,
        genre: PropTypes.string,
        imageurl: PropTypes.shape({
            publicId: PropTypes.string,
            url: PropTypes.string,
        }),
    }),
    onClick: PropTypes.func,
    isOnPlaying: PropTypes.bool,
};

const MediaItems2 = memo(
    ({ type, mediaData, onClickImage, onClickButton, isOnPlaying }) => {
        // Song
        const { title, image } = mediaData;
        // Artist
        const { name, imageurl } = mediaData;
        // Album: name, image
        const { url } = image || imageurl;

        let imageClass = 'rounded-lg';
        let cart_title,
            card_desc = type;
        if (type == 'Artist') {
            imageClass = 'rounded-full';
            cart_title = name;
        } else if (type == 'Song') {
            cart_title = title;
        } else if (type == 'Album') {
            cart_title = name;
        }

        return (
            <div
                className="media-item z-1 group relative aspect-[1/1.3] w-[170px] rounded-lg bg-white bg-opacity-10 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-opacity-20"
                onClick={onClickImage}
            >
                <div className="media-item__content absolute left-4 right-4 top-4 flex flex-col font-medium">
                    <div className="media-item__image relative">
                        <img
                            className={`${imageClass} media-item__img pointer-events-none aspect-square w-full object-cover hover:cursor-pointer`}
                            src={url}
                            alt={cart_title}
                        />
                        <PlayButton
                            onClick={prevent(onClickButton)}
                            isOnPlaying={isOnPlaying}
                        />
                    </div>
                    <span className="media-item__name mt-3 overflow-hidden text-ellipsis text-nowrap text-sm">
                        {cart_title}
                    </span>
                    <span className="media-item__desc mt-1 overflow-hidden text-ellipsis text-nowrap text-[13px] text-[#b2b2b2]">
                        {card_desc}
                    </span>
                </div>
            </div>
        );
    },
);

MediaItems2.displayName = 'MediaItems2';
MediaItems2.propTypes = MediaItems.propTypes;

const MediaItems3 = memo(({ type, mediaData }) => {
    const { title, imageurl } = mediaData;
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

const MediaItems4 = memo(({ mediaData, onClickButton, isOnPlaying, index }) => {
    const [duration, setDuration] = useState('0:00');
    const [menuVisible, setMenuVisible] = useState(null);
    const [showReportFrame, setShowReportFrame] = useState(false);

    const toggleMenu = (index) => {
        setMenuVisible(menuVisible === index ? null : index);
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (menuVisible !== null && !e.target.closest('.menu')) {
                setMenuVisible(null);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [menuVisible]);

    const { title, artist, view, imageurl, audiourl } = mediaData;
    const { url } = imageurl;

    useEffect(() => {
        if (audiourl) {
            const audio = new Audio(audiourl);
            audio.addEventListener('loadedmetadata', () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            });
        }
    }, [audiourl]);

    return (
        <>
            {showReportFrame && (
                <ReportFrame setShowReportFrame={setShowReportFrame} />
            )}
            <div
                className="rounded-ful hover:bg group relative grid w-full grid-cols-[500px_100px_60px_120px] items-center justify-between rounded-full p-2 px-8 transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
                onClick={onClickButton}
            >
                {/* index - img - name */}
                <div className="flex items-center space-x-8">
                    <div className="">
                        <PlayButton
                            onClick={onClickButton}
                            isOnPlaying={isOnPlaying}
                            position="left-6 z-index-[5]"
                        />
                        <span className="block w-3 group-hover:cursor-pointer">
                            {index + 1}
                        </span>
                    </div>
                    <img
                        className="h-14 w-14 object-cover"
                        src={url}
                        alt={title}
                    />
                    <p className="block w-full">{title}</p>
                </div>
                <span>{view}</span>
                <span>{duration}</span>
                <div className="flex items-center justify-end">
                    <i
                        className="bx bxs-dollar-circle relative flex-[1] text-center text-2xl transition-all duration-75 ease-in hover:cursor-pointer hover:text-3xl"
                        // onClick={prevent()}
                        data-title={`Donate for ${title} by ${artist}`}
                    ></i>
                    <button
                        className="relative flex-[1]"
                        onClick={prevent(() => toggleMenu(index))}
                    >
                        <i
                            className="ri-more-fill relative text-2xl transition-all duration-75 ease-in-out hover:text-3xl"
                            data-title={`More options for ${title} by ${artist}`}
                        ></i>
                        {menuVisible === index && (
                            <div className="menu absolute right-0 z-[2] mt-2 h-max w-40 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                <ul>
                                    <li className="flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                        <i className="ri-share-line text-xl leading-none"></i>
                                        <span>Share</span>
                                    </li>
                                    <li
                                        className="flex cursor-pointer space-x-2 rounded-b-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                        onClick={prevent(() =>
                                            setShowReportFrame(true),
                                        )}
                                    >
                                        <i className="ri-error-warning-line text-xl leading-none"></i>
                                        <span>Report</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
});

MediaItems4.displayName = 'MediaItems4';
MediaItems4.propTypes = {
    ...MediaItems.propTypes,
    index: PropTypes.number,
};

export { MediaItems, MediaItems2, MediaItems3, MediaItems4 };
