import { useState, useEffect, memo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import {
    useGetProfileByIdQuery,
    useLazyGetPlaylistByIdQuery,
    useLazyGetProfileAllSongsQuery,
    useCreatePlaylistMutation,
    useAddSongToPlaylistMutation,
    useRemoveSongFromPlaylistMutation,
    useAddSongToLikedPlaylistMutation,
    useGetPlaylistByIdQuery,
    useGetMyPlaylistsQuery,
    useDeleteTrackByIdMutation,
} from '@services/api';
import {
    selectCurrentPlaylist,
    selectCurrentProfile,
    selectCurrentTrack,
    selectCurrentToken,
} from '@services/selectors';
import {
    PlayButton,
    ReportFrame,
    ConfirmDeletion,
    DonateButton,
    DonateModal,
} from '.';
import { useSong } from '@hooks';
import verifiedIcon from '@assets/img/verified-icon-white.svg';
import { toast } from 'react-toastify';
import { setCurrentPlaylist } from '@features/playlists/slices';

const MediaDisplay = memo(({ media, displayItems, displayType }) => {
    const dispatch = useDispatch();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const { currentSong, isPlaying, activateSong } = useSong();

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

    const handleSong = (id) => {
        navigate(`/song/${id}`);
    };

    const { id, type, title, visibility, link, data } = media;
    let showedData = data;
    if (type.includes('Home')) {
        showedData = data.slice(0, 6);
        if (type.includes('Artist')) {
            showedData = data.slice(0, 5);
        }
    }

    const handlePlayClick = (mediaData) => {
        if (
            !currentPlaylist.id ||
            (currentPlaylist.id !== id &&
                currentPlaylist.id !== type + title + data.length)
        ) {
            dispatch(
                setCurrentPlaylist({
                    id: id ?? type + title + data.length,
                    songs: data,
                }),
            );
        }
        activateSong(mediaData);
    };

    const [triggerGetArtistSongs] = useLazyGetProfileAllSongsQuery();
    const currentTrack = useSelector(selectCurrentTrack);

    const handleArtistPlayClick = async (artistId) => {
        if (!currentPlaylist.id || currentPlaylist.id !== artistId) {
            try {
                const { data: artistSongs } =
                    await triggerGetArtistSongs(artistId);
                dispatch(
                    setCurrentPlaylist({
                        id: artistId,
                        songs: artistSongs,
                    }),
                );
                activateSong(artistSongs[0]);
            } catch (error) {
                console.log('Error fetching artist songs:', error);
            }
        } else activateSong(currentTrack);
    };

    const [triggerGetPlaylistSongs] = useLazyGetPlaylistByIdQuery();

    const handlePlaylistPlayClick = async (playlistId) => {
        if (!currentPlaylist.id || currentPlaylist.id !== playlistId) {
            try {
                const { data: playlist } =
                    await triggerGetPlaylistSongs(playlistId);
                const playlistSongs = playlist.songs;
                dispatch(
                    setCurrentPlaylist({
                        id: playlistId,
                        songs: playlistSongs,
                    }),
                );
                activateSong(playlistSongs[0]);
            } catch (error) {
                console.log('Error fetching playlist songs:', error);
            }
        } else activateSong(currentTrack);
    };

    if (!data || !data.length) return;

    return media ? (
        <section className="media__display grid grid-rows-[min-content_auto]">
            {/* media title container*/}
            <h2 className="media__title-container flex items-center justify-between">
                {/* media tile */}
                {title && (
                    <p className="media__title space-x-3 text-3xl">
                        <span className="media__title-name select-none font-bold">
                            {title}
                        </span>
                        <span className="media__title-visibility italic">
                            {visibility}
                        </span>
                    </p>
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
            </h2>
            {/* Media content */}
            <div className={`${displayType} mt-4 justify-items-center`}>
                {showedData.map((mediaData, index) => {
                    let MediaComponent;
                    switch (displayItems) {
                        case '1':
                            MediaComponent = HomeCard;
                            break;
                        case '2':
                            MediaComponent = DetailCard;
                            break;
                        case '3':
                            MediaComponent = BrowseCard;
                            break;
                        case '4':
                            MediaComponent = SongBar;
                            break;
                        default:
                            MediaComponent = HomeCard;
                    }

                    let onClickImage, onClickButton, isOnPlaying;
                    if (type.includes('Song')) {
                        onClickImage = () => handleSong(mediaData.id);
                        onClickButton = () => handlePlayClick(mediaData);
                        isOnPlaying = currentSong == mediaData.id && isPlaying;
                    } else if (type.includes('Artist')) {
                        onClickImage = () => handleProfile(mediaData.id);
                        onClickButton = () =>
                            handleArtistPlayClick(mediaData.id);
                        isOnPlaying =
                            currentPlaylist.id == mediaData.id && isPlaying;
                    } else if (
                        type.includes('Album') ||
                        type.includes('Playlist')
                    ) {
                        onClickImage = () => handlePlaylist(mediaData.id);
                        onClickButton = () =>
                            handlePlaylistPlayClick(mediaData.id);
                        isOnPlaying =
                            currentPlaylist.id == mediaData.id && isPlaying;
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
        id: PropTypes.string,
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

const HomeCard = memo(
    ({ type, mediaData, onClickImage, onClickButton, isOnPlaying }) => {
        // Song
        const { title, artist, image } = mediaData;
        // Artist
        const { name, imageurl } = mediaData;
        // Album
        const { playlist_owner } = mediaData;
        const { data: owner } = useGetProfileByIdQuery(playlist_owner, {
            skip: !playlist_owner,
        });
        // image
        const { url } = image || imageurl;

        if (type.includes('Album') && !owner) return null;

        let imageClass = 'w-[130px] rounded-[30px]';
        let card_title, card_desc;
        if (type.includes('Artist')) {
            imageClass = 'w-[160px] rounded-full';
            card_title = name;
            card_desc = '';
        } else if (type.includes('Song')) {
            card_title = title;
            card_desc = artist;
        } else if (type.includes('Album')) {
            card_title = name;
            card_desc = owner.name;
        }

        return (
            <div className="media-item group w-full flex-col space-y-2 hover:cursor-pointer">
                <div className="relative m-auto w-[160px]">
                    {url ? (
                        <img
                            className={`media-item__image hover: m-auto h-[160px] border-[3px] object-cover ${imageClass}`}
                            src={url}
                            alt={card_title}
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
                        position={
                            type.includes('Artist')
                                ? 'bottom-1 right-0'
                                : 'bottom-1 right-5'
                        }
                    />
                </div>
                <p className="media-item__name overflow-hidden text-ellipsis text-nowrap text-center">
                    {card_title}
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

HomeCard.displayName = 'ArtistCard';
HomeCard.propTypes = {
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
    onClickImage: PropTypes.func,
    onClickButton: PropTypes.func,
    isOnPlaying: PropTypes.bool,
};

const DetailCard = memo(
    ({ type, mediaData, onClickImage, onClickButton, isOnPlaying }) => {
        // Song
        const { title, image } = mediaData;
        // Artist
        const { name, imageurl } = mediaData;
        // Album: name, image
        const { url } = image || imageurl;

        // assign data to card
        let imageClass = 'rounded-lg';
        let card_title,
            card_desc = type;
        if (type.includes('Artist')) {
            imageClass = 'rounded-full';
            card_title = name;
        } else if (type.includes('Song')) {
            card_title = title;
        } else if (type.includes('Album') || type.includes('Playlist')) {
            card_title = name;
        }

        return (
            <div
                className="media-item z-1 hover: group relative aspect-[1/1.3] w-[170px] rounded-lg bg-white bg-opacity-10 transition-all duration-300 ease-in-out hover:cursor-pointer hover:bg-opacity-20"
                onClick={onClickImage}
            >
                <div className="media-item__content absolute left-4 right-4 top-4 flex flex-col font-medium">
                    <div className="media-item__image relative">
                        <img
                            className={`${imageClass} media-item__img hover: pointer-events-none aspect-square w-full object-cover`}
                            src={url}
                            alt={card_title}
                        />
                        <PlayButton
                            onClick={prevent(onClickButton)}
                            isOnPlaying={isOnPlaying}
                        />
                    </div>
                    <span className="media-item__name mt-3 overflow-hidden text-ellipsis text-nowrap text-sm">
                        {card_title}
                    </span>
                    <span className="media-item__desc mt-1 overflow-hidden text-ellipsis text-nowrap text-[13px] text-[#b2b2b2]">
                        {card_desc}
                    </span>
                </div>
            </div>
        );
    },
);

DetailCard.displayName = 'DetailCard';
DetailCard.propTypes = HomeCard.propTypes;

const BrowseCard = memo(({ type, mediaData }) => {
    // extract data
    const { title, imageurl, bgColor } = mediaData;
    const propsDiv =
        type === 'genre'
            ? 'col-span-2 aspect-[2/1]'
            : 'col-span-1 aspect-[8/7]';
    const propsSpan = type === 'genre' ? 'top-5 text-4xl' : 'top-3 text-2xl';
    const bgClass = bgColor ? `bg-[${bgColor}]` : 'bg-pink-500';

    // nevigate
    const navigate = useNavigate();

    return (
        <div
            className={`media-item-3 relative w-full overflow-hidden rounded-md ${bgClass} hover:cursor-pointer hover:shadow-md ${propsDiv}`}
            style={{ backgroundColor: bgColor }}
            onClick={() =>
                navigate(`/topicsgenre/${title}`, {
                    state: { title },
                })
            }
        >
            <img
                className={`media-item-3__img absolute bottom-0 right-0 aspect-square h-[6.5rem] translate-x-3 translate-y-3 rotate-[30deg]`}
                src={imageurl.url}
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

BrowseCard.displayName = 'BrowseCard';
BrowseCard.propTypes = HomeCard.propTypes;

const SongBar = memo(
    ({ mediaData, onClickImage, onClickButton, isOnPlaying, index }) => {
        const token = useSelector(selectCurrentToken);
        const { id: myProfileID } = useSelector(selectCurrentProfile);
        const [duration, setDuration] = useState('0:00');
        const [menuVisible, setMenuVisible] = useState(null);
        const [showReportFrame, setShowReportFrame] = useState(false);
        const [showPlaylistForm, setShowPlaylistForm] = useState(false);
        const playlistFormRef = useRef(null);
        const [playlistOptionsVisible, setPlaylistOptionsVisible] =
            useState(false);
        const [playlistName, setPlaylistName] = useState('');
        const [playlistDesc, setPlaylistDesc] = useState('');
        const [confirmDelete, setConfirmDelete] = useState(false);

        const location = useLocation();
        const pathSegments = location.pathname.split('/');
        const pathtype = pathSegments[1];
        const { profileId, playlistId } = useParams();
        const pathId = profileId || playlistId;

        const toggleMenu = (index) => {
            setMenuVisible(menuVisible === index ? null : index);
        };

        useEffect(() => {
            const handleOutsideClick = (e) => {
                if (
                    playlistFormRef.current &&
                    !playlistFormRef.current.contains(e.target)
                ) {
                    setShowPlaylistForm(false);
                }
            };

            document.addEventListener('mousedown', handleOutsideClick);
            return () =>
                document.removeEventListener('mousedown', handleOutsideClick);
        }, []);

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

        const { id, title, artist, view, imageurl, audiourl, isverified } =
            mediaData;
        const { url } = imageurl;

        useEffect(() => {
            if (audiourl) {
                const audio = new Audio(audiourl);
                audio.addEventListener('loadedmetadata', () => {
                    const minutes = Math.floor(audio.duration / 60);
                    const seconds = Math.floor(audio.duration % 60);
                    setDuration(
                        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
                    );
                });
            }
        }, [audiourl]);

        // handle share button
        const copyToClipboard = (text) => {
            navigator.clipboard.writeText(text).then(() => {
                toast('Copied link to clipboard!', {
                    className:
                        'bg-home-pattern text-white font-kodchasan font-bold',
                });
            });
        };
        const handleShare = () => {
            const shareURL = `${window.location.origin}/song/${id}`;
            copyToClipboard(shareURL);
        };

        // handle api playlist
        const { data: playlistData } = useGetPlaylistByIdQuery(playlistId, {
            skip: !playlistId,
        });

        const { data: myPlayListData, isLoading: isLoadingMyPlayListData } =
            useGetMyPlaylistsQuery(myProfileID, {
                skip: !myProfileID,
            });

        const [creatPlayList, { isLoading: createPlaylistLoading }] =
            useCreatePlaylistMutation();
        const handleCreatePlaylist = async (name, desc) => {
            if (createPlaylistLoading) return;
            try {
                await creatPlayList({ name, desc }).unwrap();
                toast.success('Playlist created successfully!');
            } catch (error) {
                console.error('Failed to create playlist:', error);
                toast.error(`${error.data.message}!`);
            }
        };
        const handleSubmitCreatePlaylist = () => {
            setShowPlaylistForm(false);
            const name = String(playlistName).trim();
            const desc = String(playlistDesc).trim();
            handleCreatePlaylist(name, desc);
        };

        const [addSongToPlaylist, { isLoading: addSongToPlaylistLoading }] =
            useAddSongToPlaylistMutation();
        const handleAddToPlaylist = async (
            playlistId,
            songId,
            songName,
            playlistName,
        ) => {
            if (addSongToPlaylistLoading) return;
            try {
                await addSongToPlaylist({ playlistId, songId }).unwrap();
                toast.success(
                    `${songName} added to playlist ${playlistName} successfully!`,
                );
            } catch (error) {
                console.error('Failed to add song to playlist:', error);
                toast.error(`${error.data.message}!`);
            }
        };

        const [
            removeSongFromPlaylist,
            { isLoading: removeSongFromPlaylistLoading },
        ] = useRemoveSongFromPlaylistMutation();
        const handleRemoveFromPlaylist = async (playlistId, songId) => {
            if (removeSongFromPlaylistLoading) return;
            try {
                await removeSongFromPlaylist({ playlistId, songId }).unwrap();
                toast.success('Song removed from playlist successfully!');
            } catch (error) {
                console.error('Failed to remove song from playlist:', error);
                toast.error(`${error.data.message}!`);
            }
        };

        const [
            addSongToLikedPlaylist,
            { isLoading: addSongToLikedPlaylistLoading },
        ] = useAddSongToLikedPlaylistMutation();
        const handleAddToLikedSongs = async (id, songName) => {
            if (addSongToLikedPlaylistLoading) return;
            try {
                await addSongToLikedPlaylist(id).unwrap();
                toast.success(`${songName} added to liked songs successfully!`);
            } catch (error) {
                console.error('Failed to add song to liked songs:', error);
                toast.error(`${error.data.message}!`);
            }
        };
        const [removeSongById, { isLoading: removeSongIsLoading }] =
            useDeleteTrackByIdMutation();
        const handleRemoveSong = async (id) => {
            if (removeSongIsLoading) return;
            try {
                setConfirmDelete(false);
                await removeSongById(id).unwrap();
                toast.success('Song removed successfully!');
            } catch (error) {
                console.log('Failed to remove song', error);
                toast.error(`${error.data.message}!`);
            }
        };

        const { currentSong } = useSong();
        const titleClassName =
            currentSong === id ? 'text-purple-400 font-bold' : '';

        const { balance } = useSelector(selectCurrentProfile);
        const [modalVisible, setModalVisible] = useState(false);
        const openDonateModal = () => {
            setModalVisible(true);
        };
        const closeDonateModal = () => {
            setModalVisible(false);
        };

        return (
            <>
                {confirmDelete && (
                    <ConfirmDeletion
                        type="song"
                        setConfirmAction={setConfirmDelete}
                        confirmActionHandler={() => handleRemoveSong(id)}
                    />
                )}
                {showReportFrame && (
                    <ReportFrame
                        setShowReportFrame={setShowReportFrame}
                        cardSongId={id}
                    />
                )}
                {showPlaylistForm && (
                    <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
                        <div
                            ref={playlistFormRef}
                            className="relative z-20 cursor-default rounded-[35px] border bg-black p-6 text-center font-kodchasan shadow-lg"
                        >
                            <div>
                                <label
                                    htmlFor="playlistName"
                                    className="block pb-2 text-left text-base"
                                >
                                    Create a name for your playlist:
                                </label>
                                <input
                                    id="playlistName"
                                    type="text"
                                    onChange={(e) =>
                                        setPlaylistName(e.target.value)
                                    }
                                    className="w-full border-b bg-transparent focus:border-slate-500 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="playlistName"
                                    className="block pb-2 text-left text-base"
                                >
                                    Description for your playlist:
                                </label>
                                <textarea
                                    id="playlistName"
                                    rows="4"
                                    cols="50"
                                    onChange={(e) =>
                                        setPlaylistDesc(e.target.value)
                                    }
                                    className="h-16 w-80 resize-none border-b bg-transparent focus:border-slate-500 focus:outline-none"
                                />
                            </div>
                            <div className="m-2 flex justify-end">
                                <button
                                    className="rounded-lg bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
                                    onClick={handleSubmitCreatePlaylist}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="rounded-ful hover:bg hover: group relative grid w-full grid-cols-[500px_100px_60px_120px] items-center justify-between rounded-full p-2 px-8 transition-colors duration-300 ease-in-out hover:bg-white hover:bg-opacity-25">
                    {/* index - img - name */}
                    <div className="flex items-center space-x-8">
                        <div className="">
                            <PlayButton
                                onClick={onClickButton}
                                isOnPlaying={isOnPlaying}
                                position="left-6"
                            />
                            <span className="group-hover: block w-3">
                                {index + 1}
                            </span>
                        </div>
                        <img
                            className="h-14 min-w-14 max-w-14 object-cover"
                            src={url}
                            alt={title}
                        />
                        <p
                            className={`flex w-full items-center space-x-3 ${titleClassName} hover:cursor-pointer hover:underline`}
                            onClick={onClickImage}
                        >
                            {title}
                            {isverified && (
                                <img
                                    className="profile__verified-icon ml-4 h-5 w-5"
                                    src={verifiedIcon}
                                    alt="vrf-icon"
                                />
                            )}
                        </p>
                    </div>
                    <span className="hover:cursor-default">{view}</span>
                    <span className="hover:cursor-default">{duration}</span>
                    <div className="flex items-center justify-end">
                        <DonateButton
                            className="text-white"
                            openDonateModal={openDonateModal}
                            song={title}
                            artist={artist}
                        />
                        <button
                            className="relative flex-[1]"
                            onClick={prevent(() => toggleMenu(index))}
                        >
                            <i
                                className="bx bx-dots-horizontal-rounded relative text-2xl transition-all duration-75 ease-in-out hover:scale-125"
                                data-title={`More options for ${title} by ${artist}`}
                            ></i>
                            {menuVisible === index && (
                                <div
                                    className={`menu absolute ${playlistOptionsVisible ? 'right-24' : 'right-0'} z-30 mt-2 h-max w-48 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md`}
                                >
                                    <ul>
                                        {token && (
                                            <li
                                                className="flex space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                onMouseEnter={() =>
                                                    setPlaylistOptionsVisible(
                                                        true,
                                                    )
                                                }
                                                onMouseLeave={() =>
                                                    setPlaylistOptionsVisible(
                                                        false,
                                                    )
                                                }
                                            >
                                                <i className="ri-add-circle-line text-xl leading-none"></i>
                                                <span>Add to playlist</span>
                                                <i className="ri-triangle-line rotate-90 text-right"></i>
                                                {playlistOptionsVisible && (
                                                    <div className="absolute left-[180px] top-[-10px] z-[2] mt-2 w-48 overflow-hidden rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                                        <ul>
                                                            <li className="flex space-x-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                                                <div
                                                                    className={`mx-4 w-full py-2 text-left ${myPlayListData?.playlists?.length > 1 ? 'border-b border-[#999]' : ''}`}
                                                                    onClick={() => {
                                                                        setShowPlaylistForm(
                                                                            true,
                                                                        );
                                                                        setPlaylistOptionsVisible(
                                                                            false,
                                                                        );
                                                                    }}
                                                                >
                                                                    <i className="ri-add-circle-line" />
                                                                    <span>
                                                                        New
                                                                        playlist
                                                                    </span>
                                                                </div>
                                                            </li>
                                                            {myPlayListData?.playlists?.map(
                                                                (
                                                                    playlist,
                                                                    index,
                                                                ) => {
                                                                    if (
                                                                        playlist.name ===
                                                                        'Liked Songs'
                                                                    ) {
                                                                        return null;
                                                                    }
                                                                    return (
                                                                        <li
                                                                            key={
                                                                                index
                                                                            }
                                                                            className="flex space-x-2 px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                                            onClick={() => {
                                                                                handleAddToPlaylist(
                                                                                    playlist.id,
                                                                                    id,
                                                                                    title,
                                                                                    playlist.name,
                                                                                );
                                                                            }}
                                                                        >
                                                                            <span>
                                                                                {
                                                                                    playlist.name
                                                                                }
                                                                            </span>
                                                                        </li>
                                                                    );
                                                                },
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                        )}
                                        {pathtype == 'profile' &&
                                            pathId == undefined && (
                                                <li className="flex space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                                    <i className="ri-add-circle-line text-xl leading-none"></i>
                                                    <span>Add to album</span>
                                                </li>
                                            )}
                                        {pathtype == 'playlist' &&
                                            playlistData &&
                                            myProfileID ==
                                                playlistData?.playlist_owner && (
                                                <li
                                                    className="flex items-center justify-center space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                    onClick={prevent(() =>
                                                        handleRemoveFromPlaylist(
                                                            pathId,
                                                            id,
                                                        ),
                                                    )}
                                                >
                                                    <i className="ri-indeterminate-circle-line text-left text-xl"></i>
                                                    <span className="text-left">
                                                        Remove from this
                                                        playlist
                                                    </span>
                                                </li>
                                            )}
                                        {token && (
                                            <li
                                                className="flex items-center justify-center space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                onClick={prevent(() =>
                                                    handleAddToLikedSongs(
                                                        id,
                                                        title,
                                                    ),
                                                )}
                                            >
                                                <i className="ri-heart-line text-left text-xl"></i>
                                                <span className="text-left">
                                                    Save to your Liked Songs
                                                </span>
                                            </li>
                                        )}
                                        <li
                                            className="flex space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                            onClick={prevent(() =>
                                                handleShare(),
                                            )}
                                        >
                                            <i className="ri-share-line text-xl leading-none"></i>
                                            <span>Copy link</span>
                                        </li>
                                        {token && (
                                            <li
                                                className="flex space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                onClick={prevent(() =>
                                                    setShowReportFrame(true),
                                                )}
                                            >
                                                <i className="ri-error-warning-line text-xl leading-none"></i>
                                                <span>Report</span>
                                            </li>
                                        )}
                                        {pathtype == 'profile' &&
                                            !isverified &&
                                            pathId == undefined && (
                                                <li
                                                    className="flex space-x-2 rounded-b-xl border-[#999] px-4 py-2 font-bold text-red-500 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                    onClick={() =>
                                                        setConfirmDelete(
                                                            !confirmDelete,
                                                        )
                                                    }
                                                >
                                                    <i className="ri-close-large-line text-xl leading-none"></i>
                                                    <span>Delete Track</span>
                                                </li>
                                            )}
                                    </ul>
                                </div>
                            )}
                        </button>
                    </div>
                </div>
                {modalVisible && (
                    <DonateModal
                        balance={balance}
                        closeDonateModal={closeDonateModal}
                        song={title}
                        artist={artist}
                    />
                )}
            </>
        );
    },
);

SongBar.displayName = 'SongBar';
SongBar.propTypes = {
    ...HomeCard.propTypes,
    index: PropTypes.number,
};

export { HomeCard, DetailCard, BrowseCard, SongBar };
