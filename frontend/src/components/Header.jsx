import { Link } from 'react-router-dom';
import { SearchIcon } from '.';
import { selectCurrentToken } from '@services/selectors';
import { useGetMyProfileQuery } from '@services/api';
import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateInfo } from '@features/profilepage/slices';
import propTypes from 'prop-types';

function Header() {
    const dispatch = useDispatch();
    const token = useSelector(selectCurrentToken);

    const [search, setSearch] = useState('');
    const [pingNotice, setPingNotice] = useState(true);
    const [showNotice, setShowNotice] = useState(false);
    const noticeRef = useRef(null);

    const notice = [
        {
            message: 'Welcome to SoundVault',
            time: '1 minute ago',
            seen: false,
        },
    ];

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleShowNotice = () => {
        setShowNotice(!showNotice);
        setPingNotice(false);
    };

    const handleClickOutside = (event) => {
        if (noticeRef.current && !noticeRef.current.contains(event.target)) {
            setShowNotice(false);
        }
    };

    useEffect(() => {
        if (showNotice) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNotice]);

    const { data: myProfileData, isLoading: profileLoading } =
        useGetMyProfileQuery();

    useEffect(() => {
        if (myProfileData) {
            dispatch(updateInfo(myProfileData));
        }
    }, [myProfileData, dispatch]);

    if (profileLoading) return null;

    const { name, image, isAdmin } = myProfileData || {};
    const { url } = image || {};

    return (
        <header className="header after:contents-[''] fixed left-0 right-0 top-0 z-10 flex h-[70px] select-none items-center justify-between px-5 text-sm backdrop-blur-md after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-white">
            {/* Logo */}
            <span className="header__logo flex-[1] pr-5 font-lilitaone text-4xl">
                SoundVault
            </span>
            {/* Search bar */}
            {!(token && isAdmin) && (
                <div className="header__search-container relative flex flex-[2] items-center justify-center">
                    <div className="header__search-icon absolute left-[27%]">
                        {SearchIcon()}
                    </div>
                    <input
                        className="header__search-input h-11 w-1/2 rounded-full bg-[#443F3F66] px-11 placeholder:italic placeholder:text-[#B5B3B3] focus:border-2 focus:outline-none"
                        placeholder="search music, album, artist,..."
                        type="search"
                        onChange={handleSearch}
                    ></input>
                </div>
            )}
            {/* Link */}
            {token ? (
                <div className="header__section flex h-full flex-[1] items-center justify-end space-x-3 text-sm">
                    {url ? (
                        <img
                            className="inline h-10 w-10 rounded-full object-cover"
                            src={url}
                            alt={name}
                        />
                    ) : (
                        <i className="bx bxs-user-circle aspect-square w-10 text-5xl leading-none"></i>
                    )}
                    <span>Hello, {name}</span>
                    <div className="relative" ref={noticeRef}>
                        <i
                            className="bx bx-bell relative block h-10 min-w-10 content-center rounded-full bg-white text-center text-2xl text-black transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-opacity-70"
                            onClick={handleShowNotice}
                        ></i>
                        {notice && pingNotice && (
                            <>
                                <div className="absolute right-2 top-2 h-[10px] w-[10px] rounded-full bg-red-500"></div>
                                <div className="absolute right-2 top-2 h-[10px] w-[10px] animate-[ping_2.5s_cubic-bezier(0,_0,_0.2,_1)_infinite] rounded-full bg-red-500"></div>
                            </>
                        )}
                        {showNotice && (
                            <notice className="absolute right-0 z-[11] mt-2 h-max w-60 rounded-xl text-sm shadow-md">
                                {notice.map((item, index) => (
                                    <div
                                        className={`${item.seen ? 'bg-[#c8c8c8]' : 'bg-white hover:bg-[#c8c8c8]'} grid auto-rows-max p-3 text-black ring-1 ring-black transition-colors duration-400 ease-in-out hover:cursor-pointer`}
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
                            </notice>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex h-1/2 flex-[1] justify-end space-x-5 pr-5 text-xs">
                    <HeaderLink to="/signin">SIGN IN</HeaderLink>
                    <HeaderLink to="/signup">SIGN UP</HeaderLink>
                </div>
            )}
        </header>
    );
}

export default Header;

HeaderLink.propTypes = {
    to: propTypes.string.isRequired,
    children: propTypes.node.isRequired,
};

function HeaderLink({ to, children }) {
    return (
        <Link
            className="block h-full w-max content-center rounded-full px-3 transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
            to={to}
        >
            {children}
        </Link>
    );
}
