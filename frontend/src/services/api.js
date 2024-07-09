import { logOut, setCredentials } from '@features/authentication/slices';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
            '/refresh-token',
            api,
            extraOptions,
        );
        console.log(refreshResult);
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
            },
        }),
        uploadAudio: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-audio',
                method: 'POST',
                body: file,
            }),
        }),
        getTrendingSongs: builder.query({
            query: () => '/get-trending-songs',
        }),
        getNewSongs: builder.query({
            query: () => '/get-new-songs',
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
    useGetTrendingSongsQuery,
    useGetNewSongsQuery,
} = api;
