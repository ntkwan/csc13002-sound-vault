import { Link } from 'react-router-dom';
import { SearchIcon } from '.';
import { selectCurrentToken } from '@services/selectors';
import { selectUserProfile } from '@features/profilepage/slices';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import propTypes from 'prop-types';

const ARTIST_IMG_URL = 'src/assets/img/artist/';

function Header() {
    const token = useSelector(selectCurrentToken);

    const [search, setSearch] = useState('');
    const [pingNotice, setPingNotice] = useState(true);
    const [showNotice, setShowNotice] = useState(false);

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

    const userProfile = useSelector(selectUserProfile);
    const { fullName, avatar, isAdmin } = userProfile;

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
                <div className="header__section flex-[1] flex justify-end items-center h-full text-sm space-x-3">
                    <img
                        className="inline w-10 h-10 rounded-full object-cover"
                        src={ARTIST_IMG_URL + avatar}
                        alt=""
                    />
                    <span>Hello, {fullName}</span>
                    <div className="relative">
                        <i
                            className="bx bx-bell relative block min-w-10 h-10 text-center content-center text-2xl text-black rounded-full bg-white transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-opacity-70"
                            onClick={handleShowNotice}>
                        </i>
                        {notice && pingNotice && (
                            <>
                                <div className="absolute top-2 right-2 w-[10px] h-[10px] rounded-full bg-red-500"></div>
                                <div className="absolute top-2 right-2 w-[10px] h-[10px] rounded-full bg-red-500 animate-[ping_2.5s_cubic-bezier(0,_0,_0.2,_1)_infinite]"></div>
                            </>
                        )}
                        {showNotice && (
                            <notice className="absolute right-0 mt-2 w-60 h-max rounded-xl shadow-md text-sm z-[11]">
                                {notice.map((item, index) => (
                                    <div className={`${item.seen ? 'bg-[#c8c8c8]' : 'bg-white hover:bg-[#c8c8c8]'} grid auto-rows-max p-3 text-black ring-1 ring-black transition-colors duration-400 ease-in-out hover:cursor-pointer`} key={index} >
                                        <span className="text-start">Title: {item.message}</span>
                                        <span className="text-start">Time: {item.time}</span>
                                    </div>
                                ))}
                            </notice>
                        )}
                    </div>
                    {/* <HeaderLink to="/">{NotificationIcon()}</HeaderLink> */}
                </div >
            ) : (
                <div className="flex-[1] flex justify-end h-1/2 space-x-5 pr-5 text-xs">
                    <HeaderLink to="/signin">SIGN IN</HeaderLink>
                    <HeaderLink to="/signup">SIGN UP</HeaderLink>
                </div>
            )
            }
        </header >
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
            className="block h-full w-max px-3 content-center rounded-full transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
            to={to}
        >
            {children}
        </Link>
    );
}
