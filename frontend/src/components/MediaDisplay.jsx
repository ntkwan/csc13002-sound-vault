import { useState, useEffect, memo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { PlayButton } from '.';
import { selectCurrentPlayer, selectCurrentProfile } from '@services/selectors';
import { play, pause, setCurrentTrack } from '../features/player/slices';
import { usePlaySongMutation } from '@services/api';
import { toast } from 'react-toastify';

const MediaDisplay = memo(({ media, displayItems, displayType }) => {
    const dispatch = useDispatch();
    const { isPlaying, currentTrack } = useSelector(selectCurrentPlayer);
    const currentSong = currentTrack.id;
    const [playSong] = usePlaySongMutation();

    const handlePlay = async ({ id, title, artist, imageurl }) => {
        if (currentSong !== id) {
            try {
                const res = await playSong(id).unwrap();
                dispatch(
                    setCurrentTrack({
                        id,
                        title,
                        artist,
                        url: res.audiourl,
                        thumbnail: imageurl.url,
                    }),
                );
                dispatch(play());
            } catch (error) {
                toast.error('Failed to play song');
            }
        } else {
            if (!isPlaying) {
                dispatch(play());
            } else {
                dispatch(pause());
            }
        }
    };

    const myProfileData = useSelector(selectCurrentProfile);
    const myProfileID = myProfileData.id;
    const navigate = useNavigate();
    const handleProfile = (id) => {
        if (myProfileID === id) {
            navigate('/profile');
        } else {
            navigate(`/${id}`);
        }
    };

    const { type, title, visibility, link, data } = media;

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
                        className="media__link text-sm text-[#808080] hover:text-white hover:underline hover:underline-offset-2"
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
                        onClickImage = () => handlePlay(mediaData);
                        onClickButton = onClickImage;
                        isOnPlaying = currentSong == mediaData.id && isPlaying;
                    } else if (type == 'Artist') {
                        onClickImage = () => handleProfile(mediaData.id);
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
        const { title, artist, image, name, imageurl } = mediaData;
        const { url } = image || imageurl;
        const isArtist = type === 'Artist';
        const imageClass = isArtist
            ? 'w-[150px] rounded-full'
            : 'w-[120px] rounded-[30px]';

        return (
            <div className="media-item group grid grid-cols-[170px] grid-rows-[150px_auto_max-content] items-center justify-items-center gap-2">
                <div className="relative h-full">
                    {url ? (
                        <img
                            className={`media-item__image h-full border-[3px] object-cover hover:cursor-pointer ${imageClass}`}
                            src={url}
                            alt={isArtist ? name : title}
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
                <span className="media-item__name text-center">
                    {isArtist ? name : title}
                </span>
                {!isArtist && (
                    <span className="media-item__desc text-center text-sm text-[#808080]">
                        {artist}
                    </span>
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
        const { title, artist, image, id, name, imageurl } = mediaData;
        const { url } = image || imageurl;
        const isArtist = type === 'Artist';
        const imageClass = isArtist ? 'rounded-full' : 'rounded-lg';

        return (
            <div
                className="media-item z-1 group relative aspect-[1/1.3] w-[170px] rounded-lg bg-white bg-opacity-10 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-opacity-20"
                onClick={onClickImage}
            >
                <div className="media-item__content absolute left-4 right-4 top-4 flex flex-col font-medium">
                    <div className="media-item__image relative">
                        <img
                            className={`media-item__img aspect-square w-full object-cover hover:cursor-pointer ${imageClass} pointer-events-none`}
                            src={url}
                            alt={isArtist ? name : title}
                        />
                        <PlayButton
                            onClick={prevent(onClickButton)}
                            isOnPlaying={isOnPlaying}
                        />
                    </div>
                    <span className="media-item__name mt-3 overflow-hidden text-ellipsis text-nowrap text-sm">
                        {isArtist ? name : title}
                    </span>
                    <span className="media-item__desc mt-1 overflow-hidden text-ellipsis text-nowrap text-[13px] text-[#b2b2b2]">
                        {type}
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

const MediaItems4 = memo(({ type, mediaData, onClick, isOnPlaying, index }) => {
    const [duration, setDuration] = useState('0:00');
    const [menuVisible, setMenuVisible] = useState(null);

    const toggleMenu = (index) => {
        setMenuVisible(menuVisible === index ? null : index);
    };

    useEffect(() => {
        if (menuVisible !== null) {
            document.addEventListener('mousedown', toggleMenu);
            return () => document.removeEventListener('mousedown', toggleMenu);
        }
    }, [menuVisible]);

    const { title, view, imageurl, audiourl } = mediaData;
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
        <div className="rounded-ful hover:bg group relative grid w-full grid-cols-[500px_100px_60px_60px] items-center justify-between rounded-full p-2 px-8 transition-colors duration-400 ease-in-out hover:bg-white hover:bg-opacity-25">
            {/* index - img - name */}
            <div className="flex items-center space-x-8">
                <div className="">
                    <PlayButton
                        onClick={onClick}
                        isOnPlaying={isOnPlaying}
                        position="left-6 z-index-10"
                    />
                    <span className="block w-3 group-hover:cursor-pointer">
                        {index + 1}
                    </span>
                </div>
                <img
                    className="aspect-square w-14 object-cover"
                    src={url}
                    alt={title}
                />
                <p className="block w-full">{title}</p>
            </div>
            <span>{view}</span>
            <span>{duration}</span>
            <button className="relative" onClick={() => toggleMenu(index)}>
                <i className="ri-more-fill text-2xl"></i>
                {menuVisible === index && (
                    <div className="absolute right-0 z-[2] mt-2 h-max w-40 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                        <ul>
                            <li className="flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                <i className="ri-share-line text-xl leading-none"></i>
                                <span>Share</span>
                            </li>
                            <li className="flex cursor-pointer space-x-2 rounded-b-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
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

MediaItems4.displayName = 'MediaItems4';
MediaItems4.propTypes = {
    ...MediaItems.propTypes,
    index: PropTypes.number,
};

export { MediaItems, MediaItems2, MediaItems3, MediaItems4 };
