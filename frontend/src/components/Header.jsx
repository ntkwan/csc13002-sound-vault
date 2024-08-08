import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { SearchIcon } from '.';
import {
    selectCurrentAdmin,
    selectCurrentProfile,
    selectCurrentToken,
} from '@services/selectors';
import { useGetFeaturedArtistsQuery } from '@services/api';
import { MediaDisplay } from '.';

function Header() {
    // hooks
    const navigate = useNavigate();
    const location = useLocation();
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);
    const [pingNotice, setPingNotice] = useState(true);
    const [showNotice, setShowNotice] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const noticeRef = useRef(null);
    const searchRef = useRef(null);

    // get profile data
    const profile = useSelector(selectCurrentProfile);
    const { name, image: { url: avatar } = {} } = profile || {};

    // handle logo click
    const handleLogoClick = () => {
        navigate('/');
    };

    // notification data
    const notices = [
        {
            message: 'Welcome to SoundVault',
            time: '1 minute ago',
            seen: false,
        },
    ];
    // handle notification
    const handleShowNotice = () => {
        setShowNotice(!showNotice);
        setPingNotice(false);
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

    // get search data
    const { data: artist } = useGetFeaturedArtistsQuery();
    // handle search
    useEffect(() => {
        setSearchInput('');
    }, [location]);

    const handleClickOutsideSearch = (event) => {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
            setSearchInput('');
            return;
        }
    };

    useEffect(() => {
        if (searchInput) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('mousedown', handleClickOutsideSearch);
        } else {
            document.body.style.overflow = 'auto';
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('mousedown', handleClickOutsideSearch);
        };
    }, [searchInput]);

    if (!artist) return;
    const searchData = [
        {
            // only one
            type: 'Artist',
            title: 'Top result',
            visibility: '',
            link: '',
            data: artist || [],
        },
        {
            title: 'Song',
            visibility: '',
            type: 'Song',
            link: '',
            data: artist || [],
        },
        {
            type: 'Artist',
            title: 'Artists',
            visibility: '',
            link: '',
            data: artist || [],
        },
        {
            type: 'Album',
            title: 'Albums',
            visibility: '',
            link: '',
            data: artist || [],
        },
        {
            type: 'Playlist',
            title: 'Playlists',
            visibility: '',
            link: '',
            data: artist || [],
        },
        {
            // account not verified
            type: 'Artist',
            title: 'Profiles',
            visibility: '',
            link: '',
            data: artist || [],
        },
    ];

    const filteredSearchData = searchData
        .map((item) => ({
            ...item,
            data: item.data.filter((dataItem) =>
                dataItem.name.toLowerCase().includes(searchInput.toLowerCase()),
            ),
        }))
        .filter((item) => item.data.length > 0);

    const noResultsFound = filteredSearchData.length === 0;

    return (
        <>
            <header className="header after:contents-[''] fixed left-0 right-0 top-0 z-40 flex h-[70px] select-none items-center justify-between px-5 text-sm backdrop-blur-md after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-white">
                {/* Logo */}
                <p
                    className="header__logo w-1/4 pr-5 font-lilitaone text-4xl hover:cursor-pointer"
                    onClick={handleLogoClick}
                >
                    SoundVault
                </p>
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
                            value={searchInput}
                        />
                    </div>
                )}

                {/* Action */}
                {token ? (
                    <div className="header__section flex h-full w-1/4 items-center justify-end space-x-3 text-sm">
                        {avatar ? (
                            <img
                                className="inline h-10 w-10 rounded-full object-cover"
                                src={avatar}
                                alt={name}
                            />
                        ) : (
                            <i className="bx bxs-user-circle aspect-square w-10 text-5xl leading-none"></i>
                        )}
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
                                    {notices.map((item, index) => (
                                        <div
                                            className={`${item.seen ? 'bg-[#c8c8c8]' : 'bg-white hover:bg-[#c8c8c8]'} grid auto-rows-max p-3 text-black ring-1 ring-black transition-colors duration-300 ease-in-out hover:cursor-pointer`}
                                            key={index}
                                        >
                                            <span className="text-start">
                                                Title: {item.message}
                                            </span>
                                            <span className="text-start">
                                                Time: {item.time}
                                            </span>
                                        </div>
                                    ))}
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

            {searchInput && (
                <div
                    className="header__search-dropdown fixed bottom-0 left-[175px] right-0 top-[70px] z-10 space-y-8 overflow-y-scroll scroll-auto px-20 pb-28 pt-8 backdrop-blur-2xl"
                    ref={searchRef}
                >
                    {noResultsFound ? (
                        <div className="break-words text-3xl font-bold">
                            Nothing matches your input '{searchInput}'
                        </div>
                    ) : (
                        filteredSearchData.map((item, index) => (
                            <MediaDisplay
                                key={index}
                                media={item}
                                displayItems="2"
                                displayType="grid grid-cols-6 gap-8"
                            />
                        ))
                    )}
                </div>
            )}
        </>
    );
}

export default Header;
