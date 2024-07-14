import { Outlet, useLocation } from 'react-router-dom';
import { Header, Sidebar } from '@components';
import { Player } from '@features/player/components';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPlayer, selectCurrentToken } from '@services/selectors';
import { useEffect } from 'react';
import { resetPlayer } from '@features/player/slices';

function DefaultLayout() {
    const { currentTrack } = useSelector(selectCurrentPlayer);
    const token = useSelector(selectCurrentToken);
    const dispatch = useDispatch();
    const location = useLocation();

    useEffect(() => {
        if (!token) {
            dispatch(resetPlayer());
        }
    }, [token, dispatch]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <>
            <Header />
            <Sidebar />
            <main className="relative mb-[70px] ml-[175px] mt-[70px] px-28 pb-8">
                <Outlet />
            </main>
            {currentTrack.id !== -1 && <Player />}
        </>
    );
}

export default DefaultLayout;
