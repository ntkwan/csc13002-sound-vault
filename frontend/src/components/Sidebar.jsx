import { NavLink } from 'react-router-dom';
import { HomeIcon, ProfileIcon, MusicIcon, HeadphoneIcon } from '.';
import {
    SettingIcon,
    EmailIcon,
    InfoIcon,
    TopicsGenreIcon,
    WalletIcon,
    WithdrawIcon,
    EtherscanIcon,
} from '.';
import { selectCurrentAdmin, selectCurrentToken } from '@services/selectors';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import Logout from './Logout';
import PropTypes from 'prop-types';

function Sidebar() {
    const token = useSelector(selectCurrentToken);
    const isAdmin = useSelector(selectCurrentAdmin);

    const sidebar = useRef(null);
    useEffect(() => {
        const handleObserver = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (entry.target === sidebar.current) {
                        setTimeout(() => {
                            sidebar.current.classList.remove(
                                'opacity-0',
                                '-translate-x-40',
                            );
                        }, 500);
                    }
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });

        if (sidebar.current) observer.observe(sidebar.current);

        return () => {
            if (sidebar.current) observer.unobserve(sidebar.current);
        };
    }, []);

    return (
        <aside
            className="sidebar fixed bottom-[80px] top-[70px] z-10 mt-6 w-max max-w-[190px] -translate-x-40 select-none flex-col space-y-16 overflow-hidden text-xs uppercase opacity-0 backdrop-blur-xl transition duration-700 ease-in-out hover:overflow-y-scroll"
            ref={sidebar}
        >
            <section className="ml-2 w-[170px]">
                <span className="ml-3">Browse</span>
                <div>
                    {isAdmin ? (
                        <>
                            <SidebarLink
                                to="admin/dashboard"
                                icon={HomeIcon}
                                label="dashboard"
                            />
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
                                to="admin/copyright"
                                icon={EtherscanIcon}
                                label="copyright"
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
                                label="Topics & Genres"
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
            <section className="ml-2 w-[170px]">
                <span className="ml-3">Help</span>
                <div>
                    {token && !isAdmin && (
                        <SidebarLink
                            to="user/setting"
                            icon={SettingIcon}
                            label="setting"
                        />
                    )}
                    {!isAdmin && (
                        <>
                            <SidebarLink
                                to="aboutus"
                                icon={EmailIcon}
                                label="Contact Us"
                            />
                            <SidebarLink
                                to="termandpolicy"
                                icon={InfoIcon}
                                label="Terms & Policy"
                            />
                        </>
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
                `relative my-1 flex w-full items-center rounded-full px-3 py-3 leading-4 transition-colors duration-300 ease-in-out ${isActive ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-20'}`
            }
        >
            {Icon && <Icon />}
            <span className="nowrap pl-3">{label}</span>
            {children}
        </NavLink>
    );
}

export default Sidebar;
