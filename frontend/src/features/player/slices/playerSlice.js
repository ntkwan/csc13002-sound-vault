import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    currentTrack: {
        id: 0,
        title: 'nếu lúc đó',
        artist: 'tlinh',
        url: 'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
        thumbnail:
            'https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_jpeg/cover/b/6/d/1/b6d1ed0d09b63c3006e56f7e7839014e.jpg',
        screen: 'https://i.scdn.co/image/ab67618600001016587d17a2b9860077302125d1',
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
} = playerSlice.actions;

export default playerSlice.reducer;
