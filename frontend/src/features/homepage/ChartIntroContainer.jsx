import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from 'react';
import {
    play,
    setCurrentTime,
    setDuration,
    setCurrentTrack,
} from "@features/player/slices/playerSlice";
import { PlayButton } from "@components/index";

function ChartIntroContainer() {
    const data = [
        {
            title: "Nếu lúc đó",
            artist: "tlinh",
            genre: "Pop",
            imageurl: {
                url: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1720449621/thumbnail/667ea7efa9ccf85d4fa8a099.png",
            },
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3",
            view: 0,
        },
        {
            title: "Nếu lúc đó",
            artist: "tlinh",
            genre: "Pop",
            imageurl: {
                url: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1720449621/thumbnail/667ea7efa9ccf85d4fa8a099.png",
            },
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3",
            view: 0,
        },
        {
            title: "Ngày Mai Người Ta Lấy Chồng",
            artist: "Thành Đạt",
            genre: "Pop",
            imageurl: {
                url: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1720450261/thumbnail/668a7f70532c8ae81fbe65d2.jpg",
            },
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352623/tracks/ngaymainguoitalaychong-thanhdat.mp3",
            view: 0
        },
        {
            title: "Ngày Mai Người Ta Lấy Chồng",
            artist: "Thành Đạt",
            genre: "Pop",
            imageurl: {
                url: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1720450261/thumbnail/668a7f70532c8ae81fbe65d2.jpg",
            },
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352623/tracks/ngaymainguoitalaychong-thanhdat.mp3",
            view: 0
        },
    ];

    const dispatch = useDispatch();
    const playerState = useSelector(state => state.player);

    const [currentSong, setCurrentSong] = useState(playerState.currentTrack.url);
    const [isPlaying, setIsPlaying] = useState(playerState.isPlaying);
    const handlePlay = ({ title, artist, imageurl, audiourl }) => () => {
        if (!audiourl)
            return;
        if (currentSong == null && playerState.currentTrack.url == audiourl)
            return;
        if (currentSong != audiourl) {
            dispatch(setCurrentTrack({
                title,
                artist,
                url: audiourl,
                thumbnail: imageurl.url
            }));
            dispatch(setCurrentTime(0));
            dispatch(setDuration(0));
            dispatch(play());
            setCurrentSong(audiourl);
            setIsPlaying(true);
        }
        else {
            setIsPlaying(!isPlaying);
            dispatch(!isPlaying ? play() : pause());
        }
    }

    useEffect(() => {
        if (playerState.currentTrack.url != currentSong) {
            setCurrentSong(null);
            setIsPlaying(false);
        }
        if (playerState.isPlaying != isPlaying) {
            setIsPlaying(playerState.isPlaying)
        }
    }, [playerState]);

    return (
        <div>
            {/* Intro chart */}
            <div className="relative grid flex-[1] grid-cols-[auto_auto] grid-rows-2 gap-20 text-sm">
                {data.map((song, index) => {
                    const { title, artist, imageurl, audiourl } = song;
                    const { url } = imageurl;
                    return (
                        <div
                            key={index}
                            className="song__container relative h-[210px] w-[200px]"
                        >
                            <div className="song__frame absolute top-5 h-full w-[90%] border-b-[1px] border-l-[1px] border-white before:absolute before:left-0 before:top-0 before:h-px before:w-3 before:bg-white before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-10 after:w-px after:bg-white after:content-['']"></div>
                            <div className="song__info absolute left-5 flex h-[110%] w-44 flex-col space-y-1">
                                <div className="w-full relative group">
                                    <img
                                        className="aspect-square w-full hover:cursor-pointer"
                                        src={url}
                                        alt={title}
                                    />
                                    <PlayButton
                                        onClick={handlePlay(song)}
                                        isOnPlaying={currentSong == audiourl && isPlaying}
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
                    );
                })}
            </div>
        </div>
    );
}

export default ChartIntroContainer;
