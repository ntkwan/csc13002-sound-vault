import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentPlaylist } from '@features/playlists/slices';
import { selectCurrentPlaylist, selectCurrentTrack } from '@services/selectors';
import useSong from '@hooks/useSong';

function BigPlayButton({ playlist, forSongPage = false, thisSong = {} }) {
    const dispatch = useDispatch();
    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const currentTrack = useSelector(selectCurrentTrack);

    const { id, songs } = playlist;
    const { currentSong, isPlaying, activateSong } = useSong();
    const isOnPlaying = forSongPage
        ? thisSong.id === currentSong && isPlaying
        : songs.find((song) => song.id === currentSong) && isPlaying;

    const handlePlay = () => {
        if (!id && songs.length === 0) return;
        let number = currentPlaylist?.id.match(/\d+$/);
        if (number) number = parseInt(number[0]);

        if (
            !currentPlaylist.id ||
            (currentPlaylist.id !== id && number !== songs.length)
        ) {
            dispatch(
                setCurrentPlaylist({
                    id: id ?? songs.length,
                    songs,
                }),
            );
            activateSong(songs[0]);
        } else {
            if (currentSong === -1) activateSong(songs[0]);
            else activateSong(currentTrack);
        }
    };

    const handleSongPageClick = () => {
        if (!currentPlaylist.id || currentPlaylist.id !== id) {
            dispatch(
                setCurrentPlaylist({
                    id: id,
                    songs,
                }),
            );
        }
        activateSong(thisSong);
    };

    return (
        <button
            className="h-[70px] min-w-[70px] rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125 disabled:scale-100 disabled:opacity-50 disabled:brightness-100"
            onClick={forSongPage ? handleSongPageClick : handlePlay}
            disabled={songs.length === 0 && !id}
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
    forSongPage: PropTypes.bool,
    thisSong: PropTypes.object,
};

export default BigPlayButton;
