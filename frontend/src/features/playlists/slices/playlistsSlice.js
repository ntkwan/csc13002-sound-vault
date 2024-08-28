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

const addToList = (list, item) => {
    if (!list) return;
    if (list.findIndex((i) => i.id === item.id) === -1) {
        list.push(item);
    } else {
        const index = list.findIndex((i) => i.id === item.id);
        list[index] = item;
    }
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
                    if (playlist.isAlbum) {
                        console.log('Album:', playlist);

                        addToList(state.albums, playlist);
                    } else addToList(state.playlists, playlist);
                });
            },
        );
    },
});

export default playlistsSlice.reducer;

export const { addPlaylist, removePlaylist, setCurrentPlaylist } =
    playlistsSlice.actions;
