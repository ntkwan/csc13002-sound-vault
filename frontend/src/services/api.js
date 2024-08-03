import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '@features/authentication/slices';
import { resetPlayer } from '@features/player/slices';
import { updateInfo } from '@features/profilepage/slices';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        const refreshResult = await baseQuery(
            {
                url: '/refresh-token',
                method: 'POST',
            },
            api,
            extraOptions,
        );
        if (refreshResult?.data) {
            const user = api.getState().auth.user;
            api.dispatch(
                setCredentials({ user, token: refreshResult.data.token }),
            );
            result = await baseQuery(args, api, extraOptions);
        } else {
            api.dispatch(logOut());
        }
    }
    return result;
};

export const api = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'User',
        'Song',
        'Album',
        'Playlist',
        'AdminAccount',
        'AdminSong',
    ],
    endpoints: (builder) => ({
        // Authentication -----------------------------------------------------
        signIn: builder.mutation({
            query: (body) => ({
                url: '/signin',
                method: 'POST',
                body,
            }),
            async onQueryStarted(body, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    const user = body.email;
                    dispatch(
                        setCredentials({
                            user,
                            token: data.accessToken,
                            isAdmin: data.is_admin,
                        }),
                    );
                    dispatch(resetPlayer());

                    const profile = await dispatch(
                        api.endpoints.getMyProfile.initiate(),
                    ).unwrap();
                    dispatch(updateInfo(profile));

                    await dispatch(
                        api.endpoints.getMyPlaylists.initiate(),
                    ).unwrap();
                } catch (error) {
                    console.error(error?.error?.data?.message);
                }
            },
        }),
        signUp: builder.mutation({
            query: (body) => ({
                url: '/signup',
                method: 'POST',
                body,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (body) => ({
                url: '/forgot-password',
                method: 'POST',
                body,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ email, token, body }) => ({
                url: `/reset-password/${email}/${token}`,
                method: 'POST',
                body,
            }),
        }),
        logOut: builder.mutation({
            query: () => ({
                url: '/signout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(resetPlayer());
                    dispatch(logOut());
                } catch (error) {
                    console.error('Failed to log out', error);
                }
            },
        }),

        // Songs --------------------------------------------------------------
        uploadAudio: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-audio',
                method: 'POST',
                body: file,
            }),
        }),
        uploadSong: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-song',
                method: 'POST',
                body: file,
            }),
        }),
        uploadSongThumbnail: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-song-thumbnail',
                method: 'POST',
                body: file,
            }),
        }),
        playSong: builder.mutation({
            query: (id) => ({
                url: `/play-song/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['User'],
        }),
        undoPlaySong: builder.mutation({
            query: (id) => ({
                url: `/undo-play-song/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['User'],
        }),
        getFeaturedArtists: builder.query({
            query: () => '/get-featured-artists',
        }),
        getTrendingSongs: builder.query({
            query: () => '/get-trending-songs',
        }),
        getNewSongs: builder.query({
            query: () => '/get-new-songs',
        }),
        getSongById: builder.query({
            query: (id) => `/get-song-by-id/${id}`,
        }),
        getChartSongs: builder.query({
            query: (region) => `/get-songs-by-region/${region}`,
        }),
        getTopSongs: builder.query({
            query: () => '/get-top-songs',
        }),
        getPopularAlbums: builder.query({
            query: () => '/get-popular-albums',
        }),

        // Playlists ----------------------------------------------------------
        createPlaylist: builder.mutation({
            query: (body) => ({
                url: '/create-playlist',
                method: 'POST',
                body,
            }),
        }),
        deletePlaylistById: builder.mutation({
            query: (id) => ({
                url: `/delete-playlist-by-id/${id}`,
                method: 'DELETE',
            }),
        }),
        addSongToPlaylist: builder.mutation({
            query: (body) => ({
                url: '/add-song-to-playlist',
                method: 'POST',
                body,
            }),
        }),
        removeSongFromPlaylist: builder.mutation({
            query: (body) => ({
                url: '/remove-song-from-playlist',
                method: 'POST',
                body,
            }),
        }),
        addSongToLikedPlaylist: builder.mutation({
            query: (id) => ({
                url: `/add-song-to-liked-playlist/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['Playlist'],
        }),
        removeSongFromLikedPlaylist: builder.mutation({
            query: (id) => ({
                url: `/remove-song-from-liked-playlist/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlist'],
        }),
        getPlaylistById: builder.query({
            query: (id) => `/get-playlist-by-id/${id}`,
            providesTags: ['Playlist'],
        }),
        getMyPlaylists: builder.query({
            query: () => '/get-my-playlists',
            providesTags: ['Playlist'],
        }),

        // User --------------------------------------------------------------
        getMyProfile: builder.query({
            query: () => '/get-my-profile',
        }),
        getProfileById: builder.query({
            query: (id) => `/get-profile-by-id/${id}`,
            providesTags: ['User'],
        }),
        getFollowingListById: builder.query({
            query: (id) => `/get-following-list-by-id/${id}`,
            providesTags: ['User'],
        }),
        getFollowButtonById: builder.query({
            query: (id) => `/get-follow-button-by-id/${id}`,
            providesTags: ['User'],
        }),
        followProfileById: builder.mutation({
            query: (id) => ({
                url: `/follow-profile-by-id/${id}`,
                method: 'POST',
                body: id,
            }),
            invalidatesTags: ['User'],
        }),
        unfollowProfileById: builder.mutation({
            query: (id) => ({
                url: `/unfollow-profile-by-id/${id}`,
                method: 'POST',
                body: id,
            }),
            invalidatesTags: ['User'],
        }),
        getProfilePopularSongs: builder.query({
            query: (id) => `/get-profile-popular-songs/${id}`,
        }),
        getProfileAllSongs: builder.query({
            query: (id) => `/get-profile-all-songs/${id}`,
        }),
        getProfileAlbums: builder.query({
            query: (id) => `/get-profile-albums/${id}`,
        }),
        uploadProfilePic: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-profile-pic',
                method: 'POST',
                body: file,
            }),
        }),
        uploadProfileCover: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-profile-cover',
                method: 'POST',
                body: file,
            }),
        }),
        getRecentlyPlayedSongs: builder.query({
            query: () => '/get-recently-played-songs',
            providesTags: ['User'],
        }),

        // Admin -------------------------------------------------------------
        setVerifiedArtistById: builder.mutation({
            query: (id) => ({
                url: `/set-verified-artist-by-id/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminAccount'],
        }),
        getAllAccounts: builder.query({
            query: () => '/get-all-accounts',
            providesTags: ['AdminAccount'],
        }),
        removeAccountById: builder.mutation({
            query: (id) => ({
                url: `/remove-account-by-id/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminAccount'],
        }),
        banAccount: builder.mutation({
            query: ({ profileId, days, reason }) => ({
                url: '/ban-account',
                method: 'POST',
                body: { profileId, days, reason },
            }),
            invalidatesTags: ['AdminAccount'],
        }),
        getAccountBanStatusById: builder.query({
            query: (id) => `/get-account-ban-status-by-id/${id}`,
            providesTags: ['AdminAccount'],
        }),
        getAllSongs: builder.query({
            query: () => '/get-all-songs',
            providesTags: ['AdminSong'],
        }),
        setVerifiedSongById: builder.mutation({
            query: (id) => ({
                url: `/set-verified-song-by-id/${id}`,
                method: 'PUT',
            }),
            invalidatesTags: ['AdminSong'],
        }),
        removeSongById: builder.mutation({
            query: (id) => ({
                url: `/remove-song-by-id/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['AdminSong'],
        }),
        deactivateSong: builder.mutation({
            query: (id) => ({
                url: `/deactivate-song/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminSong'],
        }),
        activateSong: builder.mutation({
            query: (id) => ({
                url: `/activate-song/${id}`,
                method: 'POST',
            }),
            invalidatesTags: ['AdminSong'],
        }),
    }),
});

