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
    AdminAccountPage,
    AdminSongPage,
    ReviewReportPage,
} from '@pages';

const router = createBrowserRouter([
    {
        Component: DefaultLayout,
        errorElement: NotFoundPage,
        children: [
            {
                element: <Protected roles={'guess'} />,
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
                ],
            },
            {
                element: <Protected roles={'user'} />,
                children: [
                    { path: 'library', Component: LibraryPage },
                    { path: 'profile', Component: ProfilePage },
                    { path: 'profile/editing', Component: ProfilePageEditing },
                ],
            },
            {
                element: <Protected roles={'admin'} />,
                children: [
                    { path: 'admin/song', Component: AdminSongPage },
                    { path: 'admin/user', Component: AdminAccountPage },
                    { path: 'admin/report', Component: ReviewReportPage },
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
