import { Link } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import verifiedIcon from '@assets/img/verified-icon.svg';
import { selectUserProfile, toggleFollow } from '@features/profilepage/slices';
import { MediaDisplay, MediaItems4 } from '@components';

const ARTIST_IMG_URL = 'src/assets/img/artist/';
const SONG_IMG_URL = 'src/assets/img/song/';

function ProfilePage() {
    const isFollowing = false;
    const isMyProfile = true;
    const userProfile = useSelector(selectUserProfile);
    const {
        fullName,
        isVerified,
        followers,
        avatar,
        cover,
        popular,
        mediaData,
    } = userProfile;
    const dispatch = useDispatch();
    return (
        <div className="profile__page space-y-10 caret-transparent">
            {/* profile header */}
            <div className="profile__header h-96 w-full content-center">
                {/* profile cover */}
                {cover != '' ? (
                    <div className="absolute left-28 right-0 top-0 h-96">
                        <img
                            className="profile__cover h-full w-full rounded-xl object-cover shadow-2xl"
                            src={ARTIST_IMG_URL + cover}
                            alt=""
                        />
                    </div>
                ) : (
                    <div className="profile__cover absolute left-28 right-0 top-0 h-96 rounded-xl border-2 border-t-0"></div>
                )}
                <div className="profile__container ml-[5%] flex items-center">
                    <div className="relative h-40 min-w-40">
                        {/* profile avatar */}
                        {avatar != '' ? (
                            <img
                                className="profile__avatar h-full w-full rounded-full object-cover shadow-2xl"
                                src={ARTIST_IMG_URL + avatar}
                                alt=""
                            />
                        ) : (
                            <i className="bx bxs-user-circle aspect-square w-40 text-[180px] leading-none"></i>
                        )}
                        {/* verified icon */}
                        {isVerified && (
                            <img
                                className="profile__verified-icon absolute bottom-[6px] right-[10px] aspect-square w-8"
                                src={verifiedIcon}
                                alt=""
                            />
                        )}
                    </div>
                    {/* profile info */}
                    <div className="relative ml-5 content-center">
                        <p className="text-shadow-1">Profile</p>
                        <p className="text-shadow-2 text-stroke-1 font-alfaslabone text-7xl">
                            {fullName}
                        </p>
                        <p className="text-shadow-1">
                            {followers.toLocaleString()} followers
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
                        <Button>upload music</Button>
                        <Button to="editing">edit profile</Button>
                        <Button>donation</Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => dispatch(toggleFollow())}>
                            {isFollowing ? 'unfollow' : 'follow'}
                        </Button>
                        <Button>donate</Button>
                    </>
                )}
            </div>

            {/* Content Section */}
            <div className="media grid grid-rows-[min-content_auto]">
                <h2 className="inline text-3xl font-bold">Popular</h2>
                <div className="slider__media mt-4 grid gap-y-3">
                    <MediaItems4 mediaList={popular} />
                </div>
            </div>

            {mediaData.map((media, index) => {
                if (!media.visibility && !isMyProfile) return null;
                return (
                    <MediaDisplay
                        key={index}
                        media={media}
                        displayItems="2"
                        displayType="grid grid-cols-6"
                    />
                );
            })}
        </div>
    );
}

export default ProfilePage;

function Button({ to, onClick, children }) {
    return (
        <Link
            className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-center text-xs uppercase"
            onClick={onClick}
            to={to}
        >
            {children}
            <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-400 ease-in-out group-hover:opacity-100"></div>
        </Link>
    );
}
