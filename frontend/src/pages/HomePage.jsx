import PropTypes from 'prop-types';
import { useEffect, useRef, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { useGetTopSongsQuery } from '@services/api';
import { selectCurrentPlaylist } from '@services/selectors';
import { useSong } from '@hooks';

import { MediaContainer } from '@features/homepage';
import { setCurrentPlaylist } from '@features/playlists/slices';
import { PlayButton } from '@components/index';
import homeintroImage from '@assets/img/homeintro.svg';
import ArtistIcon from '@assets/img/artist-icon.svg';

function HomePage() {
    // intro refs
    const introContainerRef = useRef(null);
    const introLogoRef = useRef(null);
    const introTitleRef = useRef(null);
    const introDescRef = useRef(null);
    const introImageRef = useRef(null);

    // chart refs
    const chartContainerRef = useRef(null);
    const chartLogoRef = useRef(null);
    const chartDescRef = useRef(null);
    const chartButtonRef = useRef(null);
    const chartItem1Ref = useRef(null);
    const chartItem2Ref = useRef(null);
    const chartItem3Ref = useRef(null);

    // media ref
    const mediaRef = useRef(null);

    useEffect(() => {
        const handleObserver = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // Thêm lớp active với khoảng trễ khác nhau cho từng phần tử
                    if (entry.target === introContainerRef.current) {
                        // intro logo
                        introLogoRef.current.classList.remove(
                            'opacity-0',
                            '-translate-x-96',
                        );
                        introLogoRef.current.classList.add('translate-x-2');
                        setTimeout(() => {
                            introLogoRef.current.classList.remove(
                                'translate-x-2',
                            );
                        }, 1000);

                        // intro title
                        setTimeout(() => {
                            introTitleRef.current.classList.remove(
                                'opacity-0',
                                '-translate-x-[400px]',
                            );
                            introTitleRef.current.classList.add(
                                'translate-x-2',
                            );
                        }, 200);
                        setTimeout(() => {
                            introTitleRef.current.classList.remove(
                                'translate-x-2',
                            );
                        }, 1200);

                        // intro desc
                        setTimeout(() => {
                            introDescRef.current.classList.remove(
                                'opacity-0',
                                '-translate-x-96',
                            );
                            introDescRef.current.classList.add('translate-x-2');
                        }, 400);
                        setTimeout(() => {
                            introDescRef.current.classList.remove(
                                'translate-x-2',
                            );
                        }, 1400);

                        // intro image
                        setTimeout(() => {
                            introImageRef.current.classList.remove(
                                'opacity-0',
                                'scale-50',
                                'translate-x-[50%]',
                            );
                            introImageRef.current.classList.add(
                                'scale-100',
                                'translate-x-[6%]',
                            );
                        }, 200);
                        setTimeout(() => {
                            introImageRef.current.classList.remove(
                                'translate-x-[6%]',
                            );
                            introImageRef.current.classList.add(
                                'translate-x-[10%]',
                            );
                        }, 1200);
                    } else if (entry.target === chartContainerRef.current) {
                        // chart logo
                        chartContainerRef.current.classList.remove(
                            'overflow-clip',
                        );
                        chartLogoRef.current.classList.remove(
                            'opacity-0',
                            'translate-x-96',
                        );
                        chartLogoRef.current.classList.add('-translate-x-2');
                        setTimeout(() => {
                            chartLogoRef.current.classList.remove(
                                '-translate-x-2',
                            );
                        }, 1000);

                        // chart desc
                        setTimeout(() => {
                            chartDescRef.current.classList.remove(
                                'opacity-0',
                                'translate-x-96',
                            );
                            chartDescRef.current.classList.add(
                                '-translate-x-2',
                            );
                        }, 200);
                        setTimeout(() => {
                            chartDescRef.current.classList.remove(
                                '-translate-x-2',
                            );
                        }, 1200);

                        // chart button
                        setTimeout(() => {
                            chartButtonRef.current.classList.remove(
                                'opacity-0',
                                'translate-x-96',
                            );
                            chartButtonRef.current.classList.add(
                                '-translate-x-2',
                            );
                        }, 400);
                        setTimeout(() => {
                            chartButtonRef.current.classList.remove(
                                '-translate-x-2',
                            );
                        }, 1400);

                        // chart item 1
                        setTimeout(() => {
                            chartItem1Ref.current.classList.remove(
                                'opacity-0',
                                '-translate-x-40',
                                '-translate-y-40',
                            );
                            chartItem1Ref.current.classList.add(
                                'translate-x-2',
                            );
                        }, 200);
                        setTimeout(() => {
                            chartItem1Ref.classList.remove('translate-x-2');
                        }, 1200);

                        // chart item 2
                        setTimeout(() => {
                            chartItem2Ref.current.classList.remove(
                                'opacity-0',
                                'translate-x-40',
                                '-translate-y-40',
                            );
                            chartItem2Ref.current.classList.add(
                                'translate-x-2',
                            );
                        }, 200);
                        setTimeout(() => {
                            chartItem2Ref.classList.remove('translate-x-2');
                        }, 1200);

                        // chart item 2
                        setTimeout(() => {
                            chartItem3Ref.current.classList.remove(
                                'opacity-0',
                                'translate-y-40',
                            );
                            chartItem3Ref.current.classList.add(
                                'translate-x-2',
                            );
                        }, 200);
                        setTimeout(() => {
                            chartItem3Ref.classList.remove('translate-x-2');
                        }, 1200);
                    } else {
                        entry.target.classList.remove(
                            'opacity-0',
                            'translate-y-40',
                        );
                        entry.target.classList.add(
                            'opacity-100',
                            'translate-y-0',
                        );
                    }
                    observer.unobserve(entry.target);
                }
            });
        };

        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
        });

        if (introContainerRef.current)
            observer.observe(introContainerRef.current);
        if (chartContainerRef.current)
            observer.observe(chartContainerRef.current);
        if (mediaRef.current) observer.observe(mediaRef.current);

        return () => {
            if (introContainerRef.current)
                observer.unobserve(introContainerRef.current);
            if (chartContainerRef.current)
                observer.observe(chartContainerRef.current);
            if (mediaRef.current) observer.unobserve(mediaRef.current);
        };
    }, []);

    const dispatch = useDispatch();
    const { data: topSongs } = useGetTopSongsQuery();
    const { currentSong, isPlaying, activateSong } = useSong();
    const currentPlaylist = useSelector(selectCurrentPlaylist);

    if (!topSongs) return null;

    const data = [
        {
            song: topSongs[0],
            className:
                'left-0 top-0 opacity-0 transition duration-1000 ease-in-out -translate-x-40 -translate-y-40',
            ref: chartItem1Ref,
        },
        {
            song: topSongs[1],
            className:
                'right-[15%] top-[15%] opacity-0 translate-x-40 -translate-y-40  transition duration-1000 ease-in-out',
            ref: chartItem2Ref,
        },
        {
            song: topSongs[2],
            className:
                'bottom-0 left-[10%] opacity-0  translate-y-40 transition duration-1000 ease-in-out',
            ref: chartItem3Ref,
        },
    ];

    const handlePlayClick = (song) => {
        if (!currentPlaylist.id || currentPlaylist.id !== 'Single TopSongs') {
            dispatch(
                setCurrentPlaylist({
                    id: 'Single TopSongs',
                    songs: topSongs,
                }),
            );
        }
        activateSong(song);
    };

    return (
        <div className="homepage grid select-none auto-rows-auto gap-y-16 caret-transparent">
            {/* Intro SoundVault */}
            <div
                className="homepage__intro-container flex items-center text-white"
                ref={introContainerRef}
            >
                {/* Intro text */}
                <div className="homepage__intro-content -translate-y-[20%]">
                    <h2
                        className="homepage__intro-logo heading-stroke-logo -translate-x-96 transform select-none text-nowrap font-lilitaone text-[90px] leading-none opacity-0 transition duration-[1100ms] ease-in-out"
                        ref={introLogoRef}
                    >
                        SoundVault
                    </h2>
                    <h3
                        className="homepage__intro-title transiton -translate-x-[400px] transform text-nowrap font-italianno text-[90px] leading-none opacity-0 transition duration-1000 ease-in-out"
                        ref={introTitleRef}
                    >
                        Digital Music for Fans
                    </h3>
                    <p
                        className="homepage__intro-desc -translate-x-96 text-xl opacity-0 transition duration-1000 ease-in-out"
                        ref={introDescRef}
                    >
                        SoundVault is a digital music service that gives users
                        access to millions of songs. Artists can utilize this
                        platform as a marketplace to sell their albums and
                        merchandise.
                    </p>
                </div>
                {/* Intro image */}
                <img
                    className="homepage__intro-image -translate-y-[8%] translate-x-[50%] scale-50 object-cover opacity-0 transition duration-1000 ease-in-out"
                    src={homeintroImage}
                    alt="SoundVault Intro"
                    ref={introImageRef}
                />
            </div>

            {/* Chart Intro */}
            <div
                className="chart-intro flex h-[550px] justify-between overflow-clip font-kodchasan text-white"
                ref={chartContainerRef}
            >
                {/* <ChartIntroContainer /> */}

                <div className="flex flex-[1] justify-center text-sm">
                    <div className="relative h-full w-[600px]">
                        {data.map((item, index) => (
                            <ChartItem
                                key={index}
                                song={item.song}
                                className={item.className}
                                handlePlayClick={() =>
                                    handlePlayClick(item.song)
                                }
                                isOnPlaying={
                                    currentSong === item.song.id && isPlaying
                                }
                                ref={item.ref}
                            />
                        ))}
                    </div>
                </div>

                {/* Intro chart text */}
                <div className="w-min flex-[0.75] content-center">
                    <h2
                        className="heading-stroke translate-x-96 select-none text-nowrap font-italianno text-[100px] leading-none opacity-0 transition duration-1000 ease-in-out"
                        ref={chartLogoRef}
                    >
                        SoundVault Charts
                    </h2>
                    <p
                        className="translate-x-96 text-xl opacity-0 transition duration-1000 ease-in-out"
                        ref={chartDescRef}
                    >
                        SoundVault Chart is a dynamic music ranking chart based
                        on the number of listeners. It tracks the most popular
                        songs across various genres, reflecting real-time
                        listening habits and trends.
                    </p>
                    <Link
                        className="button group relative mt-5 flex w-max translate-x-96 items-center rounded-full border-[2px] px-5 py-[10px] opacity-0 transition duration-1000 ease-in-out"
                        to="chart"
                        ref={chartButtonRef}
                    >
                        Explore SoundVault Chart
                        <i className="button__icon ri-arrow-right-s-line text-2xl leading-none"></i>
                        <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
                    </Link>
                </div>
            </div>

            {/* Media Container */}
            <div
                className="media-container translate-y-40 transform opacity-0 transition duration-1000 ease-in-out"
                ref={mediaRef}
            >
                <MediaContainer />
            </div>
        </div>
    );
}

