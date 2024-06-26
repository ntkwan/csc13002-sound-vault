import { MediaDisplay } from "@components";
import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import verifiedIcon from "@assets/img/verified-icon.svg";

import { useSelector, useDispatch } from "react-redux";
import { selectUserProfile, toggleFollow } from "@features/profilepage/slices";

const AVATAR_URL = "src/assets/img/artist/";
const COVER_URL = "src/assets/img/artist/";

function ProfilePage() {
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
      document.body.style.overflowY = 'auto'; // Đảm bảo cuộn trang được bật lại khi component bị unmount
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible]);
  const toggleMenu = (index) => {
    setMenuVisible(menuVisible === index ? null : index);
  };

  const isFollowing = false;
  const isMyProfile = true;
  const userProfile = useSelector(selectUserProfile);
  const { fullName, isVerified, followers, avatar, cover, popular, mediaData } = userProfile
  const dispatch = useDispatch();

  return (
    <div className="profile-page caret-transparent grid auto-rows-auto gap-y-10 pt-1">
      {/* Profile Header */}
      <div className="profile-page__header relative h-80">
        <img className="header__cover max-w-full h-80" src={`${COVER_URL}${cover}`} alt="" />
        <div className="absolute flex top-1/4 left-10">
          <div className="relative">
            <img className="w-40 h-40 rounded-full shadow-2xl" src={`${AVATAR_URL}${avatar}`} alt="" />
            {isVerified && <img className="absolute bottom-[6px] right-[6px] w-8 h-8 mr-1" src={verifiedIcon} alt="" />}
          </div>
          <div className="relative content-center ml-5">
            <div className="font-alfaslabone text-7xl drop-shadow-2xl">{fullName}</div>
            <p className="absolute">{followers.toLocaleString()} followers</p>
          </div>
        </div>
      </div>

      {/* Actions Section */}
      <div className="flex space-x-6">
        <button className="w-[70px] h-[70px] rounded-full content-center bg-gradient-to-b from-[#D0A7D8] to-[#5E44FF]">
          <i class="ri-play-fill text-[42px]"></i>
        </button>
        {isMyProfile ? (
          <>
            <Button>upload music</Button>
            <Button to="editing">edit profile</Button>
            <Button>donation</Button>
          </>
        ) : (
          <>
            <Button onClick={() => dispatch(toggleFollow())}>
              {isFollowing ? 'unfollow' : 'follow'}
            </Button>
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

// Button.propTypes = {
//   onClick: PropTypes.func,
//   children: PropTypes.node,
// };

function Button({ to, onClick, children }) {
  return (
    <Link
      to={to}
      className="button group relative w-[200px] py-3 m-auto text-nowrap text-xs text-center uppercase rounded-xl border-[2px] border-white"
      onClick={onClick}>
      {children}
      <div className="button__bg absolute top-0 left-0 w-full h-full z-[-1] rounded-lg opacity-0 
            bg-gradient-to-r from-[#06DBAC] to-[#BD00FF] group-hover:opacity-100 transition duration-500 ease-in-out">
      </div>
    </Link>
  );
}
