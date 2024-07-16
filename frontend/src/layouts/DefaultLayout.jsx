import { Outlet, ScrollRestoration } from 'react-router-dom';
import { Header, Sidebar } from '@components';
import { Player } from '@features/player/components';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCurrentGlobalLoading,
    selectCurrentLocalLoading,
    selectCurrentPlayer,
    selectCurrentToken,
} from '@services/selectors';
import { useEffect } from 'react';
import { resetPlayer } from '@features/player/slices';
import { Loading } from '@components/index';

function DefaultLayout() {
    const { currentTrack } = useSelector(selectCurrentPlayer);
    const token = useSelector(selectCurrentToken);
    const isLocalLoading = useSelector(selectCurrentLocalLoading);
    const isGlobalLoading = useSelector(selectCurrentGlobalLoading);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!token) {
            dispatch(resetPlayer());
        }
    }, [token, dispatch]);
    return isGlobalLoading ? (
        <Loading />
    ) : (
        <>
            <Header />
            <Sidebar />
            <main className="relative mb-[70px] ml-[175px] mt-[70px] px-20 pb-8">
                {isLocalLoading ? <Loading /> : <Outlet />}
            </main>
            {currentTrack.id !== -1 && <Player />}
            <ScrollRestoration />
        </>
    );
}

export default DefaultLayout;
