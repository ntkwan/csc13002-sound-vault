import { NavLink } from 'react-router-dom';
import { HomeIcon, ProfileIcon, MusicIcon, HeadphoneIcon } from '.';
import { SettingIcon, EmailIcon, InfoIcon } from '.';
import { selectCurrentToken } from '@services/selectors';
import { selectUserProfile } from '@features/profilepage/slices';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import PropTypes from 'prop-types';

function Sidebar() {
    const token = useSelector(selectCurrentToken);
    const userProfile = useSelector(selectUserProfile);
    const isAdmin = userProfile?.isAdmin;

    return (
        <aside className="sidebar fixed bottom-[70px] top-[70px] z-10 w-max select-none space-y-10 pt-10 text-xs uppercase backdrop-blur-md">
            <section className="ml-2">
                <span className="ml-3">Browse</span>
                <div>
                    <SidebarLink
                        to=""
                        icon={HomeIcon}
                        label="home"
                    />
                    {token ? (
                        isAdmin ? (
                            <>
                                <SidebarLink
                                    to="admin/user"
                                    icon={ProfileIcon}
                                    label="users"
                                />
                                <SidebarLink
                                    to="admin/song"
                                    icon={MusicIcon}
                                    label="songs"
                                />
                                <SidebarLink
                                    to="admin/report"
                                    icon={EmailIcon}
                                    label="review report"
                                />
                            </>
                        ) : (
                            <>
                                <SidebarLink
                                    to="profile"
                                    icon={ProfileIcon}
                                    label="profile"
                                />
                                <SidebarLink
                                    to="library"
                                    icon={MusicIcon}
                                    label="library"
                                />
                            </>
                        )
                    ) : null}
                    <SidebarLink
                        to="artist"
                        icon={HeadphoneIcon}
                        label="artists"
                    />
                </div>
            </section>
            <section className="ml-2">
                <span className="ml-3">Help</span>
                <div>
                    {!isAdmin && (
                        <>
                            <SidebarLink
                                to="aboutus"
                                icon={EmailIcon}
                                label="About Us"
                            />
                            <SidebarLink
                                to="term&policy"
                                icon={InfoIcon}
                                label="Terms & Policy"
                            />
                        </>
                    )}
                    <SidebarLink to="setting" icon={SettingIcon} label="setting" />
                    {token && <Logout />}
                </div>
            </section>
        </aside>
    );
}

SidebarLink.propTypes = {
    to: PropTypes.string.isRequired,
    icon: PropTypes.func,
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
};

function SidebarLink({ to, icon: Icon, label, children }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `relative my-1 flex items-center rounded-full px-3 py-3 leading-none transition-colors duration-400 ease-in-out ${isActive ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'}`
            }
        >
            {Icon && <Icon />}
            <span className="pl-3">{label}</span>
            {children}
        </NavLink>
    );
}

export default Sidebar;
