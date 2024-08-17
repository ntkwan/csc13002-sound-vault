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
    tagTypes: [
        'User',
        'Song',
        'Album',
        'Playlist',
        'AdminAccount',
        'AdminSong',
        'Report',
        'Payment',
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
            invalidatesTags: ['Song'],
        }),
        uploadSong: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-song',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['Song'],
        }),
        uploadSongThumbnail: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-song-thumbnail',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['Song'],
        }),
        submitMusic: builder.mutation({
            query: ({ file }) => ({
                url: '/submit-music',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['Song'],
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
            providesTags: ['Song'],
        }),
        getChartSongs: builder.query({
            query: (region) => `/get-songs-by-region/${region}`,
        }),
        getSongsByGenre: builder.query({
            query: (genre) => `/get-songs-by-genre/${genre}`,
        }),
        getTopSongs: builder.query({
            query: () => '/get-top-songs',
        }),
        getPopularAlbums: builder.query({
            query: () => '/get-popular-albums',
        }),
        deleteTrackById: builder.mutation({
            query: (id) => ({
                url: `/delete-track/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Song'],
        }),

        // Playlists ----------------------------------------------------------
        createPlaylist: builder.mutation({
            query: ({ name, desc }) => ({
                url: '/create-playlist',
                method: 'POST',
                body: { name, desc },
            }),
            invalidatesTags: ['Playlist'],
        }),
        deletePlaylistById: builder.mutation({
            query: (id) => ({
                url: `/delete-playlist-by-id/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Playlist'],
        }),
        addSongToPlaylist: builder.mutation({
            query: ({ playlistId, songId }) => ({
                url: '/add-song-to-playlist',
                method: 'POST',
                body: { playlistId, songId },
            }),
            invalidatesTags: ['Playlist'],
        }),
        removeSongFromPlaylist: builder.mutation({
            query: ({ playlistId, songId }) => ({
                url: '/remove-song-from-playlist',
                method: 'DELETE',
                body: { playlistId, songId },
            }),
            invalidatesTags: ['Playlist'],
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
        getProfileInfomation: builder.query({
            query: () => '/get-profile-information',
            providesTags: ['User'],
        }),
        changeProfile: builder.mutation({
            query: (body) => ({
                url: '/change-profile',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User'],
        }),
        changePassword: builder.mutation({
            query: (body) => ({
                url: '/change-password',
                method: 'POST',
                body,
            }),
        }),
        getMyProfile: builder.query({
            query: () => '/get-my-profile',
            providesTags: ['User'],
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
            providesTags: ['Song'],
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
            invalidatesTags: ['User'],
        }),
        uploadProfileCover: builder.mutation({
            query: ({ file }) => ({
                url: '/upload-profile-cover',
                method: 'POST',
                body: file,
            }),
            invalidatesTags: ['User'],
        }),
        getRecentlyPlayedSongs: builder.query({
            query: () => '/get-recently-played-songs',
            providesTags: ['User'],
        }),
        getSearchResults: builder.query({
            query: (query) => `/search?q=${encodeURIComponent(query)}`,
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

        // Reports -----------------------------------------------------------
        replyReport: builder.mutation({
            query: ({ reportID, message }) => ({
                url: '/reply-report',
                method: 'POST',
                body: { reportID, message },
            }),
            invalidatesTags: ['Report'],
        }),
        rejectReport: builder.mutation({
            query: (reportID) => ({
                url: '/reject-report',
                method: 'POST',
                body: { reportID },
            }),
            invalidatesTags: ['Report'],
        }),
        sendReportOnSong: builder.mutation({
            query: ({
                songId,
                fullName,
                phoneNumber,
                email,
                idNumber,
                rpType,
                rpCategory,
                reason,
            }) => ({
                url: `/send-report-on-song/${songId}`,
                method: 'POST',
                body: {
                    fullName,
                    phoneNumber,
                    email,
                    idNumber,
                    rpType,
                    rpCategory,
                    reason,
                },
            }),
            invalidatesTags: ['Report'],
        }),
        sendReportOnProfile: builder.mutation({
            query: ({
                profileId,
                fullName,
                phoneNumber,
                email,
                idNumber,
                rpType,
                rpCategory,
                reason,
            }) => ({
                url: `/send-report-on-profile/${profileId}`,
                method: 'POST',
                body: {
                    fullName,
                    phoneNumber,
                    email,
                    idNumber,
                    rpType,
                    rpCategory,
                    reason,
                },
            }),
            invalidatesTags: ['Report'],
        }),
        getReports: builder.query({
            query: () => '/get-reports',
            providesTags: ['Report'],
        }),

        // Payment -----------------------------------------------------------
        getAllPaymentHistory: builder.query({
            query: () => '/get-all-payment-history',
            providesTags: ['Payment'],
        }),
        getPaymentHistory: builder.query({
            query: () => '/get-payment-history',
            providesTags: ['Payment'],
        }),
        getWithdrawRequests: builder.query({
            query: () => '/get-withdraw-requests',
            providesTags: ['Payment'],
        }),
        confirmWebhookPayos: builder.mutation({
            query: (body) => ({
                url: '/payos/confirm-webhook',
                method: 'POST',
                body,
            }),
        }),
        confirmWebhookCasso: builder.mutation({
            query: (body) => ({
                url: '/casso/confirm-webhook',
                method: 'POST',
                body,
            }),
        }),
        deposit: builder.mutation({
            query: (body) => ({
                url: '/deposit',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User', 'Payment'],
        }),
        donate: builder.mutation({
            query: (body) => ({
                url: '/donate',
                method: 'POST',
                body,
            }),
            invalidatesTags: ['User', 'Payment'],
        }),
        withdraw: builder.mutation({
            query: () => ({
                url: '/withdraw',
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Payment'],
        }),
        processDeposit: builder.mutation({
            query: (paymentId) => ({
                url: `/process-deposit/${paymentId}`,
                method: 'PUT',
            }),
        }),
        processWithdraw: builder.mutation({
            query: (orderId) => ({
                url: `/process-withdraw/${orderId}`,
                method: 'PUT',
            }),
        }),
        cancelWithdraw: builder.mutation({
            query: (orderId) => ({
                url: `/cancel-withdraw/${orderId}`,
                method: 'PUT',
            }),
            invalidatesTags: ['Payment'],
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
    useSubmitMusicMutation,
    useGetFeaturedArtistsQuery,
    usePlaySongMutation,
    useUndoPlaySongMutation,
    useGetTrendingSongsQuery,
    useGetNewSongsQuery,
    useGetSongByIdQuery,
    useGetChartSongsQuery,
    useGetSongsByGenreQuery,
    useGetTopSongsQuery,
    useGetPopularAlbumsQuery,
    useDeleteTrackByIdMutation,
    useLazyGetSearchResultsQuery,

    // Playlists -------------------------------------------------------------
    useCreatePlaylistMutation,
    useDeletePlaylistByIdMutation,
    useAddSongToPlaylistMutation,
    useRemoveSongFromPlaylistMutation,
    useAddSongToLikedPlaylistMutation,
    useRemoveSongFromLikedPlaylistMutation,
    useGetPlaylistByIdQuery,
    useLazyGetPlaylistByIdQuery,
    useGetMyPlaylistsQuery,

    // User -------------------------------------------------------------------
    useGetProfileInfomationQuery,
    useChangeProfileMutation,
    useChangePasswordMutation,
    useGetProfileByIdQuery,
    useGetMyProfileQuery,
    useGetFollowingListByIdQuery,
    useGetFollowButtonByIdQuery,
    useFollowProfileByIdMutation,
    useUnfollowProfileByIdMutation,
    useGetProfilePopularSongsQuery,
    useGetProfileAllSongsQuery,
    useLazyGetProfileAllSongsQuery,
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

    // Reports ----------------------------------------------------------------
    useReplyReportMutation,
    useRejectReportMutation,
    useSendReportOnSongMutation,
    useSendReportOnProfileMutation,
    useGetReportsQuery,

    // Payment ----------------------------------------------------------------
    useGetAllPaymentHistoryQuery,
    useGetPaymentHistoryQuery,
    useGetWithdrawRequestsQuery,
    useConfirmWebhookPayosMutation,
    useConfirmWebhookCassoMutation,
    useDepositMutation,
    useDonateMutation,
    useWithdrawMutation,
    useProcessDepositMutation,
    useProcessWithdrawMutation,
    useCancelWithdrawMutation,
} = api;
