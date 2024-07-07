import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accounts: [],
    date: '',
    sortOption: 'name',
    filterDate: '',
    filterSortOption: 'name',
    tabStatus: 'all',
    searchTerm: '',
    currentPage: 1,
    itemsPerPage: 6,
    showFilters: false,
};

const adminAccountSlice = createSlice({
    name: 'adminAccount',
    initialState,
    reducers: {
        setAccounts: (state, action) => {
            state.accounts = action.payload;
        },
        setAccountDate: (state, action) => {
            state.date = action.payload;
        },
        setAccountSortOption: (state, action) => {
            state.sortOption = action.payload;
        },
        setAccountFilterDate: (state, action) => {
            state.filterDate = action.payload;
        },
        setAccountFilterSortOption: (state, action) => {
            state.filterSortOption = action.payload;
        },
        setAccountTabStatus: (state, action) => {
            state.tabStatus = action.payload;
        },
        setAccountSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setAccountCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setAccountItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
        },
        setAccountShowFilters: (state, action) => {
            state.showFilters = action.payload;
        },
    },
});

export const {
    setAccounts,
    setAccountDate,
    setAccountSortOption,
    setAccountFilterDate,
    setAccountFilterSortOption,
    setAccountTabStatus,
    setAccountSearchTerm,
    setAccountCurrentPage,
    setAccountItemsPerPage,
    setAccountShowFilters,
} = adminAccountSlice.actions;

export const selectAdminAccountManagement = (state) => state.adminAccount;

export default adminAccountSlice.reducer;
