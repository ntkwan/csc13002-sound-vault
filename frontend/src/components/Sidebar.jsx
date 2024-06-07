import { NavLink } from 'react-router-dom';
import { HomeIcon, ProfileIcon, MusicIcon, HeadphoneIcon } from '.';
import { SettingIcon, EmailIcon, InfoIcon } from '.';

function Sidebar() {
    return (
        <div className="sidebar select-none flex flex-col justify-evenly fixed top-[70px] bottom-[70px] z-10
                        w-max backdrop-blur-md uppercase text-xs">
            <div className="ml-2">
                <span className="ml-3">Brown</span>
                <SidebarLink to="" icon={HomeIcon}>Home</SidebarLink>
                <SidebarLink to="profile" icon={ProfileIcon}>Profile</SidebarLink>
                <SidebarLink to="library" icon={MusicIcon}>Library</SidebarLink>
                <SidebarLink to="artist" icon={HeadphoneIcon}>Artists</SidebarLink>
            </div>
            <div className="ml-2">
                <span className="ml-3">Help</span>
                <SidebarLink to="setting" icon={SettingIcon}>Settings</SidebarLink>
                <SidebarLink to="aboutus" icon={EmailIcon}>About Us</SidebarLink>
                <SidebarLink to="term&policy" icon={InfoIcon}>Terms & Policy</SidebarLink>
            </div>
        </div>
    )
}

export default Sidebar;

function SidebarLink({ to, icon, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `relative flex items-center px-3 py-3 my-1 rounded-full leading-none transition-colors duration-300 ease-in-out
                ${isActive ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'}`}>
            {/* <i className={`${icon} text-2xl`}></i> */}
            {icon()}
            <span className="pl-3">{children}</span>
        </NavLink>
    );
}  
