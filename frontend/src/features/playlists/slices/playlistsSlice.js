import { createSlice } from '@reduxjs/toolkit';
import { api } from '@services/api';

const initialState = {
    playlists: [],
    currentPlaylist: {
        id: '',
        songs: [],
    },
};

const playlistsSlice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        addPlaylist: (state, action) => {
            state.playlists.push(action.payload);
        },
        removePlaylist: (state, action) => {
            state.playlists = state.playlists.filter(
                (playlist) => playlist.id !== action.payload,
            );
        },
        setCurrentPlaylist: (state, action) => {
            state.currentPlaylist = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(
            api.endpoints.getMyPlaylists.matchFulfilled,
            (state, action) => {
                action.payload.playlists.forEach((playlist) => {
                    if (
                        state.playlists.findIndex(
                            (p) => p.id === playlist.id,
                        ) === -1
                    ) {
                        state.playlists.push(playlist);
                    } else {
                        const index = state.playlists.findIndex(
                            (p) => p.id === playlist.id,
                        );
                        state.playlists[index].songs = playlist.songs;
                    }
                });
            },
        );
    },
});

export default playlistsSlice.reducer;

export const { addPlaylist, removePlaylist, setCurrentPlaylist } =
    playlistsSlice.actions;
