import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    currentTrack: {
        id: -1,
        title: '',
        artist: '',
        url: '',
        thumbnail: '',
        screen: '',
        theme: '',
    },
    currentTime: 0,
    duration: 0,
    volume: 50,
};

const playerSlice = createSlice({
    name: 'player',
    initialState,
    reducers: {
        play(state) {
            state.isPlaying = true;
        },
        pause(state) {
            state.isPlaying = false;
        },
        setIsShuffle(state, action) {
            state.isShuffle = action.payload;
        },
        setIsRepeat(state, action) {
            state.isRepeat = action.payload;
        },
        setCurrentTrack(state, action) {
            state.currentTrack = action.payload;
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
        resetPlayer() {
            return initialState;
        },
    },
});

export const {
    play,
    pause,
    setIsShuffle,
    setIsRepeat,
    setCurrentTrack,
    setCurrentTime,
    setDuration,
    setVolume,
    resetPlayer,
} = playerSlice.actions;

export default playerSlice.reducer;
