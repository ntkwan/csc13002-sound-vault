import { useState, useRef } from 'react';

function Musicbar() {
    const [isSolidHeart, setIsSolidHeart] = useState(false);
    const [isSolidBookmark, setIsSolidBookmark] = useState(false);

    const handleHeartClick = () => { setIsSolidHeart(!isSolidHeart); };
    const handleBookmarkClick = () => { setIsSolidBookmark(!isSolidBookmark); };
    return (
        <div className="flex justify-between items-center fixed left-[0px] right-[0px] bottom-0 z-10 content-center 
                        px-5 h-[70px] mt-10 backdrop-blur-lg bg-musicbar bg-opacity-10
                        before:contents-[''] before:absolute before:top-0 before:left-5 before:right-5 before:h-px before:bg-[#535353]" >
            {/* background */}

            {/* left */}
            <div className="flex-[1] flex items-center w-max space-x-4">
                <img className="w-12 h-12" src="" alt="" />
                <div className="flex flex-col">
                    <span className="">Đánh đổi</span>
                    <span className="text-[#808080]">obito</span>
                </div>
                {/* heart-icon */}
                {(() => {
                    return (
                        <div onClick={handleHeartClick} className="cursor-pointer">
                            {isSolidHeart ? (
                                <i className="ri-heart-fill text-2xl text-white"></i>
                            ) : (
                                <i className="ri-heart-line fa-heart text-2xl text-[#808080]"></i>
                            )}
                        </div>
                    );
                })()}
            </div>
            {/* between */}
            <div className="flex-[2] flex flex-col justify-between items-center">
                {/* top */}
                <div className="flex justify-evenly items-center w-2/6 mt-1 text-xl [&_:is(i)]:p-1">
                    <i className="ri-shuffle-fill"></i>
                    <i className="ri-skip-back-fill"></i>
                    <div className="flex justify-center items-center w-8 h-8 rounded-[100%] bg-white">
                        <i className="ri-play-fill text-2xl ml-[2px] text-black"></i>
                    </div>
                    <i className="ri-skip-forward-fill"></i>
                    <i className="ri-repeat-line"></i>
                </div>
                {/* bottom */}
                <div className="flex justify-center items-center w-full h-min">
                    <span className="text-xs">00:00</span>
                    <div className="w-8/12 h-1 mx-4 rounded-full bg-gray-600"></div>
                    <span className="text-xs">00:00</span>
                </div>
            </div>
            {/* right */}
            <div className="flex-[1] flex justify-end items-center space-x-3 text-xl [&_:is(i)]:p-1">
                {(() => {

                    return (
                        <div onClick={handleBookmarkClick} className="cursor-pointer">
                            {isSolidBookmark ?
                                (<i className="ri-bookmark-fill"></i>)
                                :
                                (<i className="ri-bookmark-line"></i>)
                            }
                        </div>
                    );
                })()}
                <i className="ri-play-list-2-fill"></i>
                <i className="ri-music-2-fill"></i>
                <VolumeControl />
                <i className="ri-expand-diagonal-line"></i>
                <i className="ri-more-fill"></i>
            </div>
        </div>
    )
}

export default Musicbar;

const VolumeControl = () => {
    const [volume, setVolume] = useState(40);
    const [isDragging, setIsDragging] = useState(false);
    const volumeRef = useRef(null);

    const handleVolumeChange = (event) => {
        if (isDragging) {
            const rect = volumeRef.current.getBoundingClientRect();
            const offsetX = event.clientX - rect.left;
            const width = rect.width;
            let newVolume = Math.ceil((offsetX * 100 / width));
            newVolume = Math.min(100, Math.max(0, newVolume)); // Đảm bảo âm lượng trong khoảng từ 0 đến 100
            setVolume(newVolume);
        }
    };

    const handleMouseDown = () => { setIsDragging(true); };
    const handleMouseUp = () => { setIsDragging(false); };

    const handleIconClick = (newVolume) => {
        if (newVolume === 0) {
            setVolume(0);
        } else if (newVolume <= 40) {
            setVolume(30);
        } else {
            setVolume(100);
        }
    };

    return (
        <div className="flex items-center w-3/12">
            <i className={volume === 0 ? "ri-volume-mute-fill" : volume <= 40 ? "ri-volume-down-fill" : "ri-volume-up-fill"} onClick={() => handleIconClick(volume)}></i>
            <div className="relative w-full h-[5px] rounded-full bg-gray-600 cursor-pointer"
                ref={volumeRef} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleVolumeChange} >
                {volume > 1 && <div className="absolute left-0 top-0 right-0 h-full rounded-full bg-white" style={{ width: `${volume + 1}%` }}></div>}
            </div>
        </div >
    );
};