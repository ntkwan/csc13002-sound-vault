import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MediaDisplay, ReportFrame, BigPlayButton } from '@components';
import verifiedIcon from '@assets/img/verified-icon.svg';
import {
    selectCurrentProfile,
    selectCurrentToken,
    selectCurrentAdmin,
} from '@services/selectors';
import {
    useGetProfileByIdQuery,
    useGetFollowingListByIdQuery,
    useGetFollowButtonByIdQuery,
    useFollowProfileByIdMutation,
    useUnfollowProfileByIdMutation,
    useGetProfileAllSongsQuery,
    useGetProfileAlbumsQuery,
    useGetProfilePlaylistsQuery,
    useLazyGetIdByUsernameQuery,
} from '@services/api';
import { toast } from 'react-toastify';
import { Loading } from '@components/index';

const checkValidId = new RegExp('^[0-9a-fA-F]{24}$');

function ProfilePage() {
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);
    const { profileId } = useParams();
    const myProfileData = useSelector(selectCurrentProfile);
    const { id } = myProfileData;
    const nav = useNavigate();

    const [getProfileId] = useLazyGetIdByUsernameQuery();
    useEffect(() => {
        async function direct() {
            try {
                const data = await getProfileId(profileId).unwrap();
                nav(`/profile/${data}`, { replace: true });
            } catch (error) {
                console.error('Error getting profile by id:', error);
            }
        }

        if (profileId && !checkValidId.test(profileId)) {
            direct();
        }
    }, [profileId, getProfileId, nav]);

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
                    'bg-home-pattern text-white font-kodchasan font-bold',
            });
        });
    };
    const handleCopyLink = () => {
        const currentUrl = window.location.href;
        setShowProfileOption(false);
        copyToClipboard(currentUrl);
    };

    // Fetch profile data by id
    const { data: profileByIdData } = useGetProfileByIdQuery(profileId, {
        skip: !profileId || !checkValidId.test(profileId),
    });

    // Fetch following list by id
    const { data: followingListData, isLoading: followingListLoading } =
        useGetFollowingListByIdQuery(profileId || id, {
            skip:
                (!profileId && !id) ||
                (profileId && !checkValidId.test(profileId)),
        });

    // Fetch follow button state by id
    const { data: followButtonData, isLoading: followButtonLoading } =
        useGetFollowButtonByIdQuery(profileId, {
            skip: !profileId || !id || !checkValidId.test(profileId),
        });

    // Fetch all songs by profile id
    const { data: profileAllSongsData, isLoading: profileAllSongsLoading } =
        useGetProfileAllSongsQuery(profileId || id, {
            skip:
                (!profileId && !id) ||
                (profileId && !checkValidId.test(profileId)),
        });

    // Fetch albums by profile id
    const { data: profileAlbumsData, isLoading: profileAlbumsLoading } =
        useGetProfileAlbumsQuery(profileId || id, {
            skip:
                (!profileId && !id) ||
                (profileId && !checkValidId.test(profileId)),
        });

    // Fetch playlists by profile id
    const { data: profilePlaylistData, isLoading: profilePlaylistLoading } =
        useGetProfilePlaylistsQuery(profileId || id, {
            skip:
                (!profileId && !id) ||
                (profileId && !checkValidId.test(profileId)),
        });

    // Follow/Unfollow profile
    const [followProfile, { isLoading: isLoadingFollow }] =
        useFollowProfileByIdMutation();
    const [unfollowProfile, { isLoading: isLoadingUnfollow }] =
        useUnfollowProfileByIdMutation();

    const [isFollowing, setFollowing] = useState(false);

    useEffect(() => {
        if (followButtonData) {
            setFollowing(followButtonData.button_state);
        }
    }, [followButtonData]);

    const handleFollowToggle = async () => {
        if (isFollowing === undefined || isLoadingFollow || isLoadingUnfollow) {
            return;
        }
        setFollowing(!isFollowing);
        try {
            if (isFollowing) {
                await unfollowProfile(profileId).unwrap();
            } else {
                await followProfile(profileId).unwrap();
            }
        } catch (error) {
            console.error('Error following/unfollowing profile:', error);
            setFollowing(isFollowing);
        }
    };

    // See more songs state
    const [seeMoreSongs, setSeeMoreSongs] = useState(false);
    const handleSeeMoreSongs = () => {
        setSeeMoreSongs(!seeMoreSongs);
    };

    // Check if profile is mine than show profile data
    const isMyProfile = id === profileId || !profileId;
    const userProfile = isMyProfile ? myProfileData : profileByIdData;
    const {
        name,
        image: { url: avatar } = {},
        coverimg: { url: cover } = {},
        followers,
        isVerified,
        isBanned,
        shortDesc,
    } = userProfile || {};

    const { following } = followingListData || {};
    const { playlists } = profilePlaylistData || {};
    const { albums } = profileAlbumsData || {};

    const isSliceAllReleases =
        profileAllSongsData && profileAllSongsData.length > 5;
    const allReleases = {
        type: 'Song',
        title: 'All Releases',
        visibility: '',
        link: isSliceAllReleases ? '' : '',
        data:
            isSliceAllReleases && !seeMoreSongs
                ? profileAllSongsData.slice(0, 5)
                : profileAllSongsData,
    };

    const isSliceAlbums = profileAlbumsData && albums.length > 6;
    const albumsDisplay = {
        type: 'Album',
        title: 'Albums',
        visibility: '',
        link: isSliceAlbums ? '/library' : '',
        data: isSliceAlbums ? albums.slice(0, 6) : albums,
    };

    const isSlicePlaylists = profilePlaylistData && playlists.length > 6;
    const playlistsDisplay = {
        type: 'Playlist',
        title: 'Playlist',
        visibility: '',
        link: isSlicePlaylists ? '/library' : '',
        data: isSlicePlaylists ? playlists.slice(0, 6) : playlists,
    };

    const isSliceFollowing = following && following.length > 6;
    const followingDisplay = {
        type: 'Artist',
        title: 'Following',
        visibility: '(only me)',
        link: isSliceFollowing ? '/library' : '',
        data: isSliceFollowing ? following.slice(0, 6) : following,
    };

    if (
        profileAllSongsLoading ||
        profileAlbumsLoading ||
        profilePlaylistLoading ||
        followButtonLoading ||
        followingListLoading ||
        (profileId && !checkValidId.test(profileId))
    ) {
        return <Loading />;
    }

    return (
        <div className={isAdmin ? 'pointer-events-none' : ''}>
            {showReportFrame && (
                <ReportFrame setShowReportFrame={setShowReportFrame} />
            )}
            <div className="profile__page space-y-10 caret-transparent">
                {/* profile header */}
                <div className="profile__header h-96 w-full content-center">
                    {/* profile cover */}
                    {cover ? (
                        <div className="absolute left-20 right-0 top-0 h-96">
                            {!isBanned ? (
                                <img
                                    className="profile__cover h-full w-full rounded-xl object-cover shadow-2xl brightness-75"
                                    src={cover}
                                    alt="cover"
                                />
                            ) : (
                                <div className="profile__cover h-full w-full rounded-xl bg-transparent object-cover shadow-2xl brightness-75" />
                            )}
                        </div>
                    ) : (
                        <div className="profile__cover absolute left-20 right-0 top-0 h-96 rounded-xl border-2 border-t-0"></div>
                    )}
                    <div className="profile__container ml-[5%] flex items-center">
                        <div className="relative h-40 min-w-40 max-w-40">
                            {/* profile avatar */}
                            {avatar && !isBanned ? (
                                <img
                                    className="profile__avatar h-full w-full rounded-full object-cover shadow-2xl"
                                    src={avatar}
                                    alt={name}
                                />
                            ) : (
                                <i className="bx bxs-user-circle leading-non bg h-full w-full text-[180px]"></i>
                            )}
                            {/* verified icon */}
                            {isVerified && !isBanned && (
                                <img
                                    className="profile__verified-icon absolute bottom-[6px] right-[10px] h-8 w-8"
                                    src={verifiedIcon}
                                    alt="vrf-icon"
                                />
                            )}
                        </div>
                        {/* profile info */}
                        <div className="relative ml-5 cursor-default content-center">
                            <p className="text-shadow-1 font-medium">Profile</p>
                            <p className="text-shadow-2 text-stroke-1 select-none py-1 font-alfaslabone text-7xl">
                                {name}
                            </p>
                            {!isBanned && (
                                <p className="text-shadow-1 font-medium">
                                    {!profileAllSongsData
                                        ? '0 Song'
                                        : profileAllSongsData.length <= 1
                                          ? `${profileAllSongsData.length} Song`
                                          : `${profileAllSongsData.length} Songs`}
                                    {' • '}
                                    {followers <= 1
                                        ? `${followers} Follower`
                                        : followers > 999
                                          ? `${followers.toLocaleString()} Followers`
                                          : `${followers} Followers`}
                                    {' • '}
                                    {!following
                                        ? '0 Following'
                                        : `${following.length} Following`}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                {/* profile header end */}

                {/* Actions Section */}
                {!isBanned ? (
                    <>
                        {!isAdmin && (
                            <div className="flex space-x-6">
                                {profileAllSongsData && (
                                    <BigPlayButton
                                        playlist={{
                                            id: profileId || id,
                                            songs: profileAllSongsData,
                                        }}
                                    />
                                )}
                                {isMyProfile ? (
                                    <>
                                        <Link
                                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                                            to="upload-music"
                                        >
                                            Upload Music
                                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
                                        </Link>
                                        <Link
                                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                                            to="editing"
                                        >
                                            Edit Profile
                                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
                                        </Link>
                                        {!isVerified && (
                                            <Link
                                                className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                                                to="verify"
                                            >
                                                Request Verify
                                                <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
                                            </Link>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        {id && (
                                            <button
                                                className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase disabled:opacity-75"
                                                disabled={
                                                    isLoadingFollow ||
                                                    isLoadingUnfollow
                                                }
                                                onClick={handleFollowToggle}
                                            >
                                                {isFollowing
                                                    ? 'Unfollow'
                                                    : 'Follow'}
                                                <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-300 ease-in-out group-hover:opacity-100"></div>
                                            </button>
                                        )}
                                        <button className="absolute right-4 h-[70px] min-w-[70px]">
                                            <i
                                                className="bx bx-menu text-[42px]"
                                                onClick={() =>
                                                    setShowProfileOption(true)
                                                }
                                            />
                                            {showProfileOption === true && (
                                                <div className="menu absolute right-0 z-[2] mt-2 h-max w-44 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                                                    <ul>
                                                        <li
                                                            className="z-10 flex cursor-pointer space-x-2 rounded-t-xl border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                            onClick={
                                                                handleCopyLink
                                                            }
                                                        >
                                                            <i className="ri-share-line text-xl leading-none"></i>
                                                            <span>
                                                                Copy link
                                                            </span>
                                                        </li>
                                                        {token && (
                                                            <li
                                                                className="z-10 flex cursor-pointer space-x-2 border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]"
                                                                onClick={() =>
                                                                    setShowReportFrame(
                                                                        true,
                                                                    )
                                                                }
                                                            >
                                                                <i className="ri-error-warning-line text-xl leading-none"></i>
                                                                <span>
                                                                    Report
                                                                </span>
                                                            </li>
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {profileAllSongsData && (
                            <>
                                <MediaDisplay
                                    media={allReleases}
                                    displayItems="4"
                                    displayType="grid auto-rows-auto gap-2"
                                />

                                {isSliceAllReleases && (
                                    <span
                                        className="ml-5 cursor-pointer p-1 font-bold leading-loose text-[#999] hover:text-white"
                                        onClick={handleSeeMoreSongs}
                                    >
                                        {seeMoreSongs
                                            ? 'Show less'
                                            : 'See more'}
                                    </span>
                                )}
                            </>
                        )}

                        {albums && (
                            <MediaDisplay
                                media={albumsDisplay}
                                displayItems="2"
                                displayType="grid grid-cols-6"
                            />
                        )}

                        {following && isMyProfile && (
                            <MediaDisplay
                                media={followingDisplay}
                                displayItems="2"
                                displayType="grid grid-cols-6"
                            />
                        )}

                        {playlists && (
                            <MediaDisplay
                                media={playlistsDisplay}
                                displayItems="2"
                                displayType="grid grid-cols-6"
                            />
                        )}

                        {shortDesc && (
                            <section className="">
                                <h2 className="inline text-3xl font-bold">
                                    About
                                </h2>
                                <div className="absolute left-20 right-0 mt-4 h-[400px]">
                                    <img
                                        src={cover}
                                        className="h-full w-full rounded-xl object-cover brightness-[60%]"
                                    />
                                    <div className="absolute bottom-[10%] left-20 right-20 h-2/3 select-none content-end">
                                        <h2 className="font-bold">{name}</h2>
                                        <p className="text-ellipsis text-justify">
                                            {shortDesc}
                                        </p>
                                    </div>
                                    <div className="pb-44"></div>
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center">
                        <div className="block text-center">
                            <h3 className="mb-2 text-2xl font-bold">
                                Account banned
                            </h3>
                            <span className="text-lg">
                                This account {name} is no longer available
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfilePage;
