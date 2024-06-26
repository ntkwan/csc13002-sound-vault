import { createSlice } from "@reduxjs/toolkit";

// const PROFILE_URL = '';

const initialState = {
    fullName: "Sơn Tùng MTP",
    isVerified: true,
    followers: 9875425,
    email: "",
    dob: "5/7/1944",
    shortDesc: "",
    avatar: "Sơn Tùng MTP.jpg",
    cover: "Sơn Tùng MTP-bg.jpg",
    password: "tung1234",
    popular: [
        { name: 'Chúng Ta Của Tương Lai', view: 4564561, duration: '03:17' },
        { name: 'Chúng Ta Của Tương Lai', view: 4564561, duration: '03:17' },
        { name: 'Chúng Ta Của Tương Lai', view: 4564561, duration: '03:17' },
        { name: 'Chúng Ta Của Tương Lai', view: 4564561, duration: '03:17' },
        { name: 'Chúng Ta Của Tương Lai', view: 4564561, duration: '03:17' },
    ],
    mediaData: [
        {
            type: 'song',
            header: "Popular Releases",
            visibility: '',
            link: "",
            data: [
                { name: 'Chúng Ta Của Tương Lai', desc: '2023' },
                { name: 'Chúng Ta Của Tương Lai', desc: '2023' },
                { name: 'Chúng Ta Của Tương Lai', desc: '2023' },
            ],
        },
        {
            type: 'song',
            header: "Albums",
            visibility: '',
            link: "",
            data: [
                { name: 'Chúng Ta Của Tương Lai', desc: '2023' },
                { name: 'Chúng Ta Của Tương Lai', desc: '2023' },
                { name: 'Chúng Ta Của Tương Lai', desc: '2023' },
            ],
        },
        {
            type: 'artist',
            header: "Following",
            visibility: '(only me)',
            link: "",
            data: [
                { name: 'Sơn Tùng MTP', desc: 'Artist' },
                { name: 'Sơn Tùng MTP', desc: 'Artist' },
                { name: 'Sơn Tùng MTP', desc: 'Artist' },
            ],
        },
        {
            type: 'song',
            header: "My Playlist",
            visibility: '(only me)',
            link: "library",
            data: [
                { name: 'Chúng Ta Của Tương Lai', desc: 'playlist' },
                { name: 'Chúng Ta Của Tương Lai', desc: 'playlist' },
                { name: 'Chúng Ta Của Tương Lai', desc: 'playlist' },
                { name: 'Chúng Ta Của Tương Lai', desc: 'playlist' },
                { name: 'Chúng Ta Của Tương Lai', desc: 'playlist' },
                { name: 'Chúng Ta Của Tương Lai', desc: 'playlist' },
            ],
        },
    ],
    status: 'idle',
    error: null,
};

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        toggleFollow: (state) => {

        },
        uploadMusic: (state) => {

        },
        updateInfo: (state, actions) => {
            state.fullName = actions.payload.fullName;
            state.email = actions.payload.email;
            state.dob = actions.payload.dob;
            state.shortDesc = actions.payload.shortDesc;
        },
        updatePassword: (state, actions) => {
            state.password = actions.payload.password;
        }

    },
});

export const selectUserProfile = (state) => state.profile;
export const { toggleFollow, uploadMusic, updateInfo, updatePassword } = profileSlice.actions;
export default profileSlice.reducer;