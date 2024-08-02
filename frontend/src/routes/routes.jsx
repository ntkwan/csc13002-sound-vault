import { createBrowserRouter } from 'react-router-dom';
import { DefaultLayout, AuthenticationLayout, Protected } from '@layouts';
import {
    HomePage,
    ChartPage,
    TrendingPage,
    NewReleasePage,
    AlbumPage,
    PlaylistPage,
    ProfilePage,
    ProfilePageUploadMusic,
    ProfilePageEditing,
    LibraryPage,
    ArtistPage,
    TermAndPolicyPage,
    AboutUsPage,
    SignInPage,
    SignUpPage,
    ResetPassPage,
    ForgotPassPage,
    AdminAccountPage,
    AdminSongPage,
    ReviewReportPage,
    NotFoundPage,
    TopicsAndGenrePage,
    SongPage,
    UserSettingPage,
} from '@pages';

const router = createBrowserRouter([
    {
        Component: DefaultLayout,
        errorElement: NotFoundPage,
        children: [
            {
                element: <Protected roles={'common'} />,
                children: [
                    { path: 'song/:songId', Component: SongPage },
                    { path: 'profile/:profileId', Component: ProfilePage },
                ],
            },
            {
                element: <Protected roles={'guest'} />,
                children: [
                    { index: true, Component: HomePage },
                    { path: 'chart', Component: ChartPage },
                    { path: 'trending', Component: TrendingPage },
                    { path: 'newrelease', Component: NewReleasePage },
                    { path: 'album', Component: AlbumPage },
                    { path: 'playlist/:playlistId', Component: PlaylistPage },
                    { path: 'artist', Component: ArtistPage },
                    { path: 'aboutus', Component: AboutUsPage },
                    { path: 'termandpolicy', Component: TermAndPolicyPage },
                    { path: 'topicsgenre', Component: TopicsAndGenrePage },
                ],
            },
            {
                element: <Protected roles={'user'} />,
                children: [
                    { path: 'library', Component: LibraryPage },
                    { path: 'profile', Component: ProfilePage },
                    {
                        path: 'profile/upload-music',
                        Component: ProfilePageUploadMusic,
                    },
                    { path: 'profile/editing', Component: ProfilePageEditing },
                    { path: 'user/setting', Component: UserSettingPage },
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
