import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Loading, MediaDisplay } from '@components/index';
import {
    useGetPopularAlbumsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistByIdMutation,
    useAddSongToPlaylistMutation,
    useRemoveSongFromPlaylistMutation,
    useGetPlaylistByIdQuery,
    useGetProfileByIdQuery,
} from '@services/api';
import { toast } from 'react-toastify';
import { ReportFrame } from '@components/index';

function PlaylistPage() {
    const { playlistId } = useParams();
    const { data: playlist } = useGetPlaylistByIdQuery(playlistId);
    const { playlist_owner } = playlist || {};
    const { data: owner } = useGetProfileByIdQuery(playlist_owner);
    const [totalTime, setTotalTime] = useState(0);

    // hanlde menu option
    const [showProfileOption, setShowProfileOption] = useState(false);
    const [showReportFrame, setShowReportFrame] = useState(false);
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
        type: 'SongBar',
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
            {showReportFrame && (
                <ReportFrame setShowReportFrame={setShowReportFrame} />
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
                        <div className="relative ml-5 content-center">
                            <p className="text-shadow-1 font-semibold">
                                Playlist
                            </p>
                            <p className="text-shadow-2 text-stroke-1 py-1 font-alfaslabone text-5xl">
                                {name}
                            </p>
                            <p className="text-shadow-1 absolute font-medium">
                                {songs && songs.length <= 1
                                    ? `${songs.length} song`
                                    : `${songs.length} songs`}
                                {' • '}
                                {owner && owner.name}
                                {' • '}
                                {formatDuration(totalTime)}
                                {' • '}
                                2023
                                {/* {followers <= 1
                                ? `${followers} Follower`
                                : followers > 999
                                  ? `${followers.toLocaleString()} Followers`
                                  : `${followers} Followers`}
                            {' • '}
                            {!following
                                ? '0 Following'
                                : `${following.length} Following`} */}
                            </p>
                        </div>
                    </div>
                </div>
                {/* playlist header end */}

                {/* Actions Section */}
                <div className="relative mt-8 flex space-x-6">
                    <button className="h-[70px] min-w-[70px] rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF]">
                        <i className="ri-play-fill ml-1 text-[42px]"></i>
                    </button>
                    <button className="absolute right-4 h-[70px] min-w-[70px]">
                        <i
                            className="bx bx-menu text-[42px]"
                            onClick={() => setShowProfileOption(true)}
                        />
                        {showProfileOption === true && (
                            <div className="menu absolute right-0 z-[2] mt-2 h-max w-44 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                <ul>
                                    <li
                                        className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                        onClick={handleCopyLink}
                                    >
                                        <i className="ri-share-line text-xl leading-none"></i>
                                        <span>Copy link</span>
                                    </li>
                                    <li
                                        className="z-10 flex cursor-pointer space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                        onClick={() => setShowReportFrame(true)}
                                    >
                                        <i className="ri-error-warning-line text-xl leading-none"></i>
                                        <span>Report</span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </button>
                </div>

                {/* Content Section */}
                {songs && (
                    <>
                        <MediaDisplay
                            media={songsDisplay}
                            displayItems="4"
                            displayType="grid auto-rows-auto gap-2"
                        />
                    </>
                )}
            </div>
        </>
    );
}

export default PlaylistPage;
