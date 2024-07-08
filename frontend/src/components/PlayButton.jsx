import PropTypes from 'prop-types';

function PlayButton({ onClick, isOnPlaying, position = "bottom-1 right-1" }) {
    const buttonClass = isOnPlaying ? "-translate-y-2" : "opacity-0 transition-all duration-300 ease-in-out group-hover:-translate-y-2 group-hover:opacity-100"

    return (
        <button className={`media-item__play absolute ${position} h-10 w-10 -translate-x-2 rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF] ${buttonClass}`}
            onClick={onClick}
        >
            {isOnPlaying ? <i className="ri-pause-line text-xl"></i> : <i className="ri-play-fill text-xl"></i>}
        </button>
    )
}

PlayButton.prototype = {
    onClick: PropTypes.func.isRequired,
    isOnPlaying: PropTypes.bool.isRequired,
}

export default PlayButton;