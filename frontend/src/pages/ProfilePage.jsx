import { MediaDisplay } from "@components";
import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import verifiedIcon from "@assets/img/verified-icon.svg";

function ProfilePage() {
  const userProfile = {
    isMyProfile: true,
    name: "Sơn Tùng MTP",
    isVerified: true,
    followers: 9875425,
    popular: [
      { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
      { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
      { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
      { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
      { name: "Chúng Ta Của Tương Lai", view: 4564561, duration: "03:17" },
    ],
    mediaData: [
      {
        type: "song",
        header: "Popular Releases",
        visibility: "",
        link: "",
        data: [
          { name: "Chúng Ta Của Tương Lai", desc: "2023" },
          { name: "Chúng Ta Của Tương Lai", desc: "2023" },
          { name: "Chúng Ta Của Tương Lai", desc: "2023" },
        ],
      },
      {
        type: "song",
        header: "Albums",
        visibility: "",
        link: "",
        data: [
          { name: "Chúng Ta Của Tương Lai", desc: "2023" },
          { name: "Chúng Ta Của Tương Lai", desc: "2023" },
          { name: "Chúng Ta Của Tương Lai", desc: "2023" },
        ],
      },
      {
        type: "artist",
        header: "Following",
        visibility: "(only me)",
        link: "",
        data: [
          { name: "Sơn Tùng MTP", desc: "Artist" },
          { name: "Sơn Tùng MTP", desc: "Artist" },
          { name: "Sơn Tùng MTP", desc: "Artist" },
        ],
      },
      {
        type: "song",
        header: "My Playlist",
        visibility: "(only me)",
        link: "library",
        data: [
          { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
          { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
          { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
          { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
          { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
          { name: "Chúng Ta Của Tương Lai", desc: "playlist" },
        ],
      },
    ],
  };

  const { isMyProfile, name, isVerified, followers, popular, mediaData } =
    userProfile;

  const [isFollowing, setIsFollowing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(null);
  const menuRef = useRef(null);
  function handleClickOutside(event) {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuVisible(null);
    }
  }
  useEffect(() => {
    if (menuVisible !== null) {
      document.body.style.overflowY = "hidden"; // Chỉ cấm cuộn theo trục y
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflowY = "auto"; // Cho phép cuộn theo trục y khi menu đóng
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.body.style.overflowY = "auto"; // Đảm bảo cuộn trang được bật lại khi component bị unmount
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuVisible]);
  const toggleMenu = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  return (
    <div className="profile-page grid auto-rows-auto gap-y-10 pt-1 caret-transparent">
      {/* Profile Header */}
      <div className="profile-page__header relative h-80">
        <img
          className="header__bg h-80 max-w-full"
          src={`src/assets/img/artist/${name}-bg.jpg`}
          alt=""
        />
        <div className="absolute left-10 top-1/4 flex">
          <div className="relative">
            <img
              className="h-40 w-40 rounded-full shadow-2xl"
              src={`src/assets/img/artist/${name}.jpg`}
              alt=""
            />
            {isVerified && (
              <img
                className="absolute bottom-[6px] right-[6px] mr-1 h-8 w-8"
                src={verifiedIcon}
                alt=""
              />
            )}
          </div>
          <div className="relative ml-5 content-center">
            <div className="font-alfaslabone text-7xl drop-shadow-2xl">
              {name}
            </div>
            <p className="absolute">{followers.toLocaleString()} followers</p>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex space-x-6">
        <button className="h-[70px] w-[70px] content-center rounded-full bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF]">
          <i className="ri-play-fill text-[42px]"></i>
        </button>
        {isMyProfile ? (
          <>
            <Button>upload music</Button>
            <Button>edit profile</Button>
            <Button>donation</Button>
          </>
        ) : (
          <>
            {(() => {
              const handleClick = () => {
                setIsFollowing(!isFollowing);
              };
              const content = isFollowing ? "unfollow" : "follow";
              return <Button onClick={handleClick}>{content}</Button>;
            })()}
            <Button>donate</Button>
          </>
        )}
      </div>

      {/* Content Section */}
      <div className="slider grid grid-rows-[min-content_auto]">
        <div className="space-x-3">
          <h2 className="inline text-3xl font-bold">Popular</h2>
        </div>
        <div className="slider__media mt-4 grid gap-y-3">
          {popular.map((media, index) => {
            const { name, view, duration } = media;
            return (
              <div
                key={index}
                className="flex w-full items-center justify-between px-8"
              >
                <div className="flex items-center space-x-8">
                  <span className="w-2">{index + 1}</span>
                  <img
                    className="h-14 w-14"
                    src={`src/assets/img/song/${name}.jpg`}
                    alt={name}
                  />
                  <span>{name}</span>
                </div>
                <span>{view}</span>
                <span>{duration}</span>
                <div className="relative" ref={menuRef}>
                  <i
                    className="ti-more-alt cursor-pointer"
                    onClick={() => toggleMenu(index)}
                  ></i>
                  {menuVisible === index && (
                    <div className="absolute right-0 z-[2] mt-2 h-max w-40 rounded-xl border-[2px] border-[#999] bg-[#222] text-sm shadow-md">
                      <ul>
                        <li className="cursor-pointer space-x-2 rounded-t-xl border-b border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                          <i className="ti-share"></i> <span>Share</span>
                        </li>
                        <li className="cursor-pointer space-x-2 rounded-b-xl border-t border-[#999] px-4 py-2 transition-colors duration-300 ease-in-out hover:bg-[#443f3fb9]">
                          <i className="ti-flag"></i> <span>Report</span>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {mediaData.map((media, index) => {
        if (media.visibility === "(only me)" && !isMyProfile) return null;
        return (
          <MediaDisplay
            key={index}
            media={media}
            displayItems="2"
            displayType="grid grid-cols-6"
          />
        );
      })}
    </div>
  );
}

export default ProfilePage;

Button.propTypes = {
  onClick: PropTypes.func,
  children: PropTypes.node,
};

function Button({ onClick, children }) {
  return (
    <button
      className="button group relative m-auto w-[200px] text-nowrap rounded-xl border-[2px] border-white py-3 text-xs uppercase"
      onClick={onClick}
    >
      {children}
      <div className="button__bg absolute left-0 top-0 z-[-1] h-full w-full rounded-lg bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] opacity-0 transition duration-500 ease-in-out group-hover:opacity-100"></div>
    </button>
  );
}
