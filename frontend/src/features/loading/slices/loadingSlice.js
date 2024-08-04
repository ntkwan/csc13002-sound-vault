import { createSlice } from '@reduxjs/toolkit';
import { api } from '@services/api';

const loadingSlice = createSlice({
    name: 'loading',
    initialState: {
        isGlobalLoading: false,
        isLocalLoading: false,
    },
    reducers: {
        setGlobalLoading: (state, action) => {
            state.isGlobalLoading = action.payload;
        },
        setLocalLoading: (state, action) => {
            state.isLocalLoading = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addMatcher(api.endpoints.signIn.matchPending, (state) => {
                state.isGlobalLoading = true;
            })
            .addMatcher(api.endpoints.signIn.matchFulfilled, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.signIn.matchRejected, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.signUp.matchPending, (state) => {
                state.isGlobalLoading = true;
            })
            .addMatcher(api.endpoints.signUp.matchFulfilled, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.signUp.matchRejected, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.logOut.matchPending, (state) => {
                state.isGlobalLoading = true;
            })
            .addMatcher(api.endpoints.logOut.matchFulfilled, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.logOut.matchRejected, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.resetPassword.matchPending, (state) => {
                state.isGlobalLoading = true;
            })
            .addMatcher(api.endpoints.resetPassword.matchFulfilled, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.resetPassword.matchRejected, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.forgotPassword.matchPending, (state) => {
                state.isGlobalLoading = true;
            })
            .addMatcher(
                api.endpoints.forgotPassword.matchFulfilled,
                (state) => {
                    state.isGlobalLoading = false;
                },
            )
            .addMatcher(api.endpoints.forgotPassword.matchRejected, (state) => {
                state.isGlobalLoading = false;
            })
            .addMatcher(api.endpoints.getTopSongs.matchPending, (state) => {
                state.isLocalLoading = true;
            })
            .addMatcher(api.endpoints.getTopSongs.matchFulfilled, (state) => {
                state.isLocalLoading = false;
            })
            .addMatcher(api.endpoints.getTopSongs.matchRejected, (state) => {
                state.isLocalLoading = false;
            })
            .addMatcher(
                api.endpoints.getFeaturedArtists.matchPending,
                (state) => {
                    state.isLocalLoading = true;
                },
            )
            .addMatcher(
                api.endpoints.getFeaturedArtists.matchFulfilled,
                (state) => {
                    state.isLocalLoading = false;
                },
            )
            .addMatcher(
                api.endpoints.getFeaturedArtists.matchRejected,
                (state) => {
                    state.isLocalLoading = false;
                },
            )
            .addMatcher(api.endpoints.getNewSongs.matchPending, (state) => {
                state.isLocalLoading = true;
            })
            .addMatcher(api.endpoints.getNewSongs.matchFulfilled, (state) => {
                state.isLocalLoading = false;
            })
            .addMatcher(api.endpoints.getNewSongs.matchRejected, (state) => {
                state.isLocalLoading = false;
            })
            .addMatcher(
                api.endpoints.getTrendingSongs.matchPending,
                (state) => {
                    state.isLocalLoading = true;
                },
            )
            .addMatcher(
                api.endpoints.getTrendingSongs.matchFulfilled,
                (state) => {
                    state.isLocalLoading = false;
                },
            )
            .addMatcher(
                api.endpoints.getTrendingSongs.matchRejected,
                (state) => {
                    state.isLocalLoading = false;
                },
            )
            .addMatcher(api.endpoints.getChartSongs.matchPending, (state) => {
                state.isLocalLoading = true;
            })
            .addMatcher(api.endpoints.getChartSongs.matchFulfilled, (state) => {
                state.isLocalLoading = false;
            })
            .addMatcher(api.endpoints.getChartSongs.matchRejected, (state) => {
                state.isLocalLoading = false;
            });
    },
});

export default loadingSlice.reducer;

export const { setGlobalLoading, setLocalLoading } = loadingSlice.actions;
