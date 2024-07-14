import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { selectCurrentToken } from '@services/selectors';
import { selectUserProfile, toggleFollow } from '@features/profilepage/slices';
import { MediaDisplay, Loading } from '@components';
import verifiedIcon from '@assets/img/verified-icon.svg';
import {
    useGetProfileByIdQuery,
    useGetProfileAllSongsQuery,
    useGetProfileAlbumsQuery,
} from '@services/api';

function ProfilePage() {
    const dispatch = useDispatch();
    const { profileId } = useParams();
    const myProfileData = useSelector(selectUserProfile);
    const { id } = myProfileData;

    const {
        data: profileByIdData,
        error: profileByIdError,
        isLoading: profileByIdLoading,
    } = useGetProfileByIdQuery(profileId, { skip: !profileId });

    const {
        data: profileAllSongsData,
        error: profileAllSongsError,
        isLoading: profileAllSongsLoading,
    } = useGetProfileAllSongsQuery(profileId || id, {
        skip: !profileId && !id,
    });

    const {
        data: profileAlbumsData,
        error: profileAlbumsError,
        isLoading: profileAlbumsLoading,
    } = useGetProfileAlbumsQuery(profileId || id, {
        skip: !profileId && !id,
    });

    const { following } = myProfileData;
    const [isFollowing, setFollowing] = useState(following.includes(profileId));

    if (profileByIdLoading || profileAllSongsLoading || profileAlbumsLoading) {
        return <Loading />;
    }

    const isMyProfile = id === profileId || !profileId;
    const userProfile = isMyProfile ? myProfileData : profileByIdData;
    const { name, image, followers } = userProfile || {};
    const { url, coverimg } = image || {};
    const isVerified = true;

    const isSliceAllReleases =
        profileAllSongsData && profileAllSongsData.length > 5;
    const allReleases = {
        type: 'Song',
        title: 'All Releases',
        visibility: '',
        link: isSliceAllReleases ? '' : '',
        data: isSliceAllReleases
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

    const handleFollowToggle = () => {
        dispatch(toggleFollow(profileId));
        setFollowing(!isFollowing);
    };

    return (
        <div className="profile__page space-y-10 caret-transparent">
            {/* profile header */}
            <div className="profile__header h-96 w-full content-center">
                {/* profile cover */}
                {coverimg ? (
                    <div className="absolute left-28 right-0 top-0 h-96">
                        <img
                            className="profile__cover h-full w-full rounded-xl object-cover shadow-2xl"
                            src={coverimg}
                            alt=""
                        />
                    </div>
                ) : (
                    <div className="profile__cover absolute left-28 right-0 top-0 h-96 rounded-xl border-2 border-t-0"></div>
                )}
                <div className="profile__container ml-[5%] flex items-center">
                    <div className="relative h-40 w-40">
                        {/* profile avatar */}
                        {url ? (
                            <img
                                className="profile__avatar h-full w-full rounded-full object-cover shadow-2xl"
                                src={url}
                                alt={name}
                            />
                        ) : (
                            <i className="bx bxs-user-circle h-40 w-40 text-[180px] leading-none"></i>
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
                        <p className="text-shadow-1">Profile</p>
                        <p className="text-shadow-2 text-stroke-1 font-alfaslabone text-7xl">
                            {name}
                        </p>
                        <p className="text-shadow-1">
                            {followers > 999
                                ? followers.toLocaleString()
                                : followers}{' '}
                            followers
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
                            // to="/"
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
                        <Link
                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                            // to="/"
                        >
                            Donation
                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
                        </Link>
                    </>
                ) : (
                    <>
                        <button
                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                            onClick={handleFollowToggle}
                        >
                            {isFollowing ? 'Unfollow' : 'Follow'}
                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
                        </button>
                        <Link
                            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
                            to="donate"
                        >
                            Donate
                            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
                        </Link>
                    </>
                )}
            </div>

            {profileAllSongsData && (
                <MediaDisplay
                    media={allReleases}
                    displayItems="4"
                    displayType="grid auto-rows-auto gap-2"
                />
            )}

            {/* {profileAlbumsData && (
                <MediaDisplay
                    media={albums}
                    displayItems="2"
                    displayType="grid grid-cols-6"
                />
            )} */}
        </div>
    );
}

export default ProfilePage;
