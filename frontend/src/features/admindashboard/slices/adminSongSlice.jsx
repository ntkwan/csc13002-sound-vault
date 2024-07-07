import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    songs: [],
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

const adminSongSlice = createSlice({
    name: 'adminSong',
    initialState,
    reducers: {
        setSongs: (state, action) => {
            state.songs = action.payload;
        },
        setDate: (state, action) => {
            state.date = action.payload;
        },
        setSortOption: (state, action) => {
            state.sortOption = action.payload;
        },
        setFilterDate: (state, action) => {
            state.filterDate = action.payload;
        },
        setFilterSortOption: (state, action) => {
            state.filterSortOption = action.payload;
        },
        setTabStatus: (state, action) => {
            state.tabStatus = action.payload;
        },
        setSearchTerm: (state, action) => {
            state.searchTerm = action.payload;
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setItemsPerPage: (state, action) => {
            state.itemsPerPage = action.payload;
        },
        setShowFilters: (state, action) => {
            state.showFilters = action.payload;
        },
    },
});

export const {
    setSongs,
    setDate,
    setSortOption,
    setFilterDate,
    setFilterSortOption,
    setTabStatus,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    setShowFilters,
} = adminSongSlice.actions;

export const selectAdminSongManagement = (state) => state.adminSong;

export default adminSongSlice.reducer;
