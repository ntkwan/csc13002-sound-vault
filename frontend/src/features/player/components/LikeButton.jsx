import propTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import AudioButton from './AudioButton';
import { selectMyPlaylists } from '@services/selectors';
import {
    useAddSongToLikedPlaylistMutation,
    useRemoveSongFromLikedPlaylistMutation,
} from '@services/api';

function LikeButton({ songId }) {
    const myPlaylists = useSelector(selectMyPlaylists);
    const likedSongs = myPlaylists.find(
        (playlist) => playlist.name === 'Liked Songs',
    )?.songs;

    const [isLiked, setIsLiked] = useState(likedSongs?.includes(songId));
    useEffect(() => {
        setIsLiked(likedSongs?.includes(songId));
    }, [likedSongs, songId]);

    const [addSongToLikedPlaylist] = useAddSongToLikedPlaylistMutation();
    const [removeSongFromLikedPlaylist] =
        useRemoveSongFromLikedPlaylistMutation();

    const handleHeartClick = async () => {
        try {
            if (isLiked) {
                await removeSongFromLikedPlaylist(songId).unwrap();
            } else {
                await addSongToLikedPlaylist(songId).unwrap();
            }
            setIsLiked(!isLiked);
        } catch (error) {
            toast.error(error.data.message);
        }
    };

    return (
        <AudioButton onClick={handleHeartClick}>
            <i
                className={`heart-icon text-2xl ${
                    isLiked ? 'ri-heart-fill' : 'ri-heart-line'
                }`}
            ></i>
        </AudioButton>
    );
}

LikeButton.propTypes = {
    songId: propTypes.string.isRequired,
};

export default LikeButton;
