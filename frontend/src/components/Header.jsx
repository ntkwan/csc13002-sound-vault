import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Loading, SearchIcon } from '.';
import {
    selectCurrentAdmin,
    selectCurrentProfile,
    selectCurrentToken,
} from '@services/selectors';
import {
    useGetNotificationQuery,
    useLazyGetSearchResultsQuery,
    useSetNotificationSeenMutation,
} from '@services/api';
import { MediaDisplay } from '.';
import { useDebounce } from '@hooks';

const showTimeDifference = (date) => {
    const currentDate = new Date();
    const noticeDate = new Date(date);
    const diff = currentDate - noticeDate;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(weeks / 4);
    const years = Math.floor(months / 12);

    if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`;
    if (months > 0) return `${months} month${months > 1 ? 's' : ''} ago`;
    if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 0) return `${seconds} second${seconds > 1 ? 's' : ''} ago`;
};

function Header() {
    // hooks
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);
    const [pingNotice, setPingNotice] = useState(false);
    const [showNotice, setShowNotice] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const noticeRef = useRef(null);
    const searchRef = useRef(null);
    const debouncedSearchInput = useDebounce(searchInput);
    const [hoverAvatar, setHoverAvatar] = useState(false);

    // get profile data
    const profile = useSelector(selectCurrentProfile);
    const { name, image: { url: avatar } = {} } = profile || {};

    // handle logo click
    const handleLogoClick = () => {
        navigate('/');
    };

    // notification data
    const { data: notices } = useGetNotificationQuery({
        skip: !token,
    });

    useEffect(() => {
        if (notices && notices.length > 0) {
            const unseenNotice = notices.find((item) => !item.seen);
            if (unseenNotice) setPingNotice(true);
        }
    }, [notices]);

    // handle notification
    const [setNotificationSeen] = useSetNotificationSeenMutation();
    const markNotificationSeen = async () => {
        if (notices) {
            const unseenNotice = notices.find((item) => !item.seen);
            if (unseenNotice) {
                try {
                    await setNotificationSeen().unwrap();
                    setPingNotice(false);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    };

    const handleShowNotice = () => {
        setShowNotice(!showNotice);
        if (pingNotice) {
            markNotificationSeen();
        }
    };
    // handle click outside notification
    const handleClickOutsideNotification = (event) => {
        if (noticeRef.current && !noticeRef.current.contains(event.target)) {
            setShowNotice(false);
        }
    };
    useEffect(() => {
        if (showNotice) {
            document.addEventListener(
                'mousedown',
                handleClickOutsideNotification,
            );
        } else {
            document.removeEventListener(
                'mousedown',
                handleClickOutsideNotification,
            );
        }
        return () => {
            document.removeEventListener(
                'mousedown',
                handleClickOutsideNotification,
            );
        };
    }, [showNotice]);

    // handle search
    useEffect(() => {
        setSearchInput('');
    }, [location]);

    const handleClickOutsideSearch = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setShowSearch(false);
            return;
        }
    };

    useEffect(() => {
        if (searchInput) {
            // document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutsideSearch);
        } else {
            // document.body.style.overflow = 'auto';
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        }
        return () => {
            // document.body.style.overflow = 'auto';
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        };
    }, [searchInput]);

    // handle observer animation
    const headerRef = useRef(null);
    useEffect(() => {
        const handleObserver = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === headerRef.current) {
                        setTimeout(() => {
                            headerRef.current.classList.remove(
                                'opacity-0',
                                '-translate-y-14',
                            );
                        }, 500);
                    }
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });

        if (headerRef.current) observer.observe(headerRef.current);

        return () => {
            if (headerRef.current) observer.unobserve(headerRef.current);
        };
    }, []);

    // get search data
    let [
        getSearchData,
        { data: searchData, isFetching, error: noResultsFound },
    ] = useLazyGetSearchResultsQuery();

    useEffect(() => {
        if (!debouncedSearchInput.trim()) return;
        getSearchData(debouncedSearchInput);
    }, [debouncedSearchInput, getSearchData]);

    const { artists, users, songs, albums, playlists } = searchData || {};
    const results = [
        {
            // only one
            type: 'Artist',
            title: 'Top result',
            visibility: '',
            link: '',
            data: [],
        },
        {
            title: 'Song',
            visibility: '',
            type: 'Song',
            link: '',
            data: songs || [],
        },
        {
            type: 'Artist',
            title: 'Artists',
            visibility: '',
            link: '',
            data: artists || [],
        },
        {
            type: 'Album',
            title: 'Albums',
            visibility: '',
            link: '',
            data: albums || [],
        },
        {
            type: 'Playlist',
            title: 'Playlists',
            visibility: '',
            link: '',
            data: playlists || [],
        },
        {
            // account not verified
            type: 'Profile',
            title: 'Profiles',
            visibility: '',
            link: '',
            data: users || [],
        },
    ];

    return (
        <>
            <header
                className="header after:contents-[''] fixed left-0 right-0 top-0 z-40 flex h-[70px] -translate-y-14 select-none items-center justify-between px-5 text-sm opacity-0 backdrop-blur-md transition duration-700 ease-in-out after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-white"
                ref={headerRef}
            >
                {/* Logo */}
                <div className="header__logo flex-1">
                    <p
                        className="max-w-fit pr-5 font-lilitaone text-4xl hover:cursor-pointer"
                        onClick={handleLogoClick}
                    >
                        SoundVault
                    </p>
                </div>
                {/* Search bar */}
                {!(token && isAdmin) && (
                    <div className="header__search-container relative flex w-1/2 items-center justify-center">
                        <div className="header__search-icon absolute left-[27%]">
                            {SearchIcon()}
                        </div>
                        <input
                            className="header__search-input h-11 w-1/2 rounded-full bg-[#443F3F66] px-11 placeholder:italic placeholder:text-[#B5B3B3] focus:border-2 focus:outline-none"
                            placeholder="search music, album, artist,..."
                            type="search"
                            onChange={(e) => setSearchInput(e.target.value)}
                            onFocus={() => setShowSearch(true)}
                            value={searchInput}
                        />
                    </div>
                )}

                {/* Action */}
                {token ? (
                    <div className="header__section flex h-full w-1/4 items-center justify-end space-x-3 text-sm">
                        <div
                            className="relative hover:cursor-pointer"
                            onClick={() =>
                                navigate(
                                    isAdmin ? 'admin/edit-profile' : '/profile',
                                )
                            }
                            onMouseEnter={() => setHoverAvatar(true)}
                            onMouseLeave={() => setHoverAvatar(false)}
                        >
                            {avatar ? (
                                <img
                                    className="inline h-10 w-10 rounded-full object-cover"
                                    src={avatar}
                                    alt={name}
                                />
                            ) : (
                                <i className="bx bxs-user-circle aspect-square w-10 text-5xl leading-none"></i>
                            )}
                            {hoverAvatar && isAdmin && (
                                <div className="absolute bottom-[-36px] left-[-10px] z-10 rounded-lg bg-gray-900 px-2 text-center text-xs font-medium text-white shadow-lg">
                                    Edit Profile
                                </div>
                            )}
                        </div>

                        {isAdmin ? (
                            <div>
                                <p className="font-bold">{name}</p>
                                <p className="text-[#B3B3B3]">Admin</p>
                            </div>
                        ) : (
                            <p className="max-w-[50%] overflow-hidden text-ellipsis text-nowrap">
                                Hello, {name}
                            </p>
                        )}
                        <div className="relative" ref={noticeRef}>
                            <i
                                className="bx bx-bell relative block h-10 min-w-10 content-center rounded-full bg-white text-center text-2xl text-black transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-opacity-70"
                                onClick={handleShowNotice}
                            ></i>
                            {notices && pingNotice && (
                                <>
                                    <div className="absolute right-2 top-2 h-[10px] w-[10px] rounded-full bg-red-500"></div>
                                    <div className="absolute right-2 top-2 h-[10px] w-[10px] animate-[ping_2.5s_cubic-bezier(0,_0,_0.2,_1)_infinite] rounded-full bg-red-500"></div>
                                </>
                            )}
                            {showNotice && (
                                <div className="absolute right-0 z-[11] mt-2 h-max w-60 rounded-xl bg-white text-sm shadow-md">
                                    {notices.length > 0 ? (
                                        notices.map((item, index) => (
                                            <div
                                                className="group grid auto-rows-max rounded-xl bg-white p-3 text-black transition-colors duration-300 ease-in-out hover:bg-[#c8c8c8]"
                                                key={index}
                                            >
                                                <span className="truncate text-start text-base group-hover:text-pretty">
                                                    {item.message}
                                                </span>
                                                <span className="text-start text-xs font-bold text-blue-500">
                                                    {showTimeDifference(
                                                        item.createdAt,
                                                    )}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="group grid auto-rows-max rounded-xl bg-white p-3 text-black transition-colors duration-300 ease-in-out hover:bg-[#c8c8c8]">
                                            <span className="truncate text-start text-base group-hover:text-pretty">
                                                You have no notification !
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex h-1/2 w-1/4 justify-end space-x-5 pr-5 text-xs">
                        <Link
                            to="/signin"
                            className="block h-full w-max content-center rounded-full px-3 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
                        >
                            SIGN IN
                        </Link>
                        <Link
                            to="/signup"
                            className="block h-full w-max content-center rounded-full px-3 transition-colors duration-300 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
                        >
                            SIGN UP
                        </Link>
                    </div>
                )}
            </header>

            {searchInput &&
                showSearch &&
                (!isFetching ? (
                    <div
                        className="header__search-dropdown fixed bottom-0 left-[180px] right-0 top-[70px] z-30 space-y-8 overflow-y-scroll scroll-auto px-20 pb-28 pt-8 backdrop-blur-2xl"
                        ref={searchRef}
                    >
                        {noResultsFound ? (
                            <div className="break-words text-3xl font-bold">
                                Nothing matches your input &rsquo;{searchInput}
                                &rsquo;
                            </div>
                        ) : (
                            results.map((item, index) => (
                                <MediaDisplay
                                    key={index}
                                    media={item}
                                    displayItems="2"
                                    displayType="grid grid-cols-6 gap-8"
                                />
                            ))
                        )}
                    </div>
                ) : (
                    <Loading />
                ))}
        </>
    );
}

export default Header;
