import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { setCurrentTrack, play, pause } from '@features/player/slices';
import { selectCurrentPlayer } from '@services/selectors';
import { usePlaySongMutation, useUndoPlaySongMutation } from '@services/api';

function useSong() {
    const dispatch = useDispatch();
    const { isPlaying, currentTrack } = useSelector(selectCurrentPlayer);
    const currentSong = currentTrack?.id;
    const [playSong] = usePlaySongMutation();
    const [undoPlaySong] = useUndoPlaySongMutation();

    const activateSong = async ({ id, title, artist, imageurl, coverimg }) => {
        if (id) {
            if (currentSong !== id) {
                try {
                    const res = await playSong(id).unwrap();
                    dispatch(
                        setCurrentTrack({
                            id,
                            title,
                            artist,
                            url: res.audiourl,
                            thumbnail: imageurl.url,
                            screen: coverimg?.url ?? '',
                        }),
                    );
                    dispatch(play());
                } catch (error) {
                    if (!error.data) {
                        await undoPlaySong(id);
                    }
                    toast.error('Failed to play song');
                }
            } else {
                if (!isPlaying) {
                    dispatch(play());
                } else {
                    dispatch(pause());
                }
            }
        }
    };
    return [currentSong, isPlaying, activateSong];
}

export default useSong;
