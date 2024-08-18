import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentProfile } from '@services/selectors';
import { useReplyReportMutation, useRejectReportMutation } from '@services/api';
import { toast } from 'react-toastify';

ReviewReportFrame.propTypes = {
    item: PropTypes.shape({
        idReport: PropTypes.string,
        contentLink: PropTypes.string,
        date: PropTypes.string,
        time: PropTypes.string,
        isSong: PropTypes.bool,
        reason: PropTypes.string,
        category: PropTypes.string,
        type: PropTypes.string,
        status: PropTypes.bool,
        assignee: PropTypes.string,
        idUser: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        idNumber: PropTypes.string,
        phone: PropTypes.string,
    }),
    onClose: PropTypes.func,
};

function ReviewReportFrame({ item, onClose }) {
    const [isReplying, setIsReplying] = useState(false);
    const [message, setMessage] = useState('');
    const [replyReport, { isLoading: isLoadingReply }] =
        useReplyReportMutation();
    const handleSendClick = async () => {
        if (isLoadingReply) return;
        try {
            toast.success('Reply sent successfully');
            onClose();
            await replyReport({ reportID: item.idReport, message }).unwrap();
        } catch (error) {
            toast.error('Failed to send reply');
        }
    };
    const [rejectReport, { isLoading: isLoadingReject }] =
        useRejectReportMutation();
    const handleRejectClick = async () => {
        if (isLoadingReject) return;

        try {
            toast.success('Report rejected successfully');
            onClose();
            await rejectReport(item.idReport).unwrap();
        } catch (error) {
            toast.error('Failed to reject report');
        }
    };
    const handleReplyClick = () => {
        setIsReplying(true);
    };

    const profile = useSelector(selectCurrentProfile);
    const { name, image: { url: avatar } = {} } = profile || {};

    return (
        <div className="fixed left-0 top-0 z-10 h-full w-full cursor-default content-center bg-gray-800 bg-opacity-50">
            <div className="scrollbar-custom relative z-20 m-auto h-[84%] w-[900px] overflow-auto rounded-3xl border bg-home-pattern px-10 py-5 font-kodchasan shadow-lg">
                <button
                    className="fixed right-[calc(50%-450px+15px)] top-[calc(5vh+28px)] hover:text-[#999]"
                    onClick={onClose}
                >
                    <i className="ri-close-fill text-3xl"></i>
                </button>
                <h2 className="relative border-b p-3 text-2xl font-medium">
                    Report from &rsquo;{item.name}&rsquo; about &rsquo;
                    {item.type}&rsquo;
                    <i className="bx bx-label absolute top-5 px-2" />
                </h2>

                <div className="m-2 flex justify-between p-2">
                    <div className="flex">
                        <div className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] px-1">
                            <i className="ri-user-3-fill text-xl" />
                        </div>
                        <p className="px-1 py-[2px] font-medium">{item.name}</p>
                        <p className="py-[2px] font-normal">
                            &lt;{item.email}&gt;
                        </p>
                    </div>
                    <div className="font-thin">
                        {item.date} {item.time}
                    </div>
                </div>

                <div className="scrollbar-custom relative z-20 mx-auto my-10 w-[680px] rounded-3xl border-2 px-10 py-5 text-center font-kodchasan shadow-lg">
                    <h3 className="p-5 text-3xl font-semibold">
                        Report copyright infringement
                    </h3>
                    <div className="flex italic">
                        <div className="m-5 flex w-[300px] flex-col">
                            <label htmlFor="fullName" className="py-2 text-lg">
                                Full Name
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.name}
                            </div>
                        </div>
                        <div className="m-5 flex w-[300px] flex-col">
                            <label htmlFor="ID" className="py-2 text-lg">
                                ID Card/ Passport number
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.idNumber}
                            </div>
                        </div>
                    </div>
                    <div className="flex italic">
                        <div className="m-5 flex w-[300px] flex-col">
                            <label htmlFor="Email" className="py-2 text-xl">
                                Email
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.email}
                            </div>
                        </div>
                        <div className="m-5 flex w-[300px] flex-col">
                            <label
                                htmlFor="phoneNumber"
                                className="py-2 text-xl"
                            >
                                Phone number
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.phone}
                            </div>
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
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.contentLink}
                            </div>
                        </div>
                        <div className="m-5 flex flex-col">
                            <label
                                htmlFor="ReportType"
                                className="py-2 text-left text-xl italic"
                            >
                                Report type
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.type}
                            </div>
                        </div>

                        <div className="m-5 flex flex-col">
                            <label
                                htmlFor="Category"
                                className="py-2 text-left text-xl italic"
                            >
                                Category
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.category}
                            </div>
                        </div>
                        <div className="m-5 flex flex-col">
                            <label
                                htmlFor="Describle"
                                className="py-2 text-left text-xl italic"
                            >
                                Describle
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-2 text-left">
                                {item.reason}
                            </div>
                        </div>

                        <div className="m-5 ease-in-out hover:scale-105">
                            <div className="relative w-[200px] rounded-xl border p-3">
                                Attach Documents
                            </div>
                        </div>
                    </div>
                </div>
                {isReplying && (
                    <div className="m-3 border-y py-10">
                        <div className="m-2 flex justify-between p-2">
                            <div className="flex items-center">
                                {avatar ? (
                                    <img
                                        className="inline h-10 w-10 rounded-full object-cover"
                                        src={avatar}
                                        alt={name}
                                    />
                                ) : (
                                    <i className="bx bxs-user-circle aspect-square w-10 text-5xl leading-none"></i>
                                )}
                                <div>
                                    <p className="px-1 py-[2px] font-medium">
                                        {name}
                                    </p>
                                    <p className="text-[#B3B3B3]">Admin</p>
                                </div>
                            </div>
                        </div>
                        <textarea
                            id="LinkToOffendingContent"
                            className="h-28 w-full overflow-auto rounded-3xl border bg-transparent p-2 text-white focus:border-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-50"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>
                )}
                {item.assignee != '' ? (
                    <div className="m-3 flex justify-end">
                        <div className="mx-3 rounded-lg border-2 px-3 py-2">
                            This report has been processed by {name}.
                        </div>
                    </div>
                ) : (
                    <div className="m-3 flex justify-end">
                        <button
                            className="mx-3 w-28 rounded-lg border-2 px-3 py-2"
                            onClick={handleRejectClick}
                        >
                            <i className="ri-mail-close-line pr-2" />
                            Reject
                        </button>
                        {!isReplying ? (
                            <button
                                className="w-28 rounded-lg border-2 px-3 py-2"
                                onClick={handleReplyClick}
                            >
                                <i className="ri-reply-fill pr-2" />
                                Reply
                            </button>
                        ) : (
                            <button
                                className="w-28 rounded-lg border-2 px-3 py-2"
                                onClick={handleSendClick}
                            >
                                <i className="bx bx-send pr-2" />
                                Send
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ReviewReportFrame;
