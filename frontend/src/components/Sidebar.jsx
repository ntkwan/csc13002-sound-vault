import { NavLink } from 'react-router-dom';
import { HomeIcon, ProfileIcon, MusicIcon, HeadphoneIcon } from '.';
import {
    SettingIcon,
    EmailIcon,
    InfoIcon,
    TopicsGenreIcon,
    WalletIcon,
    WithdrawIcon,
} from '.';
import { selectCurrentAdmin, selectCurrentToken } from '@services/selectors';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import PropTypes from 'prop-types';

function Sidebar() {
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);

    return (
        <aside className="sidebar fixed bottom-[80px] top-[70px] z-10 mt-6 max-w-[185px] select-none flex-col space-y-16 overflow-hidden text-xs uppercase backdrop-blur-md hover:overflow-y-scroll">
            <section className="ml-2">
                <span className="ml-3">Browse</span>
                <div>
                    {isAdmin ? (
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
                                label="review reports"
                            />
                            <SidebarLink
                                to="admin/transaction"
                                icon={WalletIcon}
                                label="transaction"
                            />
                            <SidebarLink
                                to="admin/withdraw"
                                icon={WithdrawIcon}
                                label="withdrawal requests"
                            />
                        </>
                    ) : (
                        <>
                            <SidebarLink to="" icon={HomeIcon} label="home" />
                            {token ? (
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
                            ) : null}
                            <SidebarLink
                                to="artist"
                                icon={HeadphoneIcon}
                                label="artists"
                            />
                            <SidebarLink
                                to="topicsgenre"
                                icon={TopicsGenreIcon}
                                label="Topics & Genre"
                            />
                            {token ? (
                                <SidebarLink
                                    to="wallet"
                                    icon={WalletIcon}
                                    label="wallet"
                                />
                            ) : null}
                        </>
                    )}
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
                                to="termandpolicy"
                                icon={InfoIcon}
                                label="Terms & Policy"
                            />
                        </>
                    )}
                    {token && (
                        <SidebarLink
                            to={isAdmin ? 'admin/setting' : 'user/setting'}
                            icon={SettingIcon}
                            label="setting"
                        />
                    )}
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
            <span className="nowrap pl-3">{label}</span>
            {children}
        </NavLink>
    );
}

export default Sidebar;
