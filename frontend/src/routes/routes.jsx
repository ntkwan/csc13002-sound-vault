import { createBrowserRouter } from 'react-router-dom';

import { DefaultLayout, AuthenticationLayout } from '@layouts';
import {
    HomePage,
    ProfilePage,
    ArtistPage,
    SignInPage,
    SignUpPage,
    ResetPassPage,
    ForgotPassPage,
    ChartPage,
} from '@pages';

const router = createBrowserRouter([
    {
        Component: DefaultLayout,
        children: [
            { path: '', Component: HomePage },
            { path: 'profile', Component: ProfilePage },
            { path: 'artist', Component: ArtistPage },
            { path: 'chart', Component: ChartPage },
        ],
    },
    {
        Component: AuthenticationLayout,
        children: [
            { path: 'signin', Component: SignInPage },
            { path: 'signup', Component: SignUpPage },
            { path: 'reset-password', Component: ResetPassPage },
            { path: 'forgot-password', Component: ForgotPassPage },
        ],
    },
]);

export default router;
