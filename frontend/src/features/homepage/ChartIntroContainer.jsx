import { useSelector, useDispatch } from 'react-redux';
import {
    play,
    pause,
    setCurrentTrack,
} from '@features/player/slices/playerSlice';
import { useGetTopSongsQuery } from '@services/api';
import { selectCurrentPlayer } from '@services/selectors';
import { Loading, PlayButton } from '@components/index';

function ChartIntroContainer() {
    const dispatch = useDispatch();
    const { isPlaying, currentTrack } = useSelector(selectCurrentPlayer);
    const currentSong = currentTrack?.url;

    const handlePlay =
        ({ title, artist, image, audiourl }) =>
        () => {
            if (currentSong !== audiourl) {
                dispatch(
                    setCurrentTrack({
                        title,
                        artist,
                        url: audiourl,
                        thumbnail: image.url,
                    }),
                );
                dispatch(play());
            } else {
                if (!isPlaying) {
                    dispatch(play());
                } else {
                    dispatch(pause());
                }
            }
        };

    const { data: topSongsData, isLoading: topSongsLoading } =
        useGetTopSongsQuery();
    if (topSongsLoading) return <Loading />;

    const { topSongs } = topSongsData;
    const data = [
        { song: topSongs[0][0], className: 'left-0 top-0' },
        { song: topSongs[1][0], className: 'right-[15%] top-[15%]' },
        { song: topSongs[2][0], className: 'bottom-0 left-[10%]' },
    ];

    return (
        <div className="flex flex-[1] justify-center text-sm">
            <div className="relative h-full w-[600px]">
                {data.map((item, index) => (
                    <ChartItem
                        key={index}
                        song={item.song}
                        className={item.className}
                        onClick={handlePlay(item.song)}
                        isOnPlaying={
                            currentSong === item.song.audiourl && isPlaying
                        }
                    />
                ))}
            </div>
        </div>
    );
}

function ChartItem({ className, song, onClick, isOnPlaying }) {
    const { title, artist, image, audiourl } = song;
    const { url } = image;

    return (
        <div className={`absolute ${className}`}>
            <div className="song__container relative h-[210px] w-[200px]">
                <div className="song__frame absolute top-5 h-full w-[90%] border-b-[1px] border-l-[1px] border-white before:absolute before:left-0 before:top-0 before:h-px before:w-3 before:bg-white before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-10 after:w-px after:bg-white after:content-['']"></div>
                <div className="song__info absolute left-5 flex h-[110%] w-44 flex-col space-y-1">
                    <div className="group relative w-full">
                        <img
                            className="aspect-square w-full hover:cursor-pointer"
                            src={url}
                            alt={title}
                            onClick={onClick}
                        />
                        <PlayButton
                            onClick={onClick}
                            isOnPlaying={isOnPlaying}
                            position="bottom-1 right-1"
                        />
                    </div>
                    <span className="w-[155px] overflow-hidden text-ellipsis whitespace-nowrap">
                        {title}
                    </span>
                    <div className="flex items-center space-x-2">
                        <img
                            src="src/assets/img/artist-icon.svg"
                            alt="song icon"
                        />
                        <span className="w-[135px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {artist}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChartIntroContainer;
