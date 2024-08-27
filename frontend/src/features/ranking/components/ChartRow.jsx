import propTypes from 'prop-types';
import { useEffect } from 'react';
import { PlayButton } from '@components';
import { useNavigate } from 'react-router-dom';

function ChartRow({
    id,
    rank,
    imageurl,
    title,
    artist,
    view,
    handlePlayClick,
    isOnPlaying,
}) {
    const nav = useNavigate();
    useEffect(() => {
        const image = document.querySelector('.aspect-square');
        image.classList.toggle('opacity-50', isOnPlaying);
    }, [isOnPlaying]);

    const handleTitleClick = () => {
        nav(`/song/${id}`);
    };

    const handleArtistClick = () => {
        nav(`/profile/${artist}`);
    };

    return (
        <div className="group relative mb-6 ml-3 flex cursor-default items-center rounded-full">
            <PlayButton
                position="bottom-2 left-14"
                isOnPlaying={isOnPlaying}
                onClick={handlePlayClick}
            />
            <p className="mr-7 w-1">{rank}</p>
            <img
                src={imageurl?.url}
                alt="song cover"
                className="mr-3 aspect-square size-[4.5rem] group-hover:opacity-50"
            />
            <p
                className="flex-auto basis-60 cursor-pointer font-normal text-white hover:underline"
                onClick={handleTitleClick}
            >
                {title}
            </p>
            <p
                className="flex-auto cursor-pointer hover:underline"
                onClick={handleArtistClick}
            >
                {artist}
            </p>
            <span className="w-32">{view.toLocaleString()}</span>
        </div>
    );
}

ChartRow.propTypes = {
    id: propTypes.string,
    rank: propTypes.number,
    imageurl: propTypes.object,
    title: propTypes.string,
    artist: propTypes.string,
    view: propTypes.number,
    handlePlayClick: propTypes.func.isRequired,
    isOnPlaying: propTypes.bool.isRequired,
};

export default ChartRow;
