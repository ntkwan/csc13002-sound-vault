import "@assets/themify-icons/themify-icons.css";
import DefaultLayout from "@components/layout/Default/DefaultLayout";
import introImage from "../assets/img/design/intro-img.svg";
import ChartIntroContainer from "@components/layout/ChartIntroContainer";
import MediaContainer from "@components/layout/MediaContainer";

function HomePage() {
  return (
    <div className="homepage caret-transparent grid auto-rows-auto gap-y-16 relative">
      {/* Intro SoundVault */}
      <div className="flex justify-between items-center text-white">
        {/* Intro text */}
        <div className="flex-[0.85] self-center">
          <h2 className="font-lilitaOne text-7xl ">SoundVault</h2>
          <h3 className="font-italianno text-7xl">Digital Music for fans.</h3>
          <p className="text-xl">
            SoundVault is a digital music service that gives users access to
            millions of songs. Artists can ultilize this platform as a
            marketplace to sell their albums and merchandises.
          </p>
        </div>
        {/* Intro image */}
        <img className="self-end max-w-[500px]" src={introImage} alt="" />
      </div>
      <ChartIntroContainer />
      <MediaContainer />
    </div>
  );
}

export default HomePage;
