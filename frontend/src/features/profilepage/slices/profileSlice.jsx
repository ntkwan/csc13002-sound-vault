import { createSlice } from '@reduxjs/toolkit';

const IMGURL =
    'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png';

const initialState = {
    name: '',
    email: '',
    dob: '',
    shortDesc: '',
    followers: 0,
    following: [],
    isVerified: false,
    image: {
        url: '',
    },
    coverimage: {
        url: '',
    },
    password: '',
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        toggleFollow: (state, actions) => {
            const profileId = actions.payload;
            const index = state.following.indexOf(profileId);
            if (index === -1) {
                state.following.push(profileId);
            } else {
                state.following.splice(index, 1);
            }
        },
        uploadMusic: (state) => {},
        updateAvatar: (state, actions) => {
            state.avatar = actions.payload.avatar;
        },
        updateCover: (state, actions) => {
            state.cover = actions.payload.cover;
        },
        updateInfo: (state, actions) => {
            Object.assign(state, actions.payload);
        },
        updatePassword: (state, actions) => {
            state.password = actions.payload.password;
        },
    },
});

export const {
    toggleFollow,
    uploadMusic,
    updateAvatar,
    updateCover,
    updateInfo,
    updatePassword,
} = profileSlice.actions;

export default profileSlice.reducer;