export const {
    // Authentication ---------------------------------------------------------
    useSignInMutation,
    useSignUpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogOutMutation,

    // Songs ------------------------------------------------------------------
    useUploadAudioMutation,
    useUploadSongMutation,
    useUploadSongThumbnailMutation,
    useGetFeaturedArtistsQuery,
    usePlaySongMutation,
    useUndoPlaySongMutation,
    useGetTrendingSongsQuery,
    useGetNewSongsQuery,
    useGetSongByIdQuery,
    useGetChartSongsQuery,
    useGetTopSongsQuery,
    useGetPopularAlbumsQuery,

    // Playlists -------------------------------------------------------------
    useCreatePlaylistMutation,
    useDeletePlaylistByIdMutation,
    useAddSongToPlaylistMutation,
    useRemoveSongFromPlaylistMutation,
    useAddSongToLikedPlaylistMutation,
    useRemoveSongFromLikedPlaylistMutation,
    useGetPlaylistByIdQuery,
    useGetMyPlaylistsQuery,

    // User -------------------------------------------------------------------
    useGetProfileByIdQuery,
    useGetFollowingListByIdQuery,
    useGetFollowButtonByIdQuery,
    useFollowProfileByIdMutation,
    useUnfollowProfileByIdMutation,
    useGetProfilePopularSongsQuery,
    useGetProfileAllSongsQuery,
    useGetProfileAlbumsQuery,
    useUploadProfilePicMutation,
    useUploadProfileCoverMutation,
    useGetRecentlyPlayedSongsQuery,

    // Admin ------------------------------------------------------------------
    useSetVerifiedArtistByIdMutation,
    useGetAllAccountsQuery,
    useRemoveAccountByIdMutation,
    useBanAccountMutation,
    useGetAccountBanStatusByIdQuery,
    useGetAllSongsQuery,
    useSetVerifiedSongByIdMutation,
    useRemoveSongByIdMutation,
    useDeactivateSongMutation,
    useActivateSongMutation,
} = api;
