import { Link } from 'react-router-dom';
import { SearchIcon, NotificationIcon } from '.';
import propType from 'prop-types';
import { selectCurrentToken } from '@services/selectors';
import { useSelector } from 'react-redux';
import Logout from './Logout';

function Header() {
    const token = useSelector(selectCurrentToken);
    return (
        <div className="header after:contents-[''] fixed left-0 right-0 top-0 z-10 flex h-[70px] select-none items-center justify-between px-5 text-sm backdrop-blur-md after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-white">
            {/* Logo */}
            <span className="header__logo flex-[1] pr-5 font-lilitaone text-4xl">
                SoundVault
            </span>
            {/* Search bar */}
            <div className="header__search-container relative flex flex-[2] items-center justify-center">
                <div className="header__search-icon absolute left-[27%]">
                    {SearchIcon()}
                </div>
                <input
                    className="header__search-input h-11 w-1/2 rounded-full bg-[#443F3F66] px-11 placeholder:italic placeholder:text-[#B5B3B3] focus:border-2 focus:outline-none"
                    type="text"
                    placeholder="search music, album, artist,..."
                ></input>
            </div>
            {/* link */}
            <div className="header__link flex h-1/2 flex-[1] items-center justify-end space-x-5 pl-5 text-xs uppercase">
                {token ? (
                    <Logout />
                ) : (
                    <>
                        <HeaderLink to="/signup">sign up</HeaderLink>
                        <HeaderLink to="/signin">sign in</HeaderLink>
                    </>
                )}
                <HeaderLink to="/">{NotificationIcon()}</HeaderLink>
            </div>
        </div>
    );
}

export default Header;

HeaderLink.propTypes = {
    to: propType.string,
    children: propType.node,
};

function HeaderLink({ to, children }) {
    return (
        <Link
            className="block h-full w-max content-center rounded-full px-[9px] transition-colors duration-400 ease-in-out hover:cursor-pointer hover:bg-white hover:bg-opacity-25"
            to={to}
        >
            {children}
        </Link>
    );
}
