import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import router from '@routes';
import { useGetMyPlaylistsQuery, useGetMyProfileQuery } from '@services/api';
import { useSelector } from 'react-redux';
import { selectCurrentToken } from '@services/selectors';

function App() {
    const token = useSelector(selectCurrentToken);
    useGetMyProfileQuery(undefined, { skip: !token });
    useGetMyPlaylistsQuery(undefined, { skip: !token });
    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss={false}
                draggable
                pauseOnHover={false}
                theme="light"
                transition:Bounce
            />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
