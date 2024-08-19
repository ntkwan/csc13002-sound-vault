import { useState } from 'react';
import { PageTitle } from '@components/index';

function UserSettingPage() {
    const [followerOn, setFollowerOn] = useState(false);
    const [followingOn, setFollowingOn] = useState(false);
    const [recentlyPlaylistOn, setRecentlyPlaylistOn] = useState(false);

    const handleToggle = (setter) => () => {
        setter((prevState) => !prevState);
    };

    return (
        <>
            <div className="select-none pl-10 pt-6 font-kodchasan">
                <PageTitle title="Setting" className="text-[180px]" />
                <div className="mx-auto flex justify-center">
                    <div className="privacybox m-5 divide-solid rounded-[40px] bg-[#D9D9D9] bg-opacity-10 px-7 py-10">
                        <div className="flex justify-center">
                            <h2 className="border-b px-3 pb-2 text-3xl font-semibold">
                                Privacy & Social
                            </h2>
                        </div>

                        <div className="followerOption flex items-center justify-between">
                            <div className="flex flex-col justify-center pb-6 pt-3">
                                <p className="text-2xl font-normal text-slate-200">
                                    Follower
                                </p>
                                <p className="mt-1 text-lg font-thin text-slate-200">
                                    Show your follower list on your profile
                                </p>
                            </div>
                            <label className="relative ml-3 inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={followerOn}
                                    onChange={handleToggle(setFollowerOn)}
                                    className="sr-only"
                                />
                                <div
                                    className={`h-3 w-10 rounded-full shadow-inner ${followerOn ? 'bg-[#20E100] bg-opacity-65' : 'bg-gray-300'}`}
                                ></div>
                                <div
                                    className={`absolute inset-y-0 left-[-4px] top-[-6px] h-6 w-6 rounded-full shadow transition-transform duration-200 ${followerOn ? 'translate-x-7 bg-[#20E100]' : 'translate-x-0 bg-white'}`}
                                ></div>
                            </label>
                        </div>

                        <div className="followingOption flex items-center justify-between pb-6">
                            <div>
                                <p className="text-2xl font-normal text-slate-200">
                                    Following
                                </p>
                                <p className="text-lg font-thin text-slate-200">
                                    Show your following list on your profile
                                </p>
                            </div>
                            <label className="relative ml-3 inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={followingOn}
                                    onChange={handleToggle(setFollowingOn)}
                                    className="sr-only"
                                />
                                <div
                                    className={`h-3 w-10 rounded-full shadow-inner ${followingOn ? 'bg-[#20E100] bg-opacity-65' : 'bg-gray-300'}`}
                                ></div>
                                <div
                                    className={`absolute inset-y-0 left-[-4px] top-[-6px] h-6 w-6 rounded-full shadow transition-transform duration-200 ${followingOn ? 'translate-x-7 bg-[#20E100]' : 'translate-x-0 bg-white'}`}
                                ></div>
                            </label>
                        </div>

                        <div className="recentlyPlaylistOption flex items-center justify-between pb-1">
                            <div>
                                <p className="text-2xl font-normal text-slate-200">
                                    Recently played artist
                                </p>
                                <p className="w-[500px] text-lg font-thin text-slate-200">
                                    Show your recently played artists on your
                                    public profile
                                </p>
                            </div>
                            <label className="relative ml-3 inline-flex cursor-pointer items-center">
                                <input
                                    type="checkbox"
                                    checked={recentlyPlaylistOn}
                                    onChange={handleToggle(
                                        setRecentlyPlaylistOn,
                                    )}
                                    className="sr-only"
                                />
                                <div
                                    className={`h-3 w-10 rounded-full shadow-inner ${recentlyPlaylistOn ? 'bg-[#20E100] bg-opacity-65' : 'bg-gray-300'}`}
                                ></div>
                                <div
                                    className={`absolute inset-y-0 left-[-4px] top-[-6px] h-6 w-6 rounded-full shadow transition-transform duration-200 ${recentlyPlaylistOn ? 'translate-x-7 bg-[#20E100]' : 'translate-x-0 bg-white'}`}
                                ></div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default UserSettingPage;
