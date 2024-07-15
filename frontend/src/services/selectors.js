export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentResetPwdToken = (state) => state.auth.resetPwdToken;
export const selectCurrentPlayer = (state) => state.player;
export const selectCurrentProfile = (state) => state.profile;
export const selectCurrentGlobalLoading = (state) =>
    state.loading.isGlobalLoading;
export const selectCurrentLocalLoading = (state) =>
    state.loading.isLocalLoading;
