import { useDispatch } from "react-redux";
import { setCurrentTime, setDuration, setCurrentTrack } from "@features/player/slices/playerSlice";

function ChartIntroContainer() {
    const data = [
        // {
        //     ext: 'jpg',
        //     name: 'Chúng ta của hiện tại',
        //     artist: 'Sơn Tùng MTP',
        // },
        {
            title: "Nếu lúc đó",
            artist: "tlinh",
            genre: "Pop",
            imageurl: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png",
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3",
            view: 0,
        },
        {
            title: "Nếu lúc đó",
            artist: "tlinh",
            genre: "Pop",
            imageurl: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png",
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3",
            view: 0,
        },
        {
            title: "Ngày Mai Người Ta Lấy Chồng",
            artist: "Thành Đạt",
            genre: "Pop",
            imageurl: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png",
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352623/tracks/ngaymainguoitalaychong-thanhdat.mp3",
            view: 0
        },
        {
            title: "Ngày Mai Người Ta Lấy Chồng",
            artist: "Thành Đạt",
            genre: "Pop",
            imageurl: "https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png",
            audiourl: "https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352623/tracks/ngaymainguoitalaychong-thanhdat.mp3",
            view: 0
        },
        // {
        //     ext: 'png',
        //     name: 'Lover',
        //     artist: 'Taylor Swift',
        // },
        // {
        //     ext: 'png',
        //     name: 'Hit me up',
        //     artist: 'Binz',
        // },
    ];

    const dispatch = useDispatch();
    const handlePlay = ({ title, artist, imageurl, audiourl }) => () => {
        dispatch(setCurrentTrack({ title, artist, url: audiourl, thumbnail: imageurl }));
        dispatch(setCurrentTime(0));
        dispatch(setDuration(0));
    }

    return (
        <div>
            {/* Intro chart */}
            <div className="relative grid flex-[1] grid-cols-[auto_auto] grid-rows-2 gap-20 text-sm">
                {data.map((song, index) => {
                    const { title, artist, imageurl, audiourl } = song;
                    // song container
                    return (
                        <div
                            key={index}
                            className="song__container relative h-[210px] w-[200px]"
                        >
                            <div className="song__frame absolute top-5 h-full w-[90%] border-b-[1px] border-l-[1px] border-white before:absolute before:left-0 before:top-0 before:h-px before:w-3 before:bg-white before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-10 after:w-px after:bg-white after:content-['']"></div>
                            <div className="song__info absolute left-5 flex h-[110%] w-44 flex-col space-y-1">
                                <img
                                    className="aspect-square w-full hover:cursor-pointer"
                                    src={imageurl}
                                    alt={title}
                                    onClick={handlePlay({ title, artist, imageurl, audiourl })}
                                />
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