const ChartItem = forwardRef(
    ({ className, song, handlePlayClick, isOnPlaying }, ref) => {
        const { title, artist, imageurl, id } = song;
        const { url } = imageurl;

        const nav = useNavigate();

        return (
            <div className={`absolute ${className}`} ref={ref}>
                <div className="song__container relative h-[210px] w-[200px]">
                    <div className="song__frame absolute top-5 h-full w-[90%] border-b-[1px] border-l-[1px] border-white before:absolute before:left-0 before:top-0 before:h-px before:w-3 before:bg-white before:content-[''] after:absolute after:bottom-0 after:right-0 after:h-10 after:w-px after:bg-white after:content-['']"></div>
                    <div className="song__info absolute left-5 flex h-[110%] w-44 flex-col space-y-1">
                        <div className="group relative w-full">
                            <img
                                className="aspect-square w-full hover:cursor-pointer"
                                src={url}
                                alt={title}
                                onClick={() => {
                                    nav(`/song/${id}`);
                                }}
                            />
                            <PlayButton
                                onClick={handlePlayClick}
                                isOnPlaying={isOnPlaying}
                                position="bottom-1 right-1"
                            />
                        </div>
                        <span className="w-[155px] overflow-hidden text-ellipsis whitespace-nowrap">
                            {title}
                        </span>
                        <div className="flex items-center space-x-2">
                            <img src={ArtistIcon} alt="song icon" />
                            <span className="w-[135px] overflow-hidden text-ellipsis whitespace-nowrap">
                                {artist}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
);

ChartItem.displayName = 'ChartItem';

ChartItem.propTypes = {
    className: PropTypes.string,
    song: PropTypes.shape({
        id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        artist: PropTypes.string.isRequired,
        imageurl: PropTypes.shape({
            url: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    handlePlayClick: PropTypes.func.isRequired,
    isOnPlaying: PropTypes.bool.isRequired,
};
export default HomePage;
