import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    useGetAllSongsQuery,
    useSetVerifiedSongByIdMutation,
    useRemoveSongByIdMutation,
    useDeactivateSongMutation,
    useActivateSongMutation,
} from '@services/api';
import { Loading } from '@components';
import { toast } from 'react-toastify';

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

function AdminSongPage() {
    const navigate = useNavigate();
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
    const [selectedSong, setSelectSong] = useState(null);

    const [setVerifiedSongById, { isLoading: verifySongIsLoading }] =
        useSetVerifiedSongByIdMutation();
    const handleVerifySong = async (songId) => {
        if (verifySongIsLoading) return;
        try {
            await setVerifiedSongById(songId);
            toast.success('Song verified successfully!');
        } catch (error) {
            console.log('Failed to verify song', error);
            toast.error('Failed to verify song');
        }
    };
    const [removeSongById, { isLoading: removeSongIsLoading }] =
        useRemoveSongByIdMutation();
    const handleRemoveSong = async (id) => {
        if (removeSongIsLoading) return;
        try {
            await removeSongById(id);
            toast.success('Song removed successfully!');
        } catch (error) {
            console.log('Failed to remove song', error);
            toast.error('Failed to remove song');
        }
    };
    const [deactivateSong, { isLoading: deactivateSongIsLoading }] =
        useDeactivateSongMutation();
    const handleDeactivateSong = async (id) => {
        if (deactivateSongIsLoading) return;
        try {
            await deactivateSong(id);
            toast.success('Song deactivated successfully!');
        } catch (error) {
            console.log('Failed to deactivate song', error);
            toast.error('Failed to deactivate song');
        }
    };
    const [activateSong, { isLoading: activateSongIsLoading }] =
        useActivateSongMutation();
    const handleActivateSong = async (id) => {
        if (activateSongIsLoading) return;
        try {
            await activateSong(id);
            toast.success('Song activated successfully!');
        } catch (error) {
            console.log('Failed to activate song', error);
            toast.error('Failed to activate song');
        }
    };
    const handleViewSong = (id) => {
        navigate(`/song/${id}`);
    };

    const { data: songListData, isLoading: songListIsLoading } =
        useGetAllSongsQuery();
    if (songListIsLoading) return <Loading />;
    const songs = songListData.map((song) => ({
        id: song.id,
        name: song.title,
        artist: song.artist,
        date: formatDate(new Date(song.createdAt)),
        isDisabled: song.isDisabled,
        publicAddress: song.publicAddress,
        status: song.isVerified
            ? 'Verified'
            : song.publicAddress != ''
              ? 'Verifiable'
              : 'Unverified',
    }));

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

        if (filterSortOption === 'Song name') {
            return a.name.localeCompare(b.name);
        } else if (filterSortOption === 'Author') {
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
        { name: 'Verifiable songs', status: 'Verifiable' },
        { name: 'Unverified', status: 'Unverified' },
        { name: 'Pending', status: 'Pending' },
    ];

    const sortMethods = [
        'Song name',
        'Author',
        'Date (oldest first)',
        'Date (newest first)',
    ];

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
    };

    const confirmActionHandler = () => {
        if (confirmAction === 'verify' || confirmAction === 'unverify') {
            handleVerifySong(selectedSong);
        } else if (confirmAction === 'remove') {
            handleRemoveSong(selectedSong);
        } else if (confirmAction === 'deactivate') {
            handleDeactivateSong(selectedSong);
        } else if (confirmAction === 'activate') {
            handleActivateSong(selectedSong);
        } else if (confirmAction === 'view') {
            handleViewSong(selectedSong);
        }
        setConfirmAction(null);
        setSelectSong(null);
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title inline-block select-none px-4 py-8 text-7xl">
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
                    className="admin-page__filter h-11 select-none rounded-xl bg-black px-4 duration-200 ease-in-out hover:scale-105"
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

            <table className="w-full cursor-default overflow-hidden">
                <thead>
                    <tr className="cursor-default border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">ID</th>
                        <th className="px-2 py-5 text-left font-normal">
                            Song name
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Author
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
                            <td className="px-2 py-5 text-sm">{song.id}</td>
                            <td className="px-2 py-5 text-sm">{song.name}</td>
                            <td className="px-2 py-5">{song.date}</td>
                            <td className="px-2 py-5">{song.artist}</td>
                            <td className="px-2 py-5">
                                <span
                                    className={`rounded-lg px-2 py-1 ${
                                        song.status === 'Verified'
                                            ? 'bg-[#FFF0F0] text-[#0CAF60]'
                                            : song.status === 'Unverified'
                                              ? 'bg-[#FFF0E6] text-[#eb4141]'
                                              : 'bg-[#E7F7EF] text-[#FE964A]'
                                    }`}
                                >
                                    {song.status}
                                </span>
                            </td>
                            <td className="flex justify-evenly p-2 py-5">
                                <ManagementButtons
                                    background={
                                        song.status === 'Verified'
                                            ? 'bg-[#FE964A]'
                                            : 'bg-[#9F68B2]'
                                    }
                                    disable={
                                        song.status === 'Verified' ||
                                        song.publicAddress === ''
                                    }
                                    onClick={() => {
                                        const action =
                                            song.status === 'Verified'
                                                ? 'unverify'
                                                : 'verify';
                                        setConfirmAction(action);
                                        setSelectSong(song.id);
                                    }}
                                >
                                    {song.status === 'Verified'
                                        ? 'Unverify'
                                        : 'Verify'}
                                </ManagementButtons>
                                <ManagementButtons
                                    background="bg-[#195FF0]"
                                    onClick={() => {
                                        setConfirmAction('view');
                                        setSelectSong(song.id);
                                    }}
                                >
                                    View
                                </ManagementButtons>
                                <ManagementButtons
                                    background="bg-[#B63D65]"
                                    disable={song.status === 'Verified'}
                                    onClick={() => {
                                        setConfirmAction('remove');
                                        setSelectSong(song.id);
                                    }}
                                >
                                    Remove
                                </ManagementButtons>
                                <ManagementButtons
                                    background={
                                        song.isBanned
                                            ? 'bg-[#0CAF60]'
                                            : 'bg-[#CACD6D]'
                                    }
                                    onClick={() => {
                                        const action = song.isDisabled
                                            ? 'activate'
                                            : 'deactivate';
                                        setConfirmAction(action);
                                        setSelectSong(song.id);
                                    }}
                                >
                                    {song.isDisabled ? 'Active' : 'Disable'}
                                </ManagementButtons>
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
                            {confirmAction === 'view'
                                ? 'Are you sure you want to leave this page?'
                                : `Are you sure you want to ${confirmAction} this account?`}
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
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {verifySongIsLoading && (
                <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="flex flex-col items-center rounded-lg p-6 shadow-lg outline backdrop-blur-xl">
                        <div className="flex h-14 items-center space-x-2">
                            <div>
                                <Loading className="h-10 w-10" />
                            </div>
                            <p className="text-white">
                                Uploading to blockchain...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSongPage;
