import { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    selectCurrentPlayer,
    selectCurrentPlaylist,
    selectCurrentProfile,
    selectCurrentToken,
} from '@services/selectors';
import {
    play,
    pause,
    setIsShuffle,
    setIsRepeat,
    setCurrentTime,
    setDuration,
    resetPlayer,
} from '../slices';
import { useLoading, useSpacebar, useMouseMove } from '../hooks';
import Slider from './Slider';
import AudioButton from './AudioButton';
import VolumeControl from './VolumeControl';
import LikeButton from './LikeButton';
import useSong from '@hooks/useSong';
import { DonateButton, DonateModal } from '@components';

function Player() {
    const token = useSelector(selectCurrentToken);
    const [isExpand, setIsExpand] = useState(false);
    const [onMouseDown, setOnMouseDown] = useState(false);
    const [onMouseUp, setOnMouseUp] = useState(false);

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

    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const isSingle = currentPlaylist.id.includes('Single');
    const { activateSong } = useSong();

    const handlePrev = () => {
        dispatch(pause());

        if (isRepeat) {
            audioRef.current.currentTime = 0;
            dispatch(play());
        } else {
            const currentIndex = currentPlaylist.songs.findIndex((song) => {
                return song.id === currentTrack.id;
            });

            if (currentIndex === 0) {
                dispatch(resetPlayer());
            } else {
                activateSong(currentPlaylist.songs[currentIndex - 1]);
            }
        }
    };

    const handleNext = () => {
        dispatch(pause());

        if (isRepeat) {
            audioRef.current.currentTime = 0;
            dispatch(play());
        } else {
            const currentIndex = currentPlaylist.songs.findIndex((song) => {
                return song.id === currentTrack.id;
            });

            if (isShuffle) {
                const previousSongs = currentPlaylist.songs.slice(
                    0,
                    currentIndex,
                );
                const remainingSongs = currentPlaylist.songs.slice(
                    currentIndex + 1,
                );
                const availableSongs = [...previousSongs, ...remainingSongs];

                const nextSongs =
                    availableSongs[
                        Math.floor(Math.random() * availableSongs.length)
                    ];
                activateSong(nextSongs);
            } else {
                if (currentIndex === currentPlaylist.songs.length - 1) {
                    dispatch(resetPlayer());
                } else {
                    activateSong(currentPlaylist.songs[currentIndex + 1]);
                }
            }
        }
    };

    useEffect(() => {
        if (!audioRef.current) return;
        const audio = audioRef.current;

        audio.addEventListener('ended', handleNext);

        return () => {
            audio.removeEventListener('ended', handleNext);
        };
    });

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

        audio.onplay = () => {
            audio.currentTime = currentTime;
        };

        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying, currentTime]);

    const { balance } = useSelector(selectCurrentProfile);
    const [modalVisible, setModalVisible] = useState(false);
    const openDonateModal = () => {
        if (isExpand) setIsExpand(false);
        setModalVisible(true);
    };
    const closeDonateModal = () => {
        setModalVisible(false);
    };

    const DefaultPlayer = (
        <div
            ref={playerRef}
            className="fixed bottom-0 left-0 right-0 z-40 flex h-20 content-center items-center justify-between bg-opacity-10 bg-musicbar px-5 backdrop-blur-lg before:absolute before:left-5 before:right-5 before:top-0 before:h-px before:bg-[#535353]"
        >
            {/* background */}

            {/* left */}
            <div className="flex w-max flex-[1] items-center space-x-4">
                <img
                    className="size-14 rounded-lg object-cover"
                    src={currentTrack.thumbnail}
                    alt={currentTrack.title + ' thumbnail'}
                />
                <div className="flex flex-col">
                    <span className="">{currentTrack.title}</span>
                    <span className="opacity-60">{currentTrack.artist}</span>
                </div>
                {/* heart-icon */}
                {token && <LikeButton songId={currentTrack.id} />}
            </div>
            {/* between */}
            <div className="flex flex-[2] flex-col items-center justify-between">
                {/* top */}
                <div className="mt-1 flex w-2/6 items-center justify-evenly text-xl [&_:is(i)]:p-1">
                    {/* shuffle */}
                    <AudioButton
                        onClick={handleShuffleClick}
                        disabled={isSingle}
                    >
                        {!isShuffle ? (
                            <i className="ri-shuffle-line"></i>
                        ) : (
                            <i className="ri-shuffle-line text-green-500"></i>
                        )}
                    </AudioButton>
                    {/* skip back */}
                    <AudioButton onClick={handlePrev}>
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
                    <AudioButton onClick={handleNext}>
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
                {token && (
                    <DonateButton
                        openDonateModal={openDonateModal}
                        song={currentTrack.title}
                        artist={currentTrack.artist}
                    />
                )}
                {/* volume */}
                <VolumeControl volume={volume} dispatch={dispatch} />
                {/* expand */}
                <AudioButton onClick={handleExpandClick}>
                    <i className="ri-expand-diagonal-line"></i>
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
                    alt={currentTrack.title + ' screen'}
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
                    alt={currentTrack.title + ' thumbnail'}
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
                        {token && <LikeButton songId={currentTrack.id} />}
                    </div>
                    {/* between */}
                    {/* top */}
                    <div className="mt-1 flex w-2/6 items-center justify-evenly text-xl [&_:is(i)]:p-1">
                        {/* shuffle */}
                        <AudioButton
                            onClick={handleShuffleClick}
                            disabled={isSingle}
                            className="text-2xl"
                        >
                            {!isShuffle ? (
                                <i className="ri-shuffle-line"></i>
                            ) : (
                                <i className="ri-shuffle-line text-green-500"></i>
                            )}
                        </AudioButton>
                        {/* skip back */}
                        <AudioButton className="text-2xl" onClick={handlePrev}>
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
                        <AudioButton className="text-2xl" onClick={handleNext}>
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
                        {token && (
                            <DonateButton
                                openDonateModal={openDonateModal}
                                song={currentTrack.title}
                                artist={currentTrack.artist}
                            />
                        )}
                        {/* volume */}
                        <VolumeControl volume={volume} dispatch={dispatch} />
                        {/* collapse */}
                        <AudioButton
                            onClick={handleExpandClick}
                            className="text-2xl"
                        >
                            <i className="ri-collapse-diagonal-line"></i>
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
            {modalVisible && (
                <DonateModal
                    balance={balance}
                    closeDonateModal={closeDonateModal}
                    song={currentTrack.title}
                    artist={currentTrack.artist}
                />
            )}
        </>
    );
}

export default Player;
