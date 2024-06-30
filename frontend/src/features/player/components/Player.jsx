import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentPlayer } from '@services/selectors';
import PropTypes from 'prop-types';
import {
    setIsPlaying,
    setIsRepeat,
    setCurrentTime,
    setDuration,
    setVolume,
} from '../slices';
import Slider from './Slider';

function Player() {
    const [isSolidHeart, setIsSolidHeart] = useState(false);
    const [isSolidBookmark, setIsSolidBookmark] = useState(false);
    const [onMouseDown, setOnMouseDown] = useState(false);
    const [onMouseUp, setOnMouseUp] = useState(false);

    const handleHeartClick = () => {
        setIsSolidHeart(!isSolidHeart);
    };
    const handleBookmarkClick = () => {
        setIsSolidBookmark(!isSolidBookmark);
    };

    const formatTimeDataToRender = (timeData) => {
        const minutes = Math.floor(timeData / 60);
        const seconds = Math.floor(timeData % 60);
        if (isNaN(minutes) || isNaN(seconds)) {
            return '0:00';
        }
        return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    };

    const audioRef = useRef(null);
    const dispatch = useDispatch();
    const { isPlaying, isRepeat, currentTrack, currentTime, duration, volume } =
        useSelector(selectCurrentPlayer);

    const [durationRender, setDurationRender] = useState(
        formatTimeDataToRender(duration),
    );
    const [currentTimeRender, setCurrentTimeRender] = useState(
        formatTimeDataToRender(currentTime),
    );

    const handlePlayClick = () => {
        dispatch(setIsPlaying(!isPlaying));
    };

    const handleRepeatClick = () => {
        dispatch(setIsRepeat(!isRepeat));
    };

    const handleOnMouseDown = (e) => {
        setOnMouseDown(true);
        dispatch(setCurrentTime(e.target.value));
        setCurrentTimeRender(formatTimeDataToRender(currentTime));
    };

    const handleOnMouseUp = () => {
        setOnMouseUp(true);
        setOnMouseDown(false);
    };

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        const handleLoadedMetadata = () => {
            dispatch(setDuration(audio.duration));
            setDurationRender(formatTimeDataToRender(audio.duration));
            if (currentTime !== '0:00') {
                audio.currentTime = currentTime;
            }
        };
        const handleTimeUpdate = () => {
            if (onMouseDown) return;
            if (onMouseUp) {
                audio.currentTime = currentTime;
                setOnMouseUp(false);
            }

            dispatch(setCurrentTime(audio.currentTime));
            setCurrentTimeRender(formatTimeDataToRender(currentTime));
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [dispatch, currentTime, onMouseDown, onMouseUp]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    useEffect(() => {
        const repeatBtn = document.querySelector(
            'button:has(.ri-repeat-2-line)',
        );
        if (isRepeat) {
            repeatBtn.classList.add('text-green-500', 'font-bold');
        } else {
            repeatBtn.classList.remove('text-green-500', 'font-bold');
        }

        if (!audioRef.current) return;
        const audio = audioRef.current;

        const handleEnded = () => {
            if (isRepeat) {
                audio.play();
            } else {
                dispatch(setIsPlaying(false));
            }
        };

        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('ended', handleEnded);
        };
    }, [isRepeat, dispatch]);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        audio.onplay = () => {
            const playIcon = document.querySelector('.ri-play-fill');
            playIcon.classList.remove('ri-play-fill');
            playIcon.classList.remove('ml-[2px]');
            playIcon.classList.add('ri-pause-fill');
            playIcon.classList.add('font-bold');
        };
        audio.onpause = () => {
            const pauseIcon = document.querySelector('.ri-pause-fill');
            pauseIcon.classList.remove('ri-pause-fill');
            pauseIcon.classList.remove('font-bold');
            pauseIcon.classList.add('ml-[2px]');
            pauseIcon.classList.add('ri-play-fill');
        };

        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    return (
        <div className="before:contents-[''] fixed bottom-0 left-[0px] right-[0px] z-10 mt-10 flex h-[70px] content-center items-center justify-between bg-opacity-10 bg-musicbar px-5 backdrop-blur-lg before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-[#535353]">
            {/* background */}

            {/* left */}
            <div className="flex w-max flex-[1] items-center space-x-4">
                <img className="h-12 w-12" src="" alt="" />
                <div className="flex flex-col">
                    <span className="">Đánh đổi</span>
                    <span className="text-[#808080]">obito</span>
                </div>
                {/* heart-icon */}
                <div onClick={handleHeartClick} className="cursor-pointer">
                    {isSolidHeart ? (
                        <i className="ri-heart-fill text-2xl text-white"></i>
                    ) : (
                        <i className="ri-heart-line fa-heart text-2xl text-[#808080]"></i>
                    )}
                </div>
            </div>
            {/* between */}
            <div className="flex flex-[2] flex-col items-center justify-between">
                {/* top */}
                <div className="mt-1 flex w-2/6 items-center justify-evenly text-xl [&_:is(i)]:p-1">
                    <button className="opacity-90 hover:scale-110 hover:opacity-100">
                        <i className="ri-shuffle-fill"></i>
                    </button>
                    <button className="opacity-90 hover:scale-110 hover:opacity-100">
                        <i className="ri-skip-back-fill"></i>
                    </button>
                    <button
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
                        onClick={handlePlayClick}
                    >
                        <i className="ri-play-fill ml-[2px] text-2xl font-bold text-black"></i>
                    </button>
                    <button className="opacity-90 hover:scale-110 hover:opacity-100">
                        <i className="ri-skip-forward-fill"></i>
                    </button>
                    <button
                        onClick={handleRepeatClick}
                        className="opacity-90 hover:scale-110 hover:opacity-100"
                    >
                        <i className="ri-repeat-2-line"></i>
                    </button>
                </div>
                {/* bottom */}
                <div className="flex h-min w-3/4 items-center justify-between gap-3">
                    <div className="min-w-10 text-right text-xs">
                        {currentTimeRender}
                    </div>
                    <Slider
                        max={duration}
                        value={currentTime}
                        onChange={handleOnMouseDown}
                        onMouseUp={handleOnMouseUp}
                    ></Slider>
                    <div className="min-w-10 text-xs">{durationRender}</div>
                </div>
                {/* audio */}
                <audio ref={audioRef} src={currentTrack?.url} />
            </div>
            {/* right */}
            <div className="flex flex-[1] items-center justify-end space-x-3 text-xl [&_:is(i)]:p-1">
                <div onClick={handleBookmarkClick} className="cursor-pointer">
                    {isSolidBookmark ? (
                        <i className="ri-bookmark-fill"></i>
                    ) : (
                        <i className="ri-bookmark-line"></i>
                    )}
                </div>
                <i className="ri-play-list-2-fill"></i>
                <i className="ri-music-2-fill"></i>
                <VolumeControl volume={volume} dispatch={dispatch} />
                <i className="ri-expand-diagonal-line"></i>
                <i className="ri-more-fill"></i>
            </div>
        </div>
    );
}

export default Player;

const VolumeControl = ({ volume, dispatch }) => {
    const [oldVolume, setOldVolume] = useState(volume);

    const handleIconClick = (newVolume) => {
        if (newVolume === 0) {
            dispatch(setVolume(oldVolume));
        } else {
            setOldVolume(volume);
            dispatch(setVolume(0));
        }
    };

    const handleOnChange = (event) => {
        dispatch(setVolume(event.target.value));
    };

    return (
        <div className="flex w-3/12 items-center">
            <i
                className={
                    volume < 1
                        ? 'ri-volume-mute-fill'
                        : volume <= 40
                          ? 'ri-volume-down-fill'
                          : 'ri-volume-up-fill'
                }
                onClick={() => handleIconClick(volume)}
            ></i>
            <Slider max={100} value={volume} onChange={handleOnChange}></Slider>
        </div>
    );
};

VolumeControl.propTypes = {
    volume: PropTypes.number.isRequired,
    dispatch: PropTypes.func.isRequired,
};
