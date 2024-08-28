export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectCurrentAdmin = (state) => state.auth.isAdmin;
export const selectCurrentResetPwdToken = (state) => state.auth.resetPwdToken;
export const selectCurrentPlayer = (state) => state.player;
export const selectCurrentTrack = (state) => state.player.currentTrack;
export const selectCurrentProfile = (state) => state.profile;
export const selectCurrentGlobalLoading = (state) =>
    state.loading.isGlobalLoading;
export const selectCurrentLocalLoading = (state) =>
    state.loading.isLocalLoading;
export const selectMyPlaylists = (state) => state.playlists.playlists;
export const selectMyAlbums = (state) => state.playlists.albums;
export const selectCurrentPlaylist = (state) => state.playlists.currentPlaylist;
