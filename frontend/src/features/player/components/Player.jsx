import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentPlayer } from '@services/selectors';
import {
    play,
    pause,
    setIsShuffle,
    setIsRepeat,
    setCurrentTime,
    setDuration,
} from '../slices';
import { useLoading, useSpacebar, useMouseMove } from '../hooks';
import Slider from './Slider';
import AudioButton from './AudioButton';
import VolumeControl from './VolumeControl';
import LikeButton from './LikeButton';

function Player() {
    const [isSolidBookmark, setIsSolidBookmark] = useState(false);
    const [isExpand, setIsExpand] = useState(false);
    const [onMouseDown, setOnMouseDown] = useState(false);
    const [onMouseUp, setOnMouseUp] = useState(false);

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
    const playerRef = useRef(null);

    const dispatch = useDispatch();
    const {
        isPlaying,
        isShuffle,
        isRepeat,
        currentTrack,
        currentTime,
        duration,
        volume,
    } = useSelector(selectCurrentPlayer);
    const [durationRender, setDurationRender] = useState(
        formatTimeDataToRender(duration),
    );
    const [currentTimeRender, setCurrentTimeRender] = useState(
        formatTimeDataToRender(currentTime),
    );

    const handlePlayClick = () => {
        if (isPlaying) dispatch(pause());
        else dispatch(play());
    };

    const handleRepeatClick = () => {
        dispatch(setIsRepeat(!isRepeat));
    };

    const handleShuffleClick = () => {
        dispatch(setIsShuffle(!isShuffle));
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

    const [isLoading, setLoading] = useLoading(1000);
    const isMouseMoved = useMouseMove();
    useSpacebar();

    const handleExpandClick = () => {
        setIsExpand(!isExpand);
        if (!isExpand) {
            setLoading();
        }
    };

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        const handleLoadedMetadata = () => {
            dispatch(setDuration(audio.duration));
            setDurationRender(formatTimeDataToRender(audio.duration));
            if (currentTime !== 0) {
                audio.currentTime = currentTime;
            }
        };
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                setIsExpand(false);
            }
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        document.addEventListener('fullscreenchange', handleFullscreenChange);

        return () => {
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange,
            );
        };
    }, [dispatch, currentTime]);

    useEffect(() => {
        if (isExpand) {
            playerRef.current.requestFullscreen();
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    }, [isExpand]);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        const handleTimeUpdate = () => {
            if (onMouseDown) return;
            if (onMouseUp) {
                audio.currentTime = currentTime;
                setOnMouseUp(false);
            }
            dispatch(setCurrentTime(audio.currentTime));
            setCurrentTimeRender(formatTimeDataToRender(currentTime));
        };
        audio.addEventListener('timeupdate', handleTimeUpdate);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [onMouseDown, onMouseUp, currentTime, dispatch]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume / 100;
        }
    }, [volume]);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;
        audio.loop = isRepeat;
    }, [isRepeat, dispatch]);

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        audio.onplay = () => {
            audio.currentTime = currentTime;
        };

        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTime]);

    const DefaultPlayer = (
        <div
            ref={playerRef}
            className="fixed bottom-0 left-0 right-0 z-10 flex h-20 content-center items-center justify-between bg-opacity-10 bg-musicbar px-5 backdrop-blur-lg before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-[#535353]"
        >
            {/* background */}

            {/* left */}
            <div className="flex w-max flex-[1] items-center space-x-4">
                <img
                    className="size-14 rounded-lg object-cover"
                    src={currentTrack.thumbnail}
                    alt=""
                />
                <div className="flex flex-col">
                    <span className="">{currentTrack.title}</span>
                    <span className="opacity-60">{currentTrack.artist}</span>
                </div>
                {/* heart-icon */}
                <LikeButton songId={currentTrack.id} />
            </div>
            {/* between */}
            <div className="flex flex-[2] flex-col items-center justify-between">
                {/* top */}
                <div className="mt-1 flex w-2/6 items-center justify-evenly text-xl [&_:is(i)]:p-1">
                    {/* shuffle */}
                    <AudioButton onClick={handleShuffleClick}>
                        {!isShuffle ? (
                            <i className="ri-shuffle-line"></i>
                        ) : (
                            <i className="ri-shuffle-line text-green-500"></i>
                        )}
                    </AudioButton>
                    {/* skip back */}
                    <AudioButton>
                        <i className="ri-skip-back-fill font-bold"></i>
                    </AudioButton>
                    {/* play */}
                    <AudioButton
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white hover:scale-110"
                        onClick={handlePlayClick}
                    >
                        {!isPlaying ? (
                            <i className="ri-play-mini-fill ml-[1px] mt-[1px] text-2xl font-bold text-black"></i>
                        ) : (
                            <i className="ri-pause-mini-fill -ml-[1.5px] mt-[1px] text-2xl font-bold text-black"></i>
                        )}
                    </AudioButton>
                    {/* skip forward */}
                    <AudioButton>
                        <i className="ri-skip-forward-fill font-bold"></i>
                    </AudioButton>
                    {/* repeat */}
                    <AudioButton onClick={handleRepeatClick}>
                        {!isRepeat ? (
                            <i className="ri-repeat-2-line"></i>
                        ) : (
                            <i className="ri-repeat-2-line text-green-500"></i>
                        )}
                    </AudioButton>
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
            </div>
            {/* right */}
            <div className="flex flex-[1] items-center justify-end space-x-3 text-xl [&_:is(i)]:p-1">
                {/* donate */}
                <AudioButton className="text-[1.375rem]">
                    <i className="bx bxs-dollar-circle"></i>
                </AudioButton>
                {/* bookmark */}
                <AudioButton onClick={handleBookmarkClick}>
                    {isSolidBookmark ? (
                        <i className="ri-bookmark-fill"></i>
                    ) : (
                        <i className="ri-bookmark-line"></i>
                    )}
                </AudioButton>
                {/* playlist */}
                <AudioButton>
                    <i className="playlist-icon ri-play-list-2-fill"></i>
                </AudioButton>
                {/* volume */}
                <VolumeControl volume={volume} dispatch={dispatch} />
                {/* expand */}
                <AudioButton onClick={handleExpandClick}>
                    <i className="ri-expand-diagonal-line"></i>
                </AudioButton>
                {/* more */}
                <AudioButton>
                    <i className="ri-more-fill"></i>
                </AudioButton>
            </div>
        </div>
    );

    const ExpandPlayer = (
        <div ref={playerRef}>
            {/* background */}
            <div className="absolute bottom-0 left-0 right-0 top-0 -z-20">
                <img
                    src={currentTrack?.screen}
                    alt="Song Screen Image"
                    className="absolute size-full object-cover"
                />
                <div className="absolute size-full bg-black opacity-70"></div>
                <div
                    className={`absolute size-full animate-fade-out opacity-0 ${currentTrack.theme}`}
                ></div>
            </div>
            {/* title */}
            <div
                className={`absolute bottom-56 ml-24 flex -translate-y-20 items-center gap-10 ${isLoading ? 'transition-transform duration-1000' : ''}`}
            >
                <img
                    className={`size-44 animate-fade-in rounded-lg object-cover transition-all duration-1000 ${isLoading ? 'size-[30rem]' : ''}`}
                    src={currentTrack.thumbnail}
                    alt=""
                />
                <div
                    className={`-ml-40 flex translate-x-40 flex-col gap-3 self-end ${isLoading ? 'transition-transform duration-1000' : ''}`}
                >
                    <span className="font-alfaslabone text-5xl">
                        {currentTrack.title}
                    </span>
                    <span className="text-2xl opacity-80">
                        {currentTrack.artist}
                    </span>
                </div>
            </div>
            {/* top */}
            <div
                className={`absolute bottom-[4.5rem] left-0 right-0 flex flex-col items-center opacity-0 ${!isLoading ? 'will-change-opacity transition-opacity duration-1000' : ''} ${isMouseMoved ? 'opacity-100' : ''}`}
            >
                <div className="flex h-min w-11/12 items-center justify-between gap-3">
                    <div className="min-w-10 text-right">
                        {currentTimeRender}
                    </div>
                    <Slider
                        max={duration}
                        value={currentTime}
                        onChange={handleOnMouseDown}
                        onMouseUp={handleOnMouseUp}
                    ></Slider>
                    <div className="min-w-10">{durationRender}</div>
                </div>
                <div className="mt-4 flex h-20 w-11/12 content-center items-center justify-between">
                    {/* bottom */}
                    {/* left */}
                    <div className="flex flex-[1]">
                        <LikeButton songId={currentTrack.id} />
                    </div>
                    {/* between */}
                    {/* top */}
                    <div className="mt-1 flex w-2/6 items-center justify-evenly text-xl [&_:is(i)]:p-1">
                        {/* shuffle */}
                        <AudioButton
                            onClick={handleShuffleClick}
                            className="text-2xl"
                        >
                            {!isShuffle ? (
                                <i className="ri-shuffle-line"></i>
                            ) : (
                                <i className="ri-shuffle-line text-green-500"></i>
                            )}
                        </AudioButton>
                        {/* skip back */}
                        <AudioButton className="text-2xl">
                            <i className="ri-skip-back-fill font-bold"></i>
                        </AudioButton>
                        {/* play */}
                        <AudioButton
                            className="flex h-16 w-16 items-center justify-center rounded-full bg-white hover:scale-110"
                            onClick={handlePlayClick}
                        >
                            {!isPlaying ? (
                                <i className="ri-play-mini-fill ml-[1px] mt-[1px] text-4xl font-bold text-black"></i>
                            ) : (
                                <i className="ri-pause-mini-fill -ml-[1px] mt-[1px] text-4xl font-bold text-black"></i>
                            )}
                        </AudioButton>
                        {/* skip forward */}
                        <AudioButton className="text-2xl">
                            <i className="ri-skip-forward-fill font-bold"></i>
                        </AudioButton>
                        {/* repeat */}
                        <AudioButton
                            onClick={handleRepeatClick}
                            className="text-2xl"
                        >
                            {!isRepeat ? (
                                <i className="ri-repeat-2-line"></i>
                            ) : (
                                <i className="ri-repeat-2-line text-green-500"></i>
                            )}
                        </AudioButton>
                    </div>
                    {/* right */}
                    <div className="flex flex-[1] items-center justify-end space-x-3 text-xl [&_:is(i)]:p-1">
                        {/* donate */}
                        <AudioButton className="text-[1.625rem]">
                            <i className="bx bxs-dollar-circle"></i>
                        </AudioButton>
                        {/* bookmark */}
                        <AudioButton
                            onClick={handleBookmarkClick}
                            className="text-2xl"
                        >
                            {isSolidBookmark ? (
                                <i className="ri-bookmark-fill"></i>
                            ) : (
                                <i className="ri-bookmark-line"></i>
                            )}
                        </AudioButton>
                        {/* volume */}
                        <VolumeControl volume={volume} dispatch={dispatch} />
                        {/* collapse */}
                        <AudioButton
                            onClick={handleExpandClick}
                            className="text-2xl"
                        >
                            <i className="ri-collapse-diagonal-line"></i>
                        </AudioButton>
                        {/* more */}
                        <AudioButton className="text-2xl">
                            <i className="ri-more-fill"></i>
                        </AudioButton>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            <audio ref={audioRef} src={currentTrack?.url} />
            {isExpand ? ExpandPlayer : DefaultPlayer}
        </>
    );
}

export default Player;
