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
        const refreshToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('refreshToken'))
            .split('=')[1];
        const refreshResult = await baseQuery(
            {
                url: '/refresh-token',
                method: 'POST',
                body: { refreshToken },
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
    endpoints: (builder) => ({
        signIn: builder.mutation({
            query: (body) => ({
                url: '/signin',
                method: 'POST',
                body,
            }),
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
            onQueryStarted: (_, { dispatch }) => {
                dispatch(logOut());
                dispatch(resetPlayer());
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
        getChartSongs: builder.query({
            query: (region) => `/get-songs-by-region/${region}`,
        }),
        getTopSongs: builder.query({
            query: () => '/get-top-songs',
        }),
        getMyProfile: builder.query({
            query: () => '/get-my-profile',
        }),
        getProfileById: builder.query({
            query: (id) => `/get-profile-by-id/${id}`,
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
    useGetChartSongsQuery,
    useGetTopSongsQuery,
    useGetMyProfileQuery,
    useGetProfileByIdQuery,
    useGetProfilePopularSongsQuery,
    useGetProfileAllSongsQuery,
    useGetProfileAlbumsQuery,
    useUploadProfilePicMutation,
    useUploadProfileCoverMutation,
} = api;
