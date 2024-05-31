import "../../../../assets/themify-icons/themify-icons.css"
import { Link } from 'react-router-dom';

function Sidebar() {
    return (
        <div className="sidebar select-none flex flex-col justify-between fixed top-[75px] bottom-0 z-10
                    w-max py-16 backdrop-blur-md uppercase text-xs text-white">
            <div className="ml-2">
                <span className="ml-3">Brown</span>
                <SidebarLink to="/" icon="ti-home">Home</SidebarLink>
                <SidebarLink to="profile" icon="ti-user">Profile</SidebarLink>
                <SidebarLink to="/" icon="ti-music-alt">Library</SidebarLink>
                <SidebarLink to="/" icon="ti-headphone">Artists</SidebarLink>
            </div>
            <div className="ml-2">
                <span className="ml-3">Help</span>
                <SidebarLink to="/" icon="ti-settings">Settings</SidebarLink>
                <SidebarLink to="/" icon="ti-email">About Us</SidebarLink>
                <SidebarLink to="/" icon="ti-info-alt">Terms & Policy</SidebarLink>
            </div>
        </div>
    )
}

export default Sidebar;

function SidebarLink({ to, icon, children }) {
    return (
        <Link to={to} className="flex items-center px-3 py-[10px] my-1 rounded-full hover:bg-[#443f3fb9]
                              transition-colors duration-300 ease-in-out">
            <i className={`${icon} text-2xl`}></i>
            <span className="pl-3">{children}</span>
        </Link>
    );
}  
