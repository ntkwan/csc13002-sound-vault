import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChartIntroContainer, MediaContainer } from '@features/homepage';
import homeintroImage from '@assets/img/homeintro.svg';
function HomePage() {
    useEffect(() => {
        const reloadKey = Date.now();
        // console.log('reloadKey', reloadKey);
        document.querySelector('.homepage').setAttribute('key', reloadKey);
    }, []);

    return (
        <div className="homepage grid auto-rows-auto gap-y-16 caret-transparent">
            {/* Intro SoundVault */}
            <div className="homepage__container flex items-center text-white">
                {/* Intro text */}
                <div className="homepage__text -translate-y-[20%]">
                    <h2 className="heading-stroke-logo select-none text-nowrap font-lilitaone text-[90px] leading-none">
                        SoundVault
                    </h2>
                    <h3 className="text-nowrap font-italianno text-[90px] leading-none">
                        Digital Music for fans
                    </h3>
                    <p className="text-xl">
                        SoundVault is a digital music service that gives users
                        access to millions of songs. Artists can ultilize this
                        platform as a marketplace to sell their albums and
                        merchandises.
                    </p>
                </div>
                {/* Intro image */}
                <img
                    className="homepage__img -translate-y-[8%] translate-x-[13%] object-cover"
                    src={homeintroImage}
                    alt=""
                />
            </div>

            {/* Chart Intro */}
            <div className="chart-intro flex h-[550px] justify-between font-kodchasan text-white">
                <ChartIntroContainer />
                {/* Intro chart text */}
                <div className="w-min flex-[0.75] content-center">
                    <h2 className="heading-stroke select-none text-nowrap font-italianno text-[100px]">
                        SoundVault Charts
                    </h2>
                    <p className="text-xl">
                        SoundVault Chart is a dynamic music ranking chart based
                        on the number of listeners. It tracks the most popular
                        songs across various genres, reflecting real-time
                        listening habits and trends.
                    </p>
                    <Link
                        className="button group relative mt-5 flex w-max items-center rounded-full border-[2px] px-5 py-[10px]"
                        to="chart"
                    >
                        Explore SoundVault Chart
                        <i className="button__icon ri-arrow-right-s-line text-2xl leading-none"></i>
                        <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-full bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
                    </Link>
                </div>
            </div>

            <MediaContainer />
        </div>
    );
}

export default HomePage;
