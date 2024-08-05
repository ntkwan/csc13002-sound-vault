import React from 'react';
import {
    useGetSongByIdQuery,
    useGetProfileByIdQuery,
    useGetProfileAllSongsQuery,
} from '@services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MediaDisplay } from '@components/index';
import { selectCurrentAdmin } from '@services/selectors';
import verifiedIcon from '@assets/img/verified-icon.svg';
import BigPlayButton from '@components/BigPlayButton';

function SongPage() {
    const isAdmin = useSelector(selectCurrentAdmin);
    const [duration, setDuration] = useState('0:00');
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

    const allReleases = {
        type: 'Song',
        title: songArtist,
        visibility: '',
        data: profileAllSongsData ? profileAllSongsData.slice(0, 6) : [],
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

    const navigate = useNavigate();
    const handleArtist = (id) => {
        navigate(`/profile/${id}`);
    };

    return (
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
                            <p className="text-shadow-1 font-semibold">Song</p>
                            <p className="text-shadow-2 text-stroke-1 py-1 font-alfaslabone text-5xl">
                                {songTitle}
                            </p>
                            {!songIsDisabled && (
                                <p className="text-shadow-1 absolute flex items-center text-ellipsis whitespace-nowrap text-sm font-medium">
                                    {profileImageUrl ? (
                                        <img
                                            className="mx-2 inline h-7 w-7 rounded-full object-cover"
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
                                    {songView}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* playlist header end */}
                {/* Actions Section */}
                {!songIsDisabled ? (
                    <>
                        <div className="mt-8 flex space-x-6">
                            {profileAllSongsData && (
                                <BigPlayButton
                                    playlist={{
                                        id: profileId,
                                        songs: profileAllSongsData,
                                    }}
                                />
                            )}
                            <button className="h-[70px] min-w-[70px]">
                                <div className="rotate-90">
                                    <i
                                        className="ri-more-2-line text-[42px]"
                                        // onClick={() => setShowProfileOption(true)}
                                    />
                                </div>
                                {/* {showProfileOption === true && (
                        <div className="menu absolute right-0 z-[2] mt-2 h-max w-44 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                            <ul>
                                <li
                                    className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                    onClick={handleCopyLink}
                                >
                                    <i className="ri-share-line text-xl leading-none"></i>
                                    <span>Share</span>
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
                    )} */}
                            </button>
                        </div>
                        <div
                            className="hover:bg my-5 flex max-w-80 rounded-md px-2 hover:bg-white hover:bg-opacity-25"
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
                                    <i className="ri-heart-line block h-full w-full content-center rounded-full bg-gradient-to-b from-[#6D28C6] to-[#FFFFFF] text-center text-2xl leading-none"></i>
                                )}
                            </div>

                            <div className="flex cursor-default flex-col justify-center">
                                <p className="text-shadow-1 font-semibold">
                                    Artist
                                </p>
                                <p className="text-shadow-2 font-bold hover:underline">
                                    {songArtist}
                                </p>
                            </div>
                        </div>
                        <p className="text-[27px] font-medium">
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
    );
}

export default SongPage;
