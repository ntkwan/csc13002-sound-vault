import "../../assets/themify-icons/themify-icons.css";
import { Link } from 'react-router-dom';

function ChartIntroContainer() {
    const songs = {
        src: "./src/assets/img/song/",
        data: [
            {
                ext: 'jpg',
                name: "Chúng ta của hiện tại",
                artist: "Sơn Tùng MTP"
            },
            {
                ext: 'png',
                name: "Nếu lúc đó",
                artist: "tlinh"
            },
            {
                ext: 'png',
                name: "Lover",
                artist: "Taylor Swift"
            },
            {
                ext: 'png',
                name: "Hit me up",
                artist: "Binz"
            }
        ]
    };

    const { src, data } = songs;

    return (
        <div className="chart flex justify-between font-kodchasan text-white">
            {/* Intro chart */}
            <div className="flex-[1] grid grid-rows-2 grid-cols-[auto_auto] gap-20 relative p-12 text-sm">
                {data.map((song, index) => {
                    const { ext, name, artist } = song;
                    // song container
                    return (
                        <div key={index} className="song__container relative w-[200px] h-[210px]">
                            <div className="song__frame absolute top-5 w-[90%] h-full border-l-[1px] border-b-[1px] border-white
                            before:content-[''] before:absolute before:bg-white before:top-0 before:left-0 before:w-3 before:h-px
                            after:content-[''] after:absolute after:bg-white after:bottom-0 after:right-0 after:w-px after:h-10">
                            </div>
                            <div className="song__info absolute flex flex-col left-5 w-44 h-[110%]">
                                <img className="w-44 h-44" src={`${src}${name}.${ext}`} alt="" />
                                <span className="w-[155px] mt-[7px] whitespace-nowrap overflow-hidden text-ellipsis">{name}</span>
                                <div className="flex items-center space-x-2">
                                    <img src="src/assets/img/design/song-icon.svg" alt="song icon" />
                                    <span className="w-[135px] whitespace-nowrap overflow-hidden text-ellipsis">{artist}</span>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
            {/* Intro chart text */}
            <div className="flex-[1] content-center">
                <h2 className="font-italianno text-7xl">SoundVault Charts</h2>
                <p className="text-xl">
                    SoundVault Chart is a dynamic music ranking chart based
                    on the number of listeners. It tracks the most popular
                    songs across various genres, reflecting real-time
                    listening habits and trends.
                </p>
                <Link className="group block relative w-max px-5 py-[10px] mt-5 border-[1px] rounded-full" to="chart">
                    Explore SoundVault Chart
                    <i className="ti-angle-right text-sm"></i>
                    <div className="button__bg absolute top-0 left-0 w-full h-full z-[-1] rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0
                                    group-hover:opacity-100 transition duration-500 ease-in-out"></div>
                </Link>
            </div>
        </div>
    );
}

export default ChartIntroContainer;