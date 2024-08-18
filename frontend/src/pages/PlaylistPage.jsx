import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    Loading,
    MediaDisplay,
    ConfirmDeletion,
    BigPlayButton,
} from '@components';
import {
    useDeletePlaylistByIdMutation,
    useGetPlaylistByIdQuery,
    useGetProfileByIdQuery,
} from '@services/api';
import { selectCurrentProfile } from '@services/selectors';

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
        if (isLoadingRemovePlayList) return <Loading />;
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

    const { name, avatar, cover, songs } = playlist;

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
                    {cover ? (
                        <div className="absolute left-20 right-0 top-0 h-96">
                            <img
                                className="playlist__cover h-full w-full rounded-xl object-cover shadow-2xl"
                                src={cover}
                                alt=""
                            />
                        </div>
                    ) : (
                        <div className="absolute left-20 right-0 top-0 h-96 rounded-xl bg-gradient-to-b from-[#7751A8] to-[#2F2042]"></div>
                    )}
                    <div className="ml-[5%] flex items-center">
                        <div className="relative h-40 min-w-40 max-w-40">
                            {/* playlist avatar */}
                            {avatar ? (
                                <img
                                    className="playlist__avatar h-full w-full object-cover shadow-2xl"
                                    src={avatar}
                                    alt=""
                                />
                            ) : (
                                <i className="ri-heart-line block h-full w-full content-center rounded-xl bg-gradient-to-b from-[#6D28C6] to-[#FFFFFF] text-center text-8xl leading-none"></i>
                            )}
                        </div>
                        {/* playlist info */}
                        <div className="relative ml-5 w-full cursor-default content-center">
                            <p className="text-shadow-1 font-semibold">
                                Playlist
                            </p>
                            <p className="text-shadow-2 text-stroke-1 py-1 font-alfaslabone text-5xl">
                                {name}
                            </p>
                            <p className="text-shadow-1 absolute flex items-center text-ellipsis whitespace-nowrap text-sm font-medium">
                                {owner && owner?.imageurl?.url ? (
                                    <img
                                        className="mr-4 inline h-7 w-7 rounded-full object-cover"
                                        src={owner.imageurl.url}
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
                                {owner && owner.name}
                                {' • '}
                                {formatDuration(totalTime)}
                            </p>
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
                            <div className="menu absolute right-0 z-[2] mt-2 h-max w-44 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                <ul>
                                    <li className="flex items-center space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                        <i className="ri-image-2-fill text-xl leading-none"></i>
                                        <span className="text-left text-sm">
                                            Change thumbnail
                                        </span>
                                    </li>
                                    <li className="flex items-center space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                        <i className="ri-draft-line text-xl leading-none"></i>
                                        <span className="text-left text-sm">
                                            Change description
                                        </span>
                                    </li>
                                    <li
                                        className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                        onClick={handleCopyLink}
                                    >
                                        <i className="ri-share-line text-xl leading-none"></i>
                                        <span>Copy link</span>
                                    </li>
                                    {myProfileData?.id == playlist_owner &&
                                        name != 'Liked Songs' && (
                                            <li
                                                className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 font-bold text-red-500 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                onClick={() =>
                                                    setConfirmDelete(true)
                                                }
                                            >
                                                <i className="ri-close-large-line text-xl leading-none"></i>
                                                <span>Delete playlist</span>
                                            </li>
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
