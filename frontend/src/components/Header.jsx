import { Link } from 'react-router-dom';
import { NotificationIcon } from '.'

function Header({ setIsExploring }) {
  return (
    <div className="header select-none
                    flex justify-between items-center fixed top-0 left-0 right-0 z-10 h-[70px] px-5 text-sm backdrop-blur-md
                    after:contents-[''] after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-white">
      {/* Logo */}
      <span className="header__logo flex-[1] font-lilitaone text-4xl pr-5">SoundVault</span>
      {/* Search bar */}
      <div className="header__search-container flex-[2] flex justify-center items-center relative">
        <i className="header__search-icon ti-search absolute left-[27%] text-base text-[#B5B3B3]"></i>
        <input
          className="header__search-input w-1/2 h-9 px-11 rounded-full bg-[#443F3F66] placeholder:italic placeholder:text-[#B5B3B3]"
          type="text" placeholder="search music, album, artist,..."
          onFocus={() => setIsExploring(true)}
          onBlur={() => setIsExploring(false)}>
        </input>
      </div>
      {/* link */}
      <div className="header__link flex-[1] flex justify-end items-center space-x-5 h-1/2 pl-5 text-xs uppercase">
        <HeaderLink to="/signin">sign up</HeaderLink>
        <HeaderLink to="/signup">sign in</HeaderLink>
        {/* <HeaderLink to="/"><i class="ti-bell text-[17px]"></i></HeaderLink> */}
        <HeaderLink to="/">{NotificationIcon()}</HeaderLink>
      </div>
    </div>
  )
}

export default Header;

function HeaderLink({ to, children }) {
  return (
    <Link
      className="block w-max h-full px-[9px] content-center rounded-full hover:cursor-pointer 
               hover:bg-white hover:bg-opacity-25 transition-colors duration-300 ease-in-out"
      to={to}>
      {children}
    </Link>
  );
}