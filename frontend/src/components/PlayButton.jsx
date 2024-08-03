import PropTypes from 'prop-types';

function PlayButton({ onClick, isOnPlaying, position = 'bottom-1 right-1' }) {
    const buttonClass = isOnPlaying
        ? '-translate-y-2'
        : 'opacity-0 group-hover:-translate-y-2 group-hover:opacity-100';

    return (
        <button
            className={`media-item__play absolute z-10 h-10 w-10 -translate-x-2 rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] transition-all duration-300 ease-in-out hover:scale-110 hover:brightness-125 ${position} ${buttonClass}`}
            onClick={onClick}
        >
            {isOnPlaying ? (
                <i className="ri-pause-line text-xl"></i>
            ) : (
                <i className="ri-play-fill text-xl"></i>
            )}
        </button>
    );
}

PlayButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    isOnPlaying: PropTypes.bool.isRequired,
    position: PropTypes.string,
};

export default PlayButton;
