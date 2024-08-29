import { useState, useRef, useEffect } from 'react';
import {
    useCreateAlbumMutation,
    useAddSongToPlaylistMutation,
} from '@services/api';
import { PropTypes } from 'prop-types';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectMyAlbums } from '@services/selectors';
import { Loading } from '.';

AlbumFrame.propTypes = {
    idSong: PropTypes.string,
    songName: PropTypes.string,
    onClose: PropTypes.func,
};

function AlbumFrame({ idSong, songName, onClose }) {
    const albumFormRef = useRef(null);
    const albumFrameRef = useRef(null);
    const [albumName, setAlbumName] = useState('');
    const [showAlbumForm, setShowAlbumForm] = useState(false);
    const myAlbums = useSelector(selectMyAlbums);
    const [creatAlbum, { isLoading: createAlbumLoading }] =
        useCreateAlbumMutation();
    const handleCreateAlbum = async (name) => {
        if (createAlbumLoading) return <Loading />;
        try {
            await creatAlbum({ name }).unwrap();
            toast.success('Album created successfully!');
        } catch (error) {
            console.error('Failed to create album:', error);
            toast.error(`${error.data.message}!`);
        }
    };
    const handleSubmitCreateAlbum = () => {
        setShowAlbumForm(false);
        const name = String(albumName).trim();
        handleCreateAlbum(name);
    };
    const [addSongToPlaylist, { isLoading: addSongToPlaylistLoading }] =
        useAddSongToPlaylistMutation();
    const handleAddToPlaylist = async (
        playlistId,
        songId,
        songName,
        playlistName,
    ) => {
        if (addSongToPlaylistLoading) return <Loading />;
        try {
            onClose();
            await addSongToPlaylist({ playlistId, songId }).unwrap();
            toast.success(
                `${songName} added to album ${playlistName} successfully!`,
            );
        } catch (error) {
            console.error('Failed to add song to album:', error);
            toast.error(`${error.data.message}!`);
        }
    };
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                albumFormRef.current &&
                !albumFormRef.current.contains(e.target)
            ) {
                setShowAlbumForm(false);
            } else if (
                albumFrameRef.current &&
                !albumFrameRef.current.contains(e.target)
            ) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);
        return () =>
            document.removeEventListener('mousedown', handleOutsideClick);
    }, [onClose]);
    if (!myAlbums) {
        return <Loading />;
    }
    return (
        <div className="fixed left-0 top-0 z-10 h-full w-full content-center bg-gray-800 bg-opacity-50">
            <div
                className="relative z-20 m-auto h-[70%] w-[450px] cursor-default rounded-md border bg-black px-5 py-5 text-center font-kodchasan shadow-lg"
                ref={albumFrameRef}
            >
                {showAlbumForm && (
                    <div className="fixed inset-0 z-30 flex items-center justify-center bg-gray-800 bg-opacity-50">
                        <div
                            ref={albumFormRef}
                            className="cursor-default rounded-[35px] border bg-black p-6 text-center font-kodchasan shadow-lg"
                        >
                            <div>
                                <label
                                    htmlFor="playlistName"
                                    className="block pb-2 text-left text-base"
                                >
                                    Create a name for your album:
                                </label>
                                <input
                                    id="playlistName"
                                    type="text"
                                    onChange={(e) =>
                                        setAlbumName(e.target.value)
                                    }
                                    className="w-full border-b bg-transparent focus:border-slate-500 focus:outline-none"
                                />
                            </div>
                            <div className="mt-3 flex justify-end">
                                <button
                                    className="rounded-lg bg-slate-500 px-4 py-2 text-white hover:bg-slate-600"
                                    onClick={handleSubmitCreateAlbum}
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex justify-between border-b border-slate-600 pb-3">
                    <h2 className="font-bold">Your album</h2>
                    <i
                        className="bx bx-plus text-2xl"
                        onClick={() => setShowAlbumForm(true)}
                    />
                </div>
                <div className="scrollbar-custom h-[90%] overflow-y-auto">
                    {myAlbums.length > 0 ? (
                        myAlbums.map((album) => (
                            <div
                                key={album.id}
                                className="mt-2 flex rounded-md p-2 hover:bg-white hover:bg-opacity-25"
                                onClick={() => {
                                    handleAddToPlaylist(
                                        album.id,
                                        idSong,
                                        songName,
                                        album.name,
                                    );
                                }}
                            >
                                <img
                                    className="h-20 w-20 rounded-md"
                                    src={album.image.url}
                                    alt={album.name}
                                />
                                <div className="my-auto flex-col justify-between px-3 text-left">
                                    <p className="text-xl font-bold">
                                        {album.name}
                                    </p>
                                    <p className="text-sm">
                                        {'Album'}
                                        {' • '}
                                        {album.songs.length} songs
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No albums found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AlbumFrame;
