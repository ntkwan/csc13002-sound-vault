import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import {
    useSendReportOnSongMutation,
    useSendReportOnProfileMutation,
} from '@services/api';
import { toast } from 'react-toastify';

ReportFrame.propTypes = {
    setShowReportFrame: PropTypes.func.isRequired,
    cardSongId: PropTypes.string,
};

function ReportFrame({ setShowReportFrame, cardSongId }) {
    const { profileId, songId } = useParams();

    const type = cardSongId ? 'song' : profileId ? 'profile' : 'song';
    const path = cardSongId
        ? `${window.location.origin}/song/${cardSongId}`
        : profileId
          ? `${window.location.origin}/profile/${profileId}`
          : `${window.location.origin}/song/${songId}`;

    const [sendReportOnSong] = useSendReportOnSongMutation();
    const [sendReportOnProfile] = useSendReportOnProfileMutation();

    // Handler for form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const content = {
            fullName: formData.get('fullName'),
            phoneNumber: formData.get('phoneNumber'),
            email: formData.get('email'),
            idNumber: formData.get('idNumber'),
            rpType: formData.get('ReportType'),
            rpCategory: formData.get('Category'),
            reason: formData.get('reason'),
        };
        try {
            if (type === 'song') {
                await sendReportOnSong({
                    songId: cardSongId || songId,
                    ...content,
                });
            } else {
                await sendReportOnProfile({ profileId, ...content });
            }
            toast.success('Report sent successfully');
            setShowReportFrame(false);
        } catch (error) {
            toast.error('Error sending report');
            console.error('Error sending report:', error);
        }
    };

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
                <form onSubmit={handleSubmit} className="space-y-5">
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
                                name="fullName"
                                type="text"
                                className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                                required
                            />
                        </div>
                        <div className="m-5 flex w-[300px] flex-col">
                            <label
                                htmlFor="ID"
                                className="py-2 text-left text-xl"
                            >
                                ID Card/Passport number
                            </label>
                            <input
                                id="ID"
                                name="idNumber"
                                type="text"
                                className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                                required
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
                                name="email"
                                type="email"
                                className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                                required
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
                                name="phoneNumber"
                                type="tel"
                                className="input border-b bg-transparent focus:border-slate-500 focus-visible:outline-none"
                                pattern="[0-9]{10,11}"
                                title="Phone number must be 10 or 11 digits, consisting only of numbers."
                                required
                            />
                        </div>
                    </div>
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="LinkToOffendingContent"
                            className="py-2 text-left text-xl italic"
                        >
                            Link to offending content
                        </label>
                        <p className="cursor-default border p-2 text-left">
                            {path}
                        </p>
                    </div>
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="ReportType"
                            className="py-2 text-left text-xl italic"
                        >
                            Report type
                        </label>
                        <select
                            id="ReportType"
                            name="ReportType"
                            className="w-full border-b bg-black p-2 py-2 text-white hover:cursor-pointer focus:border-slate-500 focus:ring-0"
                        >
                            <option value="Trademark infringement">
                                Trademark infringement
                            </option>
                            <option value="Copyright infringement">
                                Copyright infringement
                            </option>
                            <option value="Sensitive content">
                                Sensitive content
                            </option>
                            <option value="Violence content">
                                Violence content
                            </option>
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
                            name="Category"
                            className="w-full border-b bg-black p-2 py-2 text-white hover:cursor-pointer focus:border-slate-500 focus:ring-0"
                        >
                            {type === 'song' && (
                                <>
                                    <option value="Track image">
                                        Track image
                                    </option>
                                    <option value="Track audio">
                                        Track audio
                                    </option>
                                    <option value="Track title">
                                        Track title
                                    </option>
                                    <option value="Track lyrics">
                                        Track lyrics
                                    </option>
                                </>
                            )}
                            {type === 'profile' && (
                                <>
                                    <option value="Profile photo">
                                        Profile photo
                                    </option>
                                    <option value="Profile banner">
                                        Profile banner
                                    </option>
                                    <option value="Profile fraud">
                                        Profile fraud
                                    </option>
                                    <option value="Profile username">
                                        Profile username
                                    </option>
                                </>
                            )}
                        </select>
                    </div>
                    <div className="m-5 flex flex-col">
                        <label
                            htmlFor="reason"
                            className="py-2 text-left text-xl italic"
                        >
                            Why are you reporting this content?
                        </label>
                        <textarea
                            id="reason"
                            name="reason"
                            className="h-20 w-full overflow-auto rounded-md border-2 bg-transparent p-2 text-white focus:border-slate-500 focus-visible:outline-none"
                            required
                        ></textarea>
                    </div>
                    <div className="m-5 flex">
                        <div className="w-[300px] text-left text-sm">
                            <p>
                                * Please provide at least the following
                                documents:
                            </p>
                            <ul className="list-disc pl-5">
                                <li>
                                    Documents proving the rights of the reporter
                                </li>
                                <li>
                                    Documents proving that the reported content
                                    is copyright infringement content
                                </li>
                                <li>
                                    Authorization document in case the reporter
                                    is the authorized person from the rights
                                    holder
                                </li>
                            </ul>
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
                    <div className="mx-auto w-[200px] cursor-default rounded-3xl border p-3 duration-200 ease-in-out hover:scale-105 hover:bg-gray-700 hover:text-white">
                        <button
                            type="submit"
                            className="w-full text-lg font-semibold"
                        >
                            Submit Report
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ReportFrame;
