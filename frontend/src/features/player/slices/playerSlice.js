import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPlaying: false,
    isShuffled: false,
    isRepeat: false,
    currentTrack: {
        id: 0,
        title: '',
        artist: '',
        url: 'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
        thumbnail: '',
    },
    currentTrackIndex: 0,
    currentTime: 0,
    duration: 0,
    volume: 50,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        setIsPlaying(state, action) {
            state.isPlaying = action.payload;
        },
        setIsShuffled(state, action) {
            state.isShuffled = action.payload;
        },
        setIsRepeat(state, action) {
            state.isRepeat = action.payload;
        },
        setCurrentTrack(state, action) {
            state.currentTrack = action.payload;
        },
        setCurrentTrackIndex(state, action) {
            state.currentTrackIndex = Number(action.payload);
        },
        setCurrentTime(state, action) {
            state.currentTime = Number(action.payload);
        },
        setDuration(state, action) {
            state.duration = Number(action.payload);
        },
        setVolume(state, action) {
            state.volume = Number(action.payload);
        },
    },
});

export const {
    setIsPlaying,
    setIsShuffled,
    setIsRepeat,
    setCurrentTrack,
    setCurrentTrackIndex,
    setCurrentTime,
    setDuration,
    setVolume,
} = playerSlice.actions;

export default playerSlice.reducer;
