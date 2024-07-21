import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logOut, setCredentials } from '@features/authentication/slices';
import { resetPlayer } from '@features/player/slices';

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
    tagTypes: ['User', 'Song', 'Album'],
    endpoints: (builder) => ({
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
                    window.location.reload();
                } catch (error) {
                    console.error('Failed to log out', error);
                }
            },
        }),
        uploadAudio: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-audio',
                method: 'POST',
                body: file,
            }),
        }),
        playSong: builder.mutation({
            query: (id) => ({
                url: `/play-song/${id}`,
                method: 'POST',
            }),
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
        getPlaylistById: builder.query({
            query: (id) => `/get-playlist-by-id/${id}`,
        }),
        getMyProfile: builder.query({
            query: () => '/get-my-profile',
        }),
        getProfileById: builder.query({
            query: (id) => `/get-profile-by-id/${id}`,
            providesTags: ['User'],
        }),
        getFollowingListById: builder.query({
            query: (id) => `/get-following-list-by-id/${id}`,
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
    }),
});

export const {
    useSignInMutation,
    useSignUpMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
    useLogOutMutation,
    useUploadAudioMutation,
    useGetFeaturedArtistsQuery,
    usePlaySongMutation,
    useGetTrendingSongsQuery,
    useGetNewSongsQuery,
    useGetSongByIdQuery,
    useGetChartSongsQuery,
    useGetTopSongsQuery,
    useGetPopularAlbumsQuery,
    useCreatePlaylistMutation,
    useDeletePlaylistByIdMutation,
    useAddSongToPlaylistMutation,
    useRemoveSongFromPlaylistMutation,
    useGetPlaylistByIdQuery,
    useGetMyProfileQuery,
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
} = api;
