import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlaylist } from '@features/playlists/slices';
import { selectCurrentPlaylist, selectCurrentTrack } from '@services/selectors';
import useSong from '@hooks/useSong';

function BigPlayButton({ playlist }) {
    const dispatch = useDispatch();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const currentTrack = useSelector(selectCurrentTrack);

    const { id, songs } = playlist;
    const { isPlaying, activateSong } = useSong();
    const isOnPlaying =
        songs.find((song) => song.id === currentTrack.id) && isPlaying;

    const handlePlay = () => {
        if (
            !currentPlaylist.id ||
            (currentPlaylist.id !== id &&
                !currentPlaylist.id.includes(songs.length.toString()))
        ) {
            dispatch(
                setCurrentPlaylist({
                    id: id ?? songs.length,
                    songs,
                }),
            );
            activateSong(songs[0]);
        } else {
            if (currentTrack.id === -1) activateSong(songs[0]);
            else activateSong(currentTrack);
        }
    };
    return (
        <button
            className="h-[70px] min-w-[70px] rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125"
            onClick={handlePlay}
        >
            {isOnPlaying ? (
                <i className="ri-pause-line text-[42px]"></i>
            ) : (
                <i className="ri-play-fill ml-1 text-[42px]"></i>
            )}
        </button>
    );
}

BigPlayButton.propTypes = {
    playlist: PropTypes.object.isRequired,
};

export default BigPlayButton;
