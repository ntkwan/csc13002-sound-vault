import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
    useGetSongByIdQuery,
    useGetProfileByIdQuery,
    useGetProfileAllSongsQuery,
    useDeleteTrackByIdMutation,
} from '@services/api';
import {
    MediaDisplay,
    BigPlayButton,
    ReportFrame,
    ConfirmDeletion,
    Loading,
} from '@components';
import {
    selectCurrentAdmin,
    selectCurrentProfile,
    selectCurrentToken,
} from '@services/selectors';
import verifiedIcon from '@assets/img/verified-icon-white.svg';

function SongPage() {
    const isAdmin = useSelector(selectCurrentAdmin);
    const token = useSelector(selectCurrentToken);
    const myProfileData = useSelector(selectCurrentProfile);
    const [duration, setDuration] = useState('0:00');
    const [showReportFrame, setShowReportFrame] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [showSongOptions, setShowSongOptions] = useState(false);
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (showSongOptions === true && !e.target.closest('.menu')) {
                setShowSongOptions(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [showSongOptions]);

    const { songId } = useParams();
    const { data: songByIdData, isLoading: songByIdDataLoading } =
        useGetSongByIdQuery(songId, {
            skip: !songId,
        });

    const {
        title: songTitle,
        artist: songArtist,
        imageurl: { url: songAvatar } = {},
        coverimg: { url: songCoverimg } = {},
        view: songView,
        region: songRegion,
        uploader: songUploader,
        audiourl: songAudiourl,
        isverified: songIsVerified,
        isdisabled: songIsDisabled,
        createdAt: songCreatedAt,
    } = songByIdData || {};
    const formattedSongCreatedAt = songCreatedAt
        ? new Date(songCreatedAt).toLocaleDateString()
        : '';

    const { data: profileByIdData, isLoading: profileByIdDataLoading } =
        useGetProfileByIdQuery(songUploader, {
            skip: !songUploader,
        });

    const { id: profileId, image: { url: profileImageUrl } = {} } =
        profileByIdData || {};

    const { data: profileAllSongsData, isLoading: profileAllSongsLoading } =
        useGetProfileAllSongsQuery(profileId, {
            skip: !profileId,
        });

    const allSongExceptCurrent = profileAllSongsData?.filter(
        (song) => song.id !== songId,
    );

    const allReleases = {
        type: 'Song',
        title: songArtist,
        visibility: '',
        data: allSongExceptCurrent ? allSongExceptCurrent.slice(0, 6) : [],
    };

    useEffect(() => {
        if (songAudiourl) {
            const audio = new Audio(songAudiourl);
            audio.addEventListener('loadedmetadata', () => {
                const minutes = Math.floor(audio.duration / 60);
                const seconds = Math.floor(audio.duration % 60);
                setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
            });
        }
    }, [songAudiourl]);

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
        setShowSongOptions(false);
        copyToClipboard(currentUrl);
    };

    const [deleteTrackById, { isLoading: isLoadingDeleteTrackById }] =
        useDeleteTrackByIdMutation();
    const handleDeleteTrack = async (id) => {
        if (isLoadingDeleteTrackById) return;
        try {
            await deleteTrackById(id).unwrap();
            setConfirmDelete(false);
            toast.success('Song deleted successfully');
            navigate('/');
        } catch (error) {
            toast.error('Failed to delete song', error);
        }
    };

    const navigate = useNavigate();
    const handleArtist = (id) => {
        navigate(`/profile/${id}`);
    };

    if (
        songByIdDataLoading ||
        profileByIdDataLoading ||
        profileAllSongsLoading
    ) {
        return <Loading />;
    }

    return (
        <>
            {confirmDelete && (
                <ConfirmDeletion
                    type="song"
                    setConfirmAction={setConfirmDelete}
                    confirmActionHandler={() => handleDeleteTrack(songId)}
                />
            )}
            {showReportFrame && (
                <ReportFrame setShowReportFrame={setShowReportFrame} />
            )}
            <div className={isAdmin ? 'pointer-events-none' : ''}>
                <div className="caret-transparent">
                    <div className="h-96 w-full content-center">
                        {songCoverimg ? (
                            <div className="absolute left-20 right-0 top-0 h-96">
                                {!songIsDisabled ? (
                                    <img
                                        className="song__cover h-full w-full rounded-xl object-cover shadow-2xl brightness-75"
                                        src={songCoverimg}
                                        alt="cover"
                                    />
                                ) : (
                                    <div className="song__cover h-full w-full rounded-xl bg-transparent object-cover shadow-2xl brightness-75" />
                                )}
                            </div>
                        ) : (
                            <div className="absolute left-20 right-0 top-0 h-96 rounded-xl bg-gradient-to-b from-[#7751A8] to-[#2F2042]" />
                        )}
                        <div className="ml-[5%] flex items-center">
                            <div className="relative h-52 min-w-52 max-w-52">
                                {!songIsDisabled ? (
                                    <>
                                        {songAvatar ? (
                                            <img
                                                className="playlist__avatar h-full w-full rounded-sm object-cover shadow-2xl"
                                                src={songAvatar}
                                                alt=""
                                            />
                                        ) : (
                                            <i className="ri-heart-line block h-full w-full content-center rounded-sm bg-gradient-to-b from-[#6D28C6] to-[#FFFFFF] text-center text-8xl leading-none"></i>
                                        )}
                                    </>
                                ) : (
                                    <i className="bx bx-error-circle block h-full w-full content-center rounded-sm text-center text-[150px] leading-none"></i>
                                )}

                                {songIsVerified && !songIsDisabled && (
                                    <img
                                        className="profile__verified-icon absolute bottom-[6px] right-0 h-8 w-8"
                                        src={verifiedIcon}
                                        alt="vrf-icon"
                                    />
                                )}
                            </div>
                            <div className="relative ml-5 cursor-default content-center">
                                <p className="text-shadow-1 font-semibold">
                                    Song
                                </p>
                                <p className="text-shadow-2 text-stroke-1 py-1 font-alfaslabone text-6xl">
                                    {songTitle}
                                </p>
                                {!songIsDisabled && (
                                    <p className="text-shadow-1 absolute flex items-center text-ellipsis whitespace-nowrap font-medium">
                                        {profileImageUrl ? (
                                            <img
                                                className="mx-2 inline h-7 min-w-7 rounded-full object-cover"
                                                src={profileImageUrl}
                                                alt=""
                                            />
                                        ) : (
                                            <i className="bx bxs-user-circle mx-2 aspect-square w-7 text-4xl leading-none"></i>
                                        )}
                                        {songArtist}
                                        {' • '}
                                        {songTitle}
                                        {' • '}
                                        {songRegion}
                                        {' • '}
                                        {formattedSongCreatedAt}
                                        {' • '}
                                        {duration}
                                        {' • '}
                                        {songView} plays
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* playlist header end */}
                    {/* Actions Section */}
                    {!songIsDisabled ? (
                        <>
                            {!isAdmin && (
                                <div className="relative mt-8 flex space-x-6">
                                    {allSongExceptCurrent && (
                                        <BigPlayButton
                                            playlist={{
                                                id: songUploader,
                                                songs: allSongExceptCurrent,
                                            }}
                                            forSongPage={true}
                                            thisSong={{
                                                id: songId,
                                                title: songTitle,
                                                artist: songArtist,
                                                imageurl:
                                                    songByIdData?.imageurl,
                                                coverimg:
                                                    songByIdData?.coverimg,
                                            }}
                                        />
                                    )}
                                    <button className="relative h-[70px] min-w-[70px]">
                                        <div className="rotate-90">
                                            <i
                                                className="ri-more-2-line text-[42px]"
                                                onClick={() =>
                                                    setShowSongOptions(
                                                        !showSongOptions,
                                                    )
                                                }
                                            />
                                        </div>
                                        {showSongOptions === true && (
                                            <div className="menu absolute left-10 top-9 z-[2] mt-2 h-max w-44 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                                <ul>
                                                    <li
                                                        className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                        onClick={handleCopyLink}
                                                    >
                                                        <i className="ri-share-line text-xl leading-none"></i>
                                                        <span>Copy link</span>
                                                    </li>
                                                    {myProfileData?.id ==
                                                        songUploader && (
                                                        <li className="flex space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                                            <i className="ri-exchange-line text-xl leading-none"></i>
                                                            <span>
                                                                Change cover
                                                            </span>
                                                        </li>
                                                    )}
                                                    {myProfileData?.id ==
                                                        songUploader && (
                                                        <li className="flex items-center space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                                                            <i className="ri-exchange-fill text-xl leading-none"></i>
                                                            <span className="text-left text-sm">
                                                                Change thumbnail
                                                            </span>
                                                        </li>
                                                    )}
                                                    {token && (
                                                        <li
                                                            className="z-10 flex cursor-pointer space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                            onClick={() => {
                                                                setShowReportFrame(
                                                                    true,
                                                                );
                                                                setShowSongOptions(
                                                                    false,
                                                                );
                                                            }}
                                                        >
                                                            <i className="ri-error-warning-line text-xl leading-none"></i>
                                                            <span>Report</span>
                                                        </li>
                                                    )}
                                                    {myProfileData?.id ==
                                                        songUploader && (
                                                        <li
                                                            className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 font-bold text-red-500 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                            onClick={() =>
                                                                setConfirmDelete(
                                                                    true,
                                                                )
                                                            }
                                                        >
                                                            <i className="ri-close-large-line text-xl leading-none"></i>
                                                            <span>
                                                                Delete track
                                                            </span>
                                                        </li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            )}
                            <div
                                className="hover:bg my-5 flex max-w-80 rounded-md px-2 transition-all duration-300 ease-in-out hover:bg-white hover:bg-opacity-25"
                                onClick={() => handleArtist(profileId)}
                            >
                                <div className="relative mx-3 h-20 min-w-20 max-w-20">
                                    {/* playlist avatar */}
                                    {profileImageUrl ? (
                                        <img
                                            className="playlist__avatar h-full w-full rounded-full object-cover shadow-2xl"
                                            src={profileImageUrl}
                                            alt=""
                                        />
                                    ) : (
                                        <i className="bx bxs-user-circle block h-full w-full content-center rounded-full text-center text-7xl leading-none"></i>
                                    )}
                                </div>

                                <div className="flex cursor-pointer flex-col justify-center">
                                    <p className="text-shadow-1 font-semibold">
                                        Artist
                                    </p>
                                    <p className="text-shadow-2 font-bold hover:underline hover:underline-offset-2">
                                        {songArtist}
                                    </p>
                                </div>
                            </div>
                            <p className="pb-2 text-[27px] font-medium">
                                Popular Tracks by
                            </p>
                            <MediaDisplay
                                media={allReleases}
                                displayItems="4"
                                displayType="grid auto-rows-auto gap-2"
                            />
                        </>
                    ) : (
                        <div className="flex h-64 flex-col items-center justify-center">
                            <div className="block text-center">
                                <h3 className="mb-2 text-2xl font-bold">
                                    Song disabled
                                </h3>
                                <span className="text-lg">
                                    This song {songTitle} is no longer available
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default SongPage;
