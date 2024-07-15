import React, { useEffect, useState } from 'react';
import {
    ManagementButtons,
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { setSongList } from '@features/admindashboard/slices';
import { useDispatch, useSelector } from 'react-redux';

const sampleSongs = [
    {
        name: 'SmokeShack Burger',
        date: '23-05-2024',
        artist: 'Chillies',
        status: 'Verified',
        audioUrl: 'https://example.com/song1.mp3',
    },
    {
        name: 'Waffle Fries',
        date: '21-04-2022',
        artist: 'Billie Eilish',
        status: 'Unverified',
        audioUrl: 'https://example.com/song2.mp3',
    },
    {
        name: 'Chalupa Supreme',
        date: '19-01-2020',
        artist: 'Post Malone',
        status: 'Pending',
        audioUrl: 'https://example.com/song3.mp3',
    },
    {
        name: 'Checkers Seasoned Fries',
        date: '02-10-2024',
        artist: 'Adam Levine',
        status: 'Verified',
        audioUrl: 'https://example.com/song4.mp3',
    },
    {
        name: 'French Fries',
        date: '03-12-2019',
        artist: 'Joji',
        status: 'Unverified',
        audioUrl: 'https://example.com/song5.mp3',
    },
    {
        name: 'Taquito with Cheese',
        date: '23-04-2024',
        artist: 'Hozier',
        status: 'Pending',
        audioUrl: 'https://example.com/song6.mp3',
    },
];

const generateSongs = (samples, counts) => {
    let songs = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            songs.push({ ...sample, audioUrl: `${sample.audioUrl}?${i}` });
        }
    });
    return songs;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialSongs = generateSongs(sampleSongs, counts);

function AdminSongPage() {
    const dispatch = useDispatch();
    const songs = useSelector((state) => state.admindashboard.songList);
    const [date, setDate] = useState('');
    const [sortOption, setSortOption] = useState('Date (newest first)');
    const [filterDate, setFilterDate] = useState('');
    const [filterSortOption, setFilterSortOption] = useState(
        'Date (newest first)',
    );
    const [tabStatus, setTabStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [showFilters, setShowFilters] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedSongUrl, setSelectedSongUrl] = useState(null);

    useEffect(() => {
        dispatch(setSongList(initialSongs));
    }, [dispatch]);

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
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

    const sortMethods = [
        'Name song',
        'Artist',
        'Date (oldest first)',
        'Date (newest first)',
    ];

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleVerify = (audioUrl) => {
        setConfirmAction('Verify');
        setSelectedSongUrl(audioUrl);
    };

    const handleUnverify = (audioUrl) => {
        setConfirmAction('Unverify');
        setSelectedSongUrl(audioUrl);
    };

    const confirmActionHandler = () => {
        if (confirmAction === 'Verify') {
            const updatedSongs = songs.map((song) =>
                song.audioUrl === selectedSongUrl
                    ? { ...song, status: 'Verified' }
                    : song,
            );
            dispatch(setSongList(updatedSongs));
        } else if (confirmAction === 'Unverify') {
            const updatedSongs = songs.map((song) =>
                song.audioUrl === selectedSongUrl
                    ? { ...song, status: 'Unverified' }
                    : song,
            );
            dispatch(setSongList(updatedSongs));
        }
        setConfirmAction(null);
        setSelectedSongUrl(null);
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
                        setTabStatus(tabStatus);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <div className="admin-page__action flex items-center space-x-4 border-b-2 py-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                />
                <button
                    className="admin-page__filter h-11 rounded-xl bg-black px-4 duration-200 ease-in-out hover:scale-105"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className="ri-equalizer-2-line px-1"></i>
                    Filters
                </button>
            </div>

            {showFilters && (
                <FilterSort
                    date={date}
                    setDate={setDate}
                    sortMethods={sortMethods}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
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
                                {song.status === 'Verified' ? (
                                    <ManagementButtons
                                        background="bg-[#FE964A]"
                                        children="Unverify"
                                        disable={true}
                                    />
                                ) : (
                                    <ManagementButtons
                                        background="bg-[#9F68B2]"
                                        children="Verify"
                                        onClick={() =>
                                            handleVerify(song.audioUrl)
                                        }
                                    />
                                )}
                                <ManagementButtons
                                    background="bg-[#195FF0]"
                                    children="View"
                                />
                                <ManagementButtons
                                    background="bg-[#34AAA3]"
                                    children="Edit"
                                />
                                <ManagementButtons
                                    background="bg-[#B63D65]"
                                    children="Remove"
                                />
                                <ManagementButtons
                                    background="bg-[#CACD6D]"
                                    children="Disable"
                                />
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
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            </div>

            {/* Modal confirmation */}
            {confirmAction && (
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="rounded-lg bg-slate-500 p-6 shadow-lg">
                        <p className="mb-4">
                            Are you sure you want to {confirmAction} this song?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="mr-2 rounded-md bg-gray-300 px-4 py-2"
                                onClick={() => setConfirmAction(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${
                                    confirmAction === 'Verify'
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                } rounded-md px-4 py-2 text-white`}
                                onClick={confirmActionHandler}
                            >
                                {confirmAction}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSongPage;
