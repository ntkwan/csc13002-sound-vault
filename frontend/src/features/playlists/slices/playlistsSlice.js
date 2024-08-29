import { createSlice } from '@reduxjs/toolkit';
import { api } from '@services/api';

const initialState = {
    playlists: [],
    albums: [],
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
                let playlists = [];
                let albums = [];
                action.payload.playlists.forEach((playlist) => {
                    if (playlist.isAlbum) {
                        albums.push(playlist);
                    } else {
                        playlists.push(playlist);
                    }
                });
                state.playlists = playlists;
                state.albums = albums;
            },
        );
    },
});

export default playlistsSlice.reducer;

export const { addPlaylist, removePlaylist, setCurrentPlaylist } =
    playlistsSlice.actions;
