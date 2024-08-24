import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Loading,
    MediaDisplay,
    ConfirmDeletion,
    BigPlayButton,
    UpdateImageFrame,
    UtilitiesCard,
} from '@components';
import {
    useDeletePlaylistByIdMutation,
    useGetPlaylistByIdQuery,
    useGetProfileByIdQuery,
    useChangePlaylistDescriptionMutation,
    useUploadPlaylistThumbnailMutation,
} from '@services/api';
import { selectCurrentProfile } from '@services/selectors';
import { colors } from '@components/PlaylistThumbnailColor';

function PlaylistPage() {
    const myProfileData = useSelector(selectCurrentProfile);
    const { playlistId } = useParams();
    const { data: playlist } = useGetPlaylistByIdQuery(playlistId, {
        skip: !playlistId,
    });
    const { playlist_owner } = playlist || {};
    const { data: owner } = useGetProfileByIdQuery(playlist_owner, {
        skip: !playlist_owner,
    });
    const [totalTime, setTotalTime] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState(false);

    //handle change thumbnail
    const [showChangeThumbnail, setShowChangeThumbnail] = useState(false);

    // handle change description
    const playlistDescFormRef = useRef(null);
    const [playlistDesc, setPlaylistDesc] = useState('');
    const [showChangeDescription, setShowChangeDescription] = useState(false);
    const [changePlaylistDescription, { isLoading: isLoadingChangeDesc }] =
        useChangePlaylistDescriptionMutation();
    const handleChangeDescription = async () => {
        if (isLoadingChangeDesc) return;
        try {
            setShowChangeDescription(false);
            await changePlaylistDescription({
                playlistId,
                description: playlistDesc,
            }).unwrap();
            toast.success('Playlist description changed successfully');
        } catch (error) {
            console.error(error);
            toast.error('Failed to change playlist description');
        }
    };

    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                playlistDescFormRef.current &&
                !playlistDescFormRef.current.contains(e.target)
            ) {
                setShowChangeDescription(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, []);

    // hanlde menu option
    const [showProfileOption, setShowProfileOption] = useState(false);
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (showProfileOption === true && !e.target.closest('.menu')) {
                setShowProfileOption(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [showProfileOption]);
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            toast('Copied link to clipboard!', {
                className:
                    'bg-home-pattern text-white  font-kodchasan font-bold',
            });
        });
    };
    const handleCopyLink = () => {
        const currentUrl = window.location.href;
        setShowProfileOption(false);
        copyToClipboard(currentUrl);
    };

    const navigate = useNavigate();
    const [removePlayList, { isLoading: isLoadingRemovePlayList }] =
        useDeletePlaylistByIdMutation();
    const handleDeletePlaylist = async (playlistId) => {
        if (isLoadingRemovePlayList) return;
        try {
            await removePlayList(playlistId).unwrap();
            toast.success('Playlist deleted successfully');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete playlist');
        }
    };

    useEffect(() => {
        if (playlist?.songs) {
            const getSongDurations = async () => {
                const durations = await Promise.all(
                    playlist.songs.map(async (song) => {
                        const audio = new Audio(song.audiourl);
                        return new Promise((resolve) => {
                            audio.addEventListener('loadedmetadata', () => {
                                resolve(audio.duration);
                            });
                        });
                    }),
                );
                const totalDuration = durations.reduce(
                    (acc, duration) => acc + duration,
                    0,
                );
                setTotalTime(totalDuration);
            };
            getSongDurations();
        }
    }, [playlist]);

    if (!playlist || !owner) return <Loading />;

    const { name, avatar, songs, description, isAlbum } = playlist;

    //hashing color
    const hashColor = (id) => {
        const hash = (str) => {
            let hash = 5381;
            for (let i = 0; i < str.length; i++) {
                hash = (hash * 33) ^ str.charCodeAt(i);
            }
            return hash >>> 0;
        };
        const index = hash(id) % colors.length;
        return colors[index];
    };
    const hashedColor =
        name === 'Liked Songs' ? '#6D28C6' : hashColor(playlistId);
    const thumbnailColor = `linear-gradient(to bottom, ${hashedColor}, #FFFFFF)`;
    const backgroundColor = `linear-gradient(to bottom, ${hashedColor}, #2F2042)`;

    const songsDisplay = {
        type: 'Song',
        title: '',
        visibility: '',
        link: '',
        data: songs || [],
    };

    const formatDuration = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secondsLeft = Math.floor(seconds % 60);
        return `${hours > 0 ? `${hours}hr` : ''}${minutes} min ${secondsLeft} sec`;
    };

    return (
        <>
            {showChangeThumbnail && (
                <UpdateImageFrame
                    setShowFrame={setShowChangeThumbnail}
                    label="To upload a thumbnail click on box or drop file here!"
                    useUploadMutation={useUploadPlaylistThumbnailMutation}
                    mediaId={playlistId}
                    isThumbnail={true}
                />
            )}
            {showChangeDescription && (
                <div className="fixed left-0 top-0 z-10 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
                    <div
                        ref={playlistDescFormRef}
                        className="relative z-20 cursor-default rounded-[35px] border bg-black p-6 text-center font-kodchasan shadow-lg"
                    >
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
                        <div className="mt-3 flex justify-end">
                            <button
                                className="rounded-lg bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
                                onClick={handleChangeDescription}
                            >
                                Change
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {confirmDelete && (
                <ConfirmDeletion
                    type="playlist"
                    setConfirmAction={setConfirmDelete}
                    confirmActionHandler={() =>
                        handleDeletePlaylist(playlistId)
                    }
                />
            )}
            <div className="caret-transparent">
                {/* playlist header */}
                <div className="h-96 w-full content-center">
                    {/* playlist cover */}
                    <div
                        className="absolute left-20 right-0 top-0 h-96 rounded-xl"
                        style={{ background: backgroundColor }}
                    ></div>
                    <div className="ml-[5%] flex items-center">
                        <div className="relative h-40 min-w-40 max-w-40">
                            {/* playlist avatar */}
                            {avatar?.url && isAlbum ? (
                                <img
                                    className="playlist__avatar h-full w-full object-cover shadow-2xl"
                                    src={avatar?.url}
                                    alt=""
                                />
                            ) : (
                                <i
                                    className={`${name == 'Liked Songs' ? 'ri-heart-line' : 'ri-disc-fill'} block h-full w-full content-center rounded-xl text-center text-8xl leading-none`}
                                    style={{ background: thumbnailColor }}
                                ></i>
                            )}
                        </div>
                        {/* playlist info */}
                        <div className="relative ml-5 h-full w-full cursor-default content-center">
                            <p className="text-shadow-1 font-semibold">
                                {isAlbum ? 'Album' : 'Playlist'}
                            </p>
                            <p className="text-shadow-2 text-stroke-1 py-1 font-alfaslabone text-5xl">
                                {name}
                            </p>

                            <p className="text-shadow-1 flex items-center text-ellipsis whitespace-nowrap text-sm font-medium">
                                {owner && owner?.image?.url ? (
                                    <img
                                        className="mr-4 inline h-7 w-7 rounded-full object-cover"
                                        src={owner.image.url}
                                        alt=""
                                    />
                                ) : (
                                    <i className="bx bxs-user-circle mr-4 aspect-square w-7 text-4xl leading-none"></i>
                                )}
                                {owner && owner.name}
                                {' • '}
                                {songs && songs.length <= 1
                                    ? `${songs.length} song`
                                    : `${songs.length} songs`}
                                {' • '}
                                {formatDuration(totalTime)}
                            </p>
                            {description && (
                                <p className="text-shadow-1 truncate text-sm font-medium text-slate-300">
                                    Description: {description}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* playlist header end */}

                {/* Actions Section */}
                <div className="relative mt-8 flex space-x-6">
                    <BigPlayButton playlist={playlist} />
                    <button className="absolute right-4 h-[70px] min-w-[70px]">
                        <i
                            className="bx bx-menu text-[42px]"
                            onClick={() => setShowProfileOption(true)}
                        />
                        {showProfileOption === true && (
                            <div className="menu absolute right-0 z-[2] mt-2 h-max w-44 overflow-hidden rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                <ul>
                                    {myProfileData?.id == playlist_owner && (
                                        <>
                                            {isAlbum && (
                                                <UtilitiesCard
                                                    icon="ri-image-2-fill"
                                                    title="Change thumbnail"
                                                    handleAction={() => {
                                                        setShowChangeThumbnail(
                                                            true,
                                                        );
                                                        setShowProfileOption(
                                                            false,
                                                        );
                                                    }}
                                                    spanClass="text-left"
                                                />
                                            )}
                                            <UtilitiesCard
                                                icon="ri-draft-line"
                                                title="Change description"
                                                handleAction={() => {
                                                    setShowProfileOption(false);
                                                    setShowChangeDescription(
                                                        true,
                                                    );
                                                }}
                                                spanClass="text-left"
                                            />
                                        </>
                                    )}
                                    <UtilitiesCard
                                        icon="ri-share-line"
                                        title="Copy link"
                                        handleAction={handleCopyLink}
                                    />
                                    {myProfileData?.id == playlist_owner &&
                                        name != 'Liked Songs' && (
                                            <UtilitiesCard
                                                icon="ri-close-large-line"
                                                title={`Delete ${isAlbum ? 'album' : 'playlist'}`}
                                                handleAction={() => {
                                                    setConfirmDelete(true);
                                                    setShowProfileOption(false);
                                                }}
                                                liClass="font-bold text-red-500"
                                            />
                                        )}
                                </ul>
                            </div>
                        )}
                    </button>
                </div>

                {/* Content Section */}
                {songs && songsDisplay?.data.length > 0 ? (
                    <>
                        <MediaDisplay
                            media={songsDisplay}
                            displayItems="4"
                            displayType="grid auto-rows-auto gap-2"
                        />
                    </>
                ) : (
                    <div className="flex h-64 items-center justify-center">
                        <div className="flex flex-col items-center text-center">
                            <span className="mb-4 text-lg">
                                This list is empty! Add some songs to it.
                            </span>
                            <button
                                className="transform rounded border border-white bg-transparent px-4 py-2 text-white transition-transform hover:scale-105 hover:bg-opacity-80 hover:shadow-lg"
                                onClick={() => navigate('/trending')}
                            >
                                <i className="ri-music-fill pr-2" />
                                Explore songs
                                <i className="ri-music-fill pl-2" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default PlaylistPage;
