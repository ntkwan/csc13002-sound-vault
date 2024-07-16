import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accountList: [],
    songList: [],
    reportList: [],
};

const adminDashboardSlice = createSlice({
    name: 'admindashboard',
    initialState,
    reducers: {
        setAccountList(state, action) {
            state.accountList = action.payload;
        },
        setSongList(state, action) {
            state.songList = action.payload;
        },
        setReportList(state, action) {
            state.reportList = action.payload;
        },
        assignAdminToReport(state, action) {
            const { reportId, adminName } = action.payload;
            const report = state.reportList.find((r) => r.id === reportId);
            if (report) {
                report.adminAssignee = adminName;
            }
        },
    },
});

export const {
    setAccountList,
    setSongList,
    setReportList,
    assignAdminToReport,
} = adminDashboardSlice.actions;

export default adminDashboardSlice.reducer;
