import { NavLink } from "react-router-dom";
import { HomeIcon, ProfileIcon, MusicIcon, HeadphoneIcon } from ".";
import { SettingIcon, EmailIcon, InfoIcon } from ".";
import PropTypes from "prop-types";

function Sidebar() {
  return (
    <div className="sidebar fixed bottom-[70px] top-[70px] z-10 flex w-max select-none flex-col justify-evenly text-xs uppercase backdrop-blur-md">
      <div className="ml-2">
        <span className="ml-3">Browse</span>
        <SidebarLink to="" icon={HomeIcon}>
          Home
        </SidebarLink>
        <SidebarLink to="profile" icon={ProfileIcon}>
          Profile
        </SidebarLink>
        <SidebarLink to="library" icon={MusicIcon}>
          Library
        </SidebarLink>
        <SidebarLink to="artist" icon={HeadphoneIcon}>
          Artists
        </SidebarLink>
      </div>
      <div className="ml-2">
        <span className="ml-3">Help</span>
        <SidebarLink to="setting" icon={SettingIcon}>
          Settings
        </SidebarLink>
        <SidebarLink to="aboutus" icon={EmailIcon}>
          About Us
        </SidebarLink>
        <SidebarLink to="term&policy" icon={InfoIcon}>
          Terms & Policy
        </SidebarLink>
      </div>
    </div>
  );
}

export default Sidebar;

SidebarLink.propTypes = {
  to: PropTypes.string,
  icon: PropTypes.func,
  children: PropTypes.node,
};

function SidebarLink({ to, icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative my-1 flex items-center rounded-full px-3 py-3 leading-none transition-colors duration-400 ease-in-out ${isActive ? "bg-white bg-opacity-20" : "hover:bg-white hover:bg-opacity-20"}`
      }
    >
      {icon()}
      <span className="pl-3">{children}</span>
    </NavLink>
  );
}
