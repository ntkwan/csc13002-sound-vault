import PropTypes from 'prop-types';

ReportFrame.propTypes = {
    setShowReportFrame: PropTypes.func,
};

function ReportFrame({ setShowReportFrame }) {
    return (
        <div className="fixed left-0 top-0 z-10 h-full w-full content-center bg-gray-800 bg-opacity-50">
            <div className="scrollbar-custom relative z-20 m-auto h-[70%] w-[750px] overflow-auto rounded-3xl border bg-black px-10 py-5 text-center font-kodchasan shadow-lg">
                <div
                    className="fixed right-[calc(50%-365px)] top-[calc(50%-(70%/2)+9px)] hover:text-[#999]"
                    onClick={() => setShowReportFrame(false)}
                >
                    <i className="ri-close-fill text-3xl"></i>
                </div>
                <h3 className="p-5 text-3xl font-semibold">
                    Report illegal content
                </h3>
                <div className="flex italic">
                    <div className="m-5 flex w-[300px] flex-col">
                        <label
                            htmlFor="fullName"
                            className="py-2 text-left text-xl"
                        >
                            Full name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                    <div className="m-5 flex w-[300px] flex-col">
                        <label htmlFor="ID" className="py-2 text-left text-xl">
                            ID Card/Passport number
                        </label>
                        <input
                            id="ID"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                </div>
                <div className="flex italic">
                    <div className="m-5 flex w-[300px] flex-col">
                        <label
                            htmlFor="Email"
                            className="py-2 text-left text-xl"
                        >
                            Email
                        </label>
                        <input
                            id="Email"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                    <div className="m-5 flex w-[300px] flex-col">
                        <label
                            htmlFor="phoneNumber"
                            className="py-2 text-left text-xl"
                        >
                            Phone number
                        </label>
                        <input
                            id="phoneNumber"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                </div>
                <div>
                    {/* 
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="LinkToOffendingContent"
                            className="py-2 text-left text-xl italic"
                        >
                            Link to violated content
                        </label>
                        <input
                            id="LinkToOffendingContent"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                    */}
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="ReportType"
                            className="py-2 text-left text-xl italic"
                        >
                            Report type
                        </label>
                        <select
                            id="ReportType"
                            className="w-full border-b p-2 py-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-black dark:text-white"
                        >
                            <option value="brand_infringement">Trademark infringement</option>
                            <option value="copyright_infringement">
                                Copyright infringement
                            </option>
                            <option value="18_plus">Sensitive content</option>
                            <option value="violence">Violence content</option>
                        </select>
                    </div>

                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="Category"
                            className="py-2 text-left text-xl italic"
                        >
                            Category
                        </label>
                        <select
                            id="Category"
                            className="w-full border-b p-2 py-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-black dark:text-white"
                        >
                            <option value="music">Music</option>
                            <option value="album_artwork">Album artwork</option>
                            <option value="user_image">User image</option>
                            <option value="playlist_image">
                                Playlist image
                            </option>
                            <option value="playlist_title">
                                Playlist title
                            </option>
                            <option value="artist_ava">Artist profile image</option>
                            <option value="artist_banner">
                                Artist banner image
                            </option>
                        </select>
                    </div>
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="Describle"
                            className="py-2 text-left text-xl italic"
                        >
                            Why are you reporting this content?                        </label>
                        <textarea
                            id="LinkToOffendingContent"
                            className="h-20 w-full overflow-auto rounded-md border-2 bg-transparent p-2 text-white focus:border-slate-500 focus-visible:outline-none"
                        ></textarea>
                    </div>

                    <div className="m-5 flex">
                        <div className="w-[300px] text-left text-sm">
                            <p>
                                * Please provide at least the following
                                documents:
                            </p>
                            <p>
                                - Documents proving the rights of the reporter
                            </p>
                            <p>
                                - Documents proving that the reported content is
                                copyright infringement content
                            </p>
                            <p>
                                - Authorization document in case the reporter is
                                the authorized person from the rights holder
                            </p>
                        </div>
                        <div className="m-auto ease-in-out hover:scale-105">
                            <div className="relative mx-auto w-[200px] rounded-xl border p-3">
                                Attach Documents
                                <input
                                    id="documentUpload"
                                    type="file"
                                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto w-[200px] cursor-default rounded-3xl border p-3 duration-200 ease-in-out hover:scale-105 hover:bg-gray-900">
                        Send
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportFrame;
