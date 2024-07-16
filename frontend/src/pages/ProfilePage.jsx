import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectUserProfile } from '@features/profilepage/slices';
import { MediaDisplay } from '@components';
import verifiedIcon from '@assets/img/verified-icon.svg';
import {
    useGetProfileByIdQuery,
    useGetFollowingListByIdQuery,
    useGetFollowButtonByIdQuery,
    useFollowProfileByIdMutation,
    useUnfollowProfileByIdMutation,
    useGetProfileAllSongsQuery,
    useGetProfileAlbumsQuery,
} from '@services/api';

function ProfilePage() {
    const { profileId } = useParams();
    const myProfileData = useSelector(selectUserProfile);
    const { id } = myProfileData;

    // Fetch profile data by id
    const { data: profileByIdData, isLoading: profileByIdLoading } =
        useGetProfileByIdQuery(profileId, {
            skip: !profileId,
        });

    // Fetch following list by id
    const { data: followingListData, isLoading: followingListLoading } =
        useGetFollowingListByIdQuery(profileId || id, {
            skip: !profileId && !id,
        });

    // Fetch follow button state by id
    const { data: followButtonData, isLoading: followButtonLoading } =
        useGetFollowButtonByIdQuery(profileId, {
            skip: !profileId,
        });

    // Fetch all songs by profile id
    const { data: profileAllSongsData, isLoading: profileAllSongsLoading } =
        useGetProfileAllSongsQuery(profileId || id, {
            skip: !profileId && !id,
        });

    // Fetch albums by profile id
    const { data: profileAlbumsData, isLoading: profileAlbumsLoading } =
        useGetProfileAlbumsQuery(profileId || id, {
            skip: !profileId && !id,
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

    // Loading state
    if (
        profileByIdLoading ||
        followButtonLoading ||
        followingListLoading ||
        profileAllSongsLoading
    )
        return null;

    // Check if profile is mine than show profile data
    const isMyProfile = id === profileId || !profileId;
    const userProfile = isMyProfile ? myProfileData : profileByIdData;
    const {
        name,
        image: { url: avatar } = {},
        coverimg: { url: cover } = {},
        followers,
        isVerified,
    } = userProfile || {};
    const { following } = followingListData || {};

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

    // const albums = {
    //     type: 'Album',
    //     title: 'Albums',
    //     visibility: '',
    //     link: '',
    //     data: profileAlbumsData || [],
    // };

    const followingDisplay = {
        type: 'Artist',
        title: 'Following',
        visibility: '',
        link: '',
        data: following || [],
    };

    return (
        <div className="profile__page space-y-10 caret-transparent">
            {/* profile header */}
            <div className="profile__header h-96 w-full content-center">
                {/* profile cover */}
                {cover ? (
                    <div className="absolute left-20 right-0 top-0 h-96">
                        <img
                            className="profile__cover h-full w-full rounded-xl object-cover shadow-2xl brightness-75"
                            src={cover}
                            alt="cover"
                        />
                    </div>
                ) : (
                    <div className="profile__cover absolute left-20 right-0 top-0 h-96 rounded-xl border-2 border-t-0"></div>
                )}
                <div className="profile__container ml-[5%] flex items-center">
                    <div className="relative h-40 min-w-40 max-w-40">
                        {/* profile avatar */}
                        {avatar ? (
                            <img
                                className="profile__avatar h-full w-full rounded-full object-cover shadow-2xl"
                                src={avatar}
                                alt={name}
                            />
                        ) : (
                            <i className="bx bxs-user-circle h-full w-full text-[180px] leading-none"></i>
                        )}
                        {/* verified icon */}
                        {isVerified && (
                            <img
                                className="profile__verified-icon absolute bottom-[6px] right-[10px] h-8 w-8"
                                src={verifiedIcon}
                                alt="vrf-icon"
                            />
                        )}
                    </div>
                    {/* profile info */}
                    <div className="relative ml-5 content-center">
                        <p className="text-shadow-1 font-medium">Profile</p>
                        <p className="text-shadow-2 text-stroke-1 py-1 font-alfaslabone text-7xl">
                            {name}
                        </p>
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
                    </div>
                </div>
            </div>
            {/* profile header end */}

            {/* Actions Section */}
            <div className="flex space-x-6">
                <button className="h-[70px] min-w-[70px] rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF]">
                    <i className="ri-play-fill ml-1 text-[42px]"></i>
                </button>
                {isMyProfile ? (
                    <>
                        <Link
                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                            to="/"
                        >
                            Upload Music
                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
                        </Link>
                        <Link
                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                            to="editing"
                        >
                            Edit Profile
                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
                        </Link>
                    </>
                ) : (
                    <>
                        <button
                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase disabled:opacity-75"
                            disabled={isLoadingFollow || isLoadingUnfollow}
                            onClick={handleFollowToggle}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
                        </button>
                    </>
                )}
            </div>

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
                            {seeMoreSongs ? 'Show less' : 'See more'}
                        </span>
                    )}
                </>
            )}

            {/* {profileAlbumsData && (
                <MediaDisplay
                    media={albums}
                    displayItems="2"
                    displayType="grid grid-cols-6"
                />
            )} */}

            {following && (
                <MediaDisplay
                    media={followingDisplay}
                    displayItems="2"
                    displayType="grid grid-cols-6"
                />
            )}
        </div>
    );
}

export default ProfilePage;
