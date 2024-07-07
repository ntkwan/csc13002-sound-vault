import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ManagementButtons,
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import {
    setSongs,
    setDate,
    setSortOption,
    setFilterDate,
    setFilterSortOption,
    setTabStatus,
    setSearchTerm,
    setCurrentPage,
    setItemsPerPage,
    selectAdminSongManagement,
    setShowFilters,
} from '@features/admindashboard/slices';

const sampleSongs = [
    {
        name: 'SmokeShack Burger',
        date: '23-05-2024',
        artist: 'Chillies',
        status: 'Verified',
    },
    {
        name: 'Waffle Fries',
        date: '21-04-2022',
        artist: 'Billie Eilish',
        status: 'Unverified',
    },
    {
        name: 'Chalupa Supreme',
        date: '19-01-2020',
        artist: 'Post Malone',
        status: 'Pending',
    },
    {
        name: 'Checkers Seasoned Fries',
        date: '02-10-2024',
        artist: 'Adam Levine',
        status: 'Verified',
    },
    {
        name: 'French Fries',
        date: '03-12-2019',
        artist: 'Joji',
        status: 'Unverified',
    },
    {
        name: 'Taquito with Cheese',
        date: '23-04-2024',
        artist: 'Hozier',
        status: 'Pending',
    },
];

const generateSongs = (samples, counts) => {
    let songs = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            songs.push({ ...sample });
        }
    });
    return songs;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialSongs = generateSongs(sampleSongs, counts);

function AdminSongPage() {
    const dispatch = useDispatch();
    const adminSong = useSelector(selectAdminSongManagement);
    const {
        songs,
        date,
        sortOption,
        filterDate,
        filterSortOption,
        tabStatus,
        searchTerm,
        currentPage,
        itemsPerPage,
        showFilters,
    } = adminSong;
    useEffect(() => {
        dispatch(setSongs(initialSongs));
    }, [dispatch]);

    const applyFilter = () => {
        dispatch(setCurrentPage(1));
        dispatch(setFilterDate(date));
        dispatch(setFilterSortOption(sortOption));
    };

    const filteredSongs = songs.filter((song) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd-MM-yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || song.status === tabStatus) &&
            (!filterDate ||
                isEqual(parseDate1(song.date), parseDate2(filterDate))) &&
            (!searchTerm ||
                song.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedSongs = filteredSongs.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Name song') {
            return a.name.localeCompare(b.name);
        } else if (filterSortOption === 'Artist') {
            return a.artist.localeCompare(b.artist);
        } else if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(parseDate(a.date), parseDate(b.date));
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(parseDate(a.date), parseDate(b.date));
        }
    });

    const paginatedSongs = sortedSongs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

    const buttonFilter = [
        { name: 'All songs', status: 'all' },
        { name: 'Verified', status: 'Verified' },
        { name: 'Unverified', status: 'Unverified' },
        { name: 'Pending', status: 'Pending' },
    ];

    const actionsButton = [
        { name: 'View', background: 'bg-[#195FF0]' },
        { name: 'Edit', background: 'bg-[#34AAA3]' },
        { name: 'Remove', background: 'bg-[#B63D65]' },
        { name: 'Disable', background: 'bg-[#CACD6D]' },
    ];

    const sortMethods = [
        'Name song',
        'Artist',
        'Date (oldest first)',
        'Date (newest first)',
    ];

    const handleItemsPerPageChange = (e) => {
        dispatch(setItemsPerPage(Number(e.target.value)));
        dispatch(setCurrentPage(1));
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title inline-block px-4 py-8 text-7xl">
                Songs
            </h1>

            <div className="admin-page__filter flex space-x-4 border-b-2 px-2">
                <FilterStatus
                    filterList={buttonFilter}
                    tabStatus={tabStatus}
                    onFilterClick={(tabStatus) => {
                        dispatch(setTabStatus(tabStatus));
                        dispatch(setCurrentPage(1));
                    }}
                />
            </div>

            <div className="admin-page__action flex items-center space-x-4 border-b-2 py-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearch={(term) => {
                        dispatch(setSearchTerm(term));
                        dispatch(setCurrentPage(1));
                    }}
                />
                <button
                    className="admin-page__filter h-11 rounded-xl bg-black px-4"
                    onClick={() => dispatch(setShowFilters(!showFilters))}
                >
                    <i className="ri-equalizer-2-line px-1"></i>
                    Filters
                </button>
            </div>

            {showFilters && (
                <FilterSort
                    date={date}
                    setDate={(date) => dispatch(setDate(date))}
                    sortMethods={sortMethods}
                    sortOption={sortOption}
                    setSortOption={(option) => dispatch(setSortOption(option))}
                    applyFilter={applyFilter}
                />
            )}

            <table className="w-full overflow-hidden">
                <thead>
                    <tr className="border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">
                            Name song
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Artist
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Status
                        </th>
                        <th className="px-2 py-5 font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSongs.map((song, index) => (
                        <tr key={index} className="border-b-2">
                            <td className="px-2 py-5">{song.name}</td>
                            <td className="px-2 py-5">{song.date}</td>
                            <td className="px-2 py-5">{song.artist}</td>
                            <td className="px-2 py-5">
                                <span
                                    className={`rounded-lg px-2 py-1 ${
                                        song.status === 'Verified'
                                            ? 'bg-[#FFF0F0] text-[#FD6A6A]'
                                            : song.status === 'Unverified'
                                              ? 'bg-[#FFF0E6] text-[#FE964A]'
                                              : 'bg-[#E7F7EF] text-[#0CAF60]'
                                    }`}
                                >
                                    {song.status}
                                </span>
                            </td>
                            <td className="flex justify-evenly p-2 py-5">
                                {actionsButton.map((action, index) => (
                                    <ManagementButtons
                                        key={index}
                                        background={action.background}
                                        children={action.name}
                                    />
                                ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-8 flex items-center justify-between">
                <ItemsPerPageSelector
                    itemsPerPage={itemsPerPage}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                />
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={(page) => dispatch(setCurrentPage(page))}
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export default AdminSongPage;
