import propTypes from 'prop-types';
import { useEffect } from 'react';
import { useSong } from '@hooks';
import { PlayButton } from '@components';

function ChartRow({ id, rank, imageurl, coverimg, title, artist, view }) {
    const [currentSong, isPlaying, activateSong] = useSong();
    const isOnPlaying = currentSong === id && isPlaying;

    useEffect(() => {
        const image = document.querySelector('.aspect-square');
        image.classList.toggle('opacity-50', isOnPlaying);
    }, [isOnPlaying]);

    return (
        <div className="group relative mb-6 ml-3 flex items-center rounded-full">
            <PlayButton
                position="bottom-2 left-14"
                isOnPlaying={isOnPlaying}
                onClick={() =>
                    activateSong({ id, title, artist, imageurl, coverimg })
                }
            />
            <p className="mr-7 w-1">{rank}</p>
            <img
                src={imageurl?.url}
                alt="song cover"
                className="mr-3 aspect-square size-[4.5rem] group-hover:opacity-50"
            />
            <p className="flex-auto basis-60 font-normal text-white">{title}</p>
            <p className="flex-auto">{artist}</p>
            <span className="w-32">{view.toLocaleString()}</span>
        </div>
    );
}

ChartRow.propTypes = {
    id: propTypes.string,
    rank: propTypes.number,
    imageurl: propTypes.object,
    coverimg: propTypes.object,
    title: propTypes.string,
    artist: propTypes.string,
    view: propTypes.number,
};

export default ChartRow;
