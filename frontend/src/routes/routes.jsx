import { createBrowserRouter } from 'react-router-dom';

import { DefaultLayout, AuthenticationLayout } from '@layouts';
import {
    HomePage,
    ProfilePage,
    ProfilePageEditing,
    ArtistPage,
    SignInPage,
    SignUpPage,
    ResetPassPage,
    ForgotPassPage,
} from '@pages';

const router = createBrowserRouter([
    {
        Component: DefaultLayout,
        children: [
            { path: '', Component: HomePage },
            { path: 'profile', Component: ProfilePage },
            { path: 'profile/editing', Component: ProfilePageEditing },
            { path: 'artist', Component: ArtistPage },
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
