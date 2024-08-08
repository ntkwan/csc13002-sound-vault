import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        isAdmin: false,
        token: null,
        resetPwdToken: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAdmin = action.payload.isAdmin;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
            state.isAdmin = false;
        },
        resetPwd: (state, action) => {
            state.resetPwdToken = action.payload;
        },
    },
});

export default authSlice.reducer;

export const { setCredentials, logOut, resetPwd } = authSlice.actions;
