import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChartIntroContainer, MediaContainer } from "@features"
import homeintroImage from "@assets/img/homeintro.svg";

function HomePage() {
  useEffect(() => {
    const reloadKey = Date.now();
    document.querySelector('.homepage').setAttribute('key', reloadKey);
  }, []);

  return (
    <div className="homepage caret-transparent grid auto-rows-auto gap-y-16 relative">
      {/* Intro SoundVault */}
      <div className="homepage__container flex justify-between items-center text-white">
        {/* Intro text */}
        <div className="homepage__text flex-[0.75] self-center">
          <h2 className="font-lilitaone heading-stroke-logo text-7xl ">SoundVault</h2>
          <h3 className="font-italianno text-7xl">Digital Music for fans</h3>
          <p className="text-xl">
            SoundVault is a digital music service that gives users access to
            millions of songs. Artists can ultilize this platform as a
            marketplace to sell their albums and merchandises.
          </p>
        </div>
        {/* Intro image */}
        <img className="homepage__img  w-[450px]" src={homeintroImage} alt="" />
      </div>
      <div className="chart-intro flex justify-between font-kodchasan text-white">
        <ChartIntroContainer />
        {/* Intro chart text */}
        <div className="flex-[0.75] content-center">
          <h2 className="font-italianno text-7xl heading-stroke">SoundVault Charts</h2>
          <p className="text-xl">
            SoundVault Chart is a dynamic music ranking chart based
            on the number of listeners. It tracks the most popular
            songs across various genres, reflecting real-time
            listening habits and trends.
          </p>
          <Link
            className="button group flex items-center relative w-max px-5 py-[10px] mt-5 border-[2px] rounded-full"
            to="chart">
            Explore SoundVault Chart
            <i className="button__icon ri-arrow-right-s-line text-2xl leading-none"></i>
            <div className="button__bg absolute top-0 left-0 w-full h-full z-[-1] bg-gradient-to-r from-[#06DBAC] to-[#BD00FF]
                            rounded-full opacity-0 group-hover:opacity-100 transition duration-500 ease-in-out"></div>
          </Link>
        </div>
      </div>

      <MediaContainer />
    </div >
  );
}

export default HomePage;
