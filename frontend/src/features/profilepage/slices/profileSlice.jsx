import { createSlice } from '@reduxjs/toolkit';

const IMGURL =
    'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png';

const initialState = {
    name: '',
    isVerified: false,
    followers: 0,
    following: [],
    email: '',
    dob: '',
    shortDesc: '',
    image: {
        url: '',
        corverimg: '',
    },
    password: '',
    isAdmin: false,
    mediaData: [
        {
            type: 'Song',
            title: 'Popular Releases',
            visibility: '',
            link: '',
            data: [
                {
                    title: 'Nếu lúc đó',
                    artist: 'tlinh',
                    genre: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
                    view: 0,
                },
                {
                    title: 'Nếu lúc đó',
                    artist: 'tlinh',
                    genre: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
                    view: 0,
                },
                {
                    title: 'Nếu lúc đó',
                    artist: 'tlinh',
                    genre: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
                    view: 0,
                },
            ],
        },
        {
            type: 'Album',
            title: 'Albums',
            visibility: '',
            link: '',
            data: [
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: '2023',
                },
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: '2023',
                },
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: '2023',
                },
            ],
        },
        {
            type: 'Artist',
            title: 'Following',
            visibility: '(only me)',
            link: '',
            data: [
                {
                    artist: 'Sơn Tùng MTP',
                    imageurl: {
                        url: IMGURL,
                    },
                },
                {
                    artist: 'Sơn Tùng MTP',
                    imageurl: {
                        url: IMGURL,
                    },
                },
                {
                    artist: 'Sơn Tùng MTP',
                    imageurl: {
                        url: IMGURL,
                    },
                },
            ],
        },
        {
            type: 'Playlist',
            title: 'My Playlist',
            visibility: '(only me)',
            link: 'library',
            data: [
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: 'playlist',
                },
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: 'playlist',
                },
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: 'playlist',
                },
            ],
        },
    ],
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

export const selectUserProfile = (state) => state.profile;

export const {
    toggleFollow,
    uploadMusic,
    updateAvatar,
    updateCover,
    updateInfo,
    updatePassword,
} = profileSlice.actions;

export default profileSlice.reducer;
