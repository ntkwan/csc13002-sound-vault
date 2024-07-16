import PropTypes from 'prop-types';

ReportFrame.propTypes = {
    setShowReportFrame: PropTypes.func,
};

function ReportFrame({ setShowReportFrame }) {
    return (
        <div className="fixed left-0 top-0 z-10 h-full w-full content-center bg-gray-800 bg-opacity-50">
            <div className="scrollbar-custom relative z-20 m-auto h-[70%] w-[750px] overflow-auto rounded-3xl border bg-black px-10 py-5 text-center font-kodchasan shadow-lg">
                <div
                    className="absolute right-3 top-3 hover:text-[#999]"
                    onClick={() => setShowReportFrame(false)}
                >
                    <i className="ri-close-fill text-4xl"></i>
                </div>
                <h3 className="p-5 text-3xl font-semibold">
                    Report copyright infringement
                </h3>
                <div className="flex italic">
                    <div className="m-5 flex w-[300px] flex-col">
                        <label
                            htmlFor="fullName"
                            className="py-2 text-left text-xl"
                        >
                            Full Name
                        </label>
                        <input
                            id="fullName"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                    <div className="m-5 flex w-[300px] flex-col">
                        <label htmlFor="ID" className="py-2 text-left text-xl">
                            ID Card/ Passport number
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
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="LinkToOffendingContent"
                            className="py-2 text-left text-xl italic"
                        >
                            Link to offending content
                        </label>
                        <input
                            id="LinkToOffendingContent"
                            type="text"
                            className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                        />
                    </div>
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="Describle"
                            className="py-2 text-left text-xl italic"
                        >
                            Describe
                        </label>
                        <select
                            id="Describle"
                            className="w-full border py-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-black dark:text-white"
                        >
                            <option value="inappropriate_lyrics">
                                Inappropriate Lyrics
                            </option>
                            <option value="copyright_infringement">
                                Copyright Infringement
                            </option>
                            <option value="spam">Spam</option>
                            <option value="hate_speech">Hate Speech</option>
                            <option value="violence">Violence</option>
                            <option value="misleading">
                                Misleading Information
                            </option>
                        </select>
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
                                Attack Documents
                                <input
                                    id="documentUpload"
                                    type="file"
                                    className="absolute left-0 top-0 h-full w-full cursor-pointer opacity-0"
                                    accept=".pdf,.doc,.docx,.txt"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="mx-auto w-[200px] rounded-3xl border p-3 duration-200 ease-in-out hover:scale-105 hover:bg-gray-900">
                        Send
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReportFrame;
