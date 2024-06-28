import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

// const PROFILE_URL = ";

const initialState = {
    fullName: "Sơn Tùng MTP",
    isVerified: true,
    followers: 9875425,
    email: "",
    dob: "1994-07-05",
    shortDesc: "",
    avatar: "Sơn Tùng MTP.jpg",
    cover: "Sơn Tùng MTP-bg.jpg",
    password: "tung1234",
    popular: [
        { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
        { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
        { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
        { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
        { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
    ],
    mediaData: [
        {
            type: "song",
            title: "Popular Releases",
            visibility: "",
            link: "",
            data: [
                { name: "Chúng Ta Của Tương Lai", desc: "2023" },
                { name: "Chúng Ta Của Tương Lai", desc: "2023" },
                { name: "Chúng Ta Của Tương Lai", desc: "2023" },
            ],
        },
        {
            type: "song",
            title: "Albums",
            visibility: "",
            link: "",
            data: [
                { name: "Chúng Ta Của Tương Lai", desc: "2023" },
                { name: "Chúng Ta Của Tương Lai", desc: "2023" },
                { name: "Chúng Ta Của Tương Lai", desc: "2023" },
            ],
        },
        {
            type: "Artist",
            title: "Following",
            visibility: "(only me)",
            link: "",
            data: [
                { name: "Sơn Tùng MTP" },
                { name: "Sơn Tùng MTP" },
                { name: "Sơn Tùng MTP" },
            ],
        },
        {
            type: "song",
            title: "My Playlist",
            visibility: "(only me)",
            link: "library",
            data: [
                { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
                { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
                { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
                { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
                { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
                { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
            ],
        },
    ],
    status: "idle",
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
        updateAvatar: (state, actions) => {
            state.avatar = actions.payload.avatar;
        },
        updateCover: (state, actions) => {
            state.cover = actions.payload.cover;
        },
        updateInfo: (state, actions) => {
            const { fullName, email, dob, shortDesc } = actions.payload;
            state.fullName = fullName;
            state.email = email;
            state.dob = dob;
            state.shortDesc = shortDesc;
        },
        updatePassword: (state, actions) => {
            state.password = actions.payload.password;
        }

    },
});

export const selectUserProfile = (state) => state.profile;

export const {
    toggleFollow,
    uploadMusic,
    updateAvatar,
    updateCover,
    updateInfo,
    updatePassword
} = profileSlice.actions;

export default profileSlice.reducer;