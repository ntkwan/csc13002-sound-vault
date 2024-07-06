import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: null,
        resetPwdToken: null,
    },
    reducers: {
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
        },
        logOut: (state) => {
            state.user = null;
            state.token = null;
        },
        resetPwd: (state, action) => {
            state.resetPwdToken = action.payload;
        },
    },
});

export default authSlice.reducer;

export const { setCredentials, logOut, resetPwd } = authSlice.actions;
