import "../../../../assets/themify-icons/themify-icons.css"
import { Link } from 'react-router-dom';

function Header() {
  return (
    <div className="header select-none
                    flex justify-between items-center fixed top-0 left-0 right-0 z-10 h-[75px] px-5 text-sm text-white backdrop-blur-md bg-black bg-opacity-10
                    after:contents-[''] after:absolute after:bottom-0 after:left-5 after:right-5 after:h-px after:bg-white">
      {/* Logo */}
      <span className="flex-[1] font-lilitaOne text-4xl pr-5">SoundVault</span>
      {/* Search bar */}
      <div className="flex-[2] flex justify-center items-center relative">
        <i className="ti-search absolute left-[27.5%] text-base text-[#B5B3B3]"></i>
        <input className="w-1/2 h-10 px-11 rounded-full bg-[#443F3F66] 
                          placeholder:italic placeholder:text-[#B5B3B3]" type="text" placeholder="search music, album, artist,..."></input>
      </div>
      {/* link */}
      <div className="flex-[1] flex justify-around items-center pl-1 uppercase">
        <HeaderLink to="/">Login</HeaderLink>
        <HeaderLink to="/">Register</HeaderLink>
        <HeaderLink to="/"><i className="ti-bell text-2xl"></i></HeaderLink>
      </div>
    </div>
  )
}

export default Header;

function HeaderLink({ to, children }) {
  return (
    <Link to={to} className="w-max px-4 py-3 rounded-full hover:cursor-pointer hover:bg-[#443f3fb9]
                               transition-colors duration-300 ease-in-out">
      {children}
    </Link>
  );
}