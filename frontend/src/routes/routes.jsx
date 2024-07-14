import { createBrowserRouter } from 'react-router-dom';
import { DefaultLayout, AuthenticationLayout, Protected } from '@layouts';
import {
    HomePage,
    ProfilePage,
    ProfilePageEditing,
    ArtistPage,
    AlbumPage,
    NewReleasePage,
    TrendingPage,
    AboutUsPage,
    ChartPage,
    SignInPage,
    SignUpPage,
    ResetPassPage,
    ForgotPassPage,
    TermAndPolicyPage,
    LibraryPage,
    NotFoundPage,
} from '@pages';

const router = createBrowserRouter([
    {
        Component: DefaultLayout,
        errorElement: NotFoundPage,
        children: [
            { index: true, Component: HomePage },
            { path: 'artist', Component: ArtistPage },
            { path: 'trending', Component: TrendingPage },
            { path: 'newrelease', Component: NewReleasePage },
            { path: 'album', Component: AlbumPage },
            { path: 'aboutus', Component: AboutUsPage },
            { path: 'chart', Component: ChartPage },
            { path: ':profileId', Component: ProfilePage },
            { path: 'termandpolicy', Component: TermAndPolicyPage },
            {
                Component: Protected,
                children: [
                    { path: 'library', Component: LibraryPage },
                    { path: 'profile', Component: ProfilePage },
                    { path: 'profile/editing', Component: ProfilePageEditing },
                ],
            },
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
    { path: '*', Component: NotFoundPage },
]);

export default router;
