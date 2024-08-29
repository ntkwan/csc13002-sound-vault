import { useState } from 'react';
import {
    ManagementButtons,
    SearchBar,
    Pagination,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import {
    useGetAllSongsQuery,
    useSetVerifiedSongByIdMutation,
    useCancelCopyrightRequestMutation,
} from '@services/api';
import { Loading } from '@components';
import { toast } from 'react-toastify';

function AdminCopyrightPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedSong, setSelectSong] = useState(null);

    const [setVerifiedSongById, { isLoading: verifySongIsLoading }] =
        useSetVerifiedSongByIdMutation();
    const handleVerifySong = async (songId) => {
        try {
            await setVerifiedSongById(songId);
            toast.success('Song verified successfully!');
        } catch (error) {
            console.log('Failed to verify song', error);
            toast.error('Failed to verify song');
        }
    };
    const [cancelRequest] = useCancelCopyrightRequestMutation();
    const handleCancelRequest = async (id) => {
        try {
            await cancelRequest(id);
            toast.success('Request canceled successfully!');
        } catch (error) {
            console.log('Failed to cancel request', error);
            toast.error('Failed to cancel request');
        }
    };

    const { data: songListData, isLoading: songListIsLoading } =
        useGetAllSongsQuery();
    if (songListIsLoading) return <Loading />;
    const songs = songListData.map((song) => ({
        id: song.id,
        name: song.title,
        artist: song.artist,
        isPending: song.isPending,
        isVerified: song.isVerified,
    }));

    const filteredSongs = songs.filter((song) => {
        return (
            song.isPending &&
            !song.isVerified &&
            (!searchTerm ||
                song.name.toLowerCase().startsWith(searchTerm.toLowerCase()) ||
                song.id.toString().startsWith(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    });

    const paginatedSongs = filteredSongs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredSongs.length / itemsPerPage);

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const confirmActionHandler = () => {
        if (confirmAction === 'verify' || confirmAction === 'unverify') {
            handleVerifySong(selectedSong);
        } else if (confirmAction === 'cancel') {
            handleCancelRequest(selectedSong);
        }
        setConfirmAction(null);
        setSelectSong(null);
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title inline-block select-none px-4 py-8 text-7xl">
                Copyright
            </h1>

            <div className="admin-page__action flex items-center space-x-4 border-y-2 py-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                />
            </div>

            <table className="w-full cursor-default overflow-hidden">
                <thead>
                    <tr className="cursor-default border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">ID</th>
                        <th className="px-2 py-5 text-left font-normal">
                            Song name
                        </th>

                        <th className="px-2 py-5 text-left font-normal">
                            Author
                        </th>

                        <th className="px-2 py-5 font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedSongs.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="py-5 text-center">
                                No request found!
                            </td>
                        </tr>
                    ) : (
                        paginatedSongs.map((song, index) => (
                            <tr key={index} className="border-b-2">
                                <td className="px-2 py-5">{song.id}</td>
                                <td className="px-2 py-5">{song.name}</td>
                                <td className="px-2 py-5">{song.artist}</td>
                                <td className="px-2 py-5">
                                    <div className="flex justify-evenly">
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
                                            background="bg-[#B63D65]"
                                            disable={song.status === 'Verified'}
                                            onClick={() => {
                                                setConfirmAction('cancel');
                                                setSelectSong(song.id);
                                            }}
                                        >
                                            Cancel
                                        </ManagementButtons>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
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
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-30">
                    <div className="rounded-lg border-2 bg-black bg-opacity-50 p-6 shadow-lg backdrop-blur-xl">
                        <p className="mb-4">
                            {confirmAction === 'cancel'
                                ? 'Are you sure you want to cancel this request?'
                                : `Are you sure you want to verify this song?`}
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

export default AdminCopyrightPage;
