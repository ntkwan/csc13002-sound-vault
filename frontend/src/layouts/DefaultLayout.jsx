import { Outlet } from 'react-router-dom';
import { Header, Sidebar } from '@components';
import { Player } from '@features/player/components';

function DefaultLayout() {
    return (
        <>
            <Header />
            <Sidebar />
            <main className="relative mb-[70px] ml-[175px] mt-[70px] px-28 pb-8">
                <Outlet />
            </main>
            <Player />
        </>
    );
}

export default DefaultLayout;
