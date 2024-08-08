import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentProfile } from '@services/selectors';

ReviewReportFrame.propTypes = {
    item: PropTypes.shape({
        report: PropTypes.shape({
            reportid: PropTypes.string,
            username: PropTypes.string,
            idcard: PropTypes.string,
            email: PropTypes.string,
            phone: PropTypes.string,
            linktocontent: PropTypes.string,
            reporttype: PropTypes.string,
            category: PropTypes.string,
            date: PropTypes.string,
            time: PropTypes.string,
            describe: PropTypes.string,
        }),
        assignee: PropTypes.shape({
            adminid: PropTypes.string,
            adminname: PropTypes.string,
            image: PropTypes.shape({
                url: PropTypes.string,
            }),
        }),
        status: PropTypes.string,
    }),
    onClose: PropTypes.func,
};

function ReviewReportFrame({ item, onClose }) {
    const [isReplying, setIsReplying] = useState(false);

    const handleReplyClick = () => {
        setIsReplying(true);
    };

    const handleSendClick = () => {
        // Logic to send the reply goes here
        setIsReplying(false);
    };

    const profile = useSelector(selectCurrentProfile);

    const { name, image: { url: avatar } = {} } = profile || {};

    return (
        <div className="fixed left-0 top-0 z-10 h-full w-full content-center bg-gray-800 bg-opacity-50">
            <div className="scrollbar-custom relative z-20 m-auto h-[84%] w-[900px] overflow-auto rounded-3xl border bg-home-pattern px-10 py-5 font-kodchasan shadow-lg">
                <button
                    className="fixed right-[calc(50%-450px+15px)] top-[calc(5vh+28px)] hover:text-[#999]"
                    onClick={onClose}
                >
                    <i className="ri-close-fill text-3xl"></i>
                </button>
                <h2 className="relative border-b p-3 text-2xl font-medium">
                    Report from &rsquo;{item.report.username}&rsquo; about
                    &rsquo;
                    {item.report.reporttype}&rsquo;
                    <i className="bx bx-label absolute top-5 px-2" />
                </h2>

                <div className="m-2 flex justify-between p-2">
                    <div className="flex">
                        <div className="ml-auto flex h-[30px] w-[30px] items-center justify-center rounded-full border-[3px] px-1">
                            <i className="ri-user-3-fill text-xl" />
                        </div>
                        <p className="px-1 py-[2px] font-medium">
                            {item.report.username}
                        </p>
                        <p className="py-[2px] font-normal">
                            &lt;{item.report.email}&gt;
                        </p>
                    </div>
                    <div className="font-thin">
                        {item.report.date} {item.report.time}
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
                                {item.report.username}
                            </div>
                        </div>
                        <div className="m-5 flex w-[300px] flex-col">
                            <label htmlFor="ID" className="py-2 text-lg">
                                ID Card/ Passport number
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.report.idcard}
                            </div>
                        </div>
                    </div>
                    <div className="flex italic">
                        <div className="m-5 flex w-[300px] flex-col">
                            <label htmlFor="Email" className="py-2 text-xl">
                                Email
                            </label>
                            <div className="rounded-lg bg-gray-500 bg-opacity-40 p-1">
                                {item.report.email}
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
                                {item.report.phone}
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
                                {item.report.linktocontent}
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
                                {item.report.reporttype}
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
                                {item.report.category}
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
                                {item.report.describe}
                            </div>
                        </div>

                        <div className="m-5 ease-in-out hover:scale-105">
                            <div className="relative w-[200px] rounded-xl border p-3">
                                Attack Documents
                            </div>
                        </div>
                    </div>
                </div>

                <div className="m-6 flex justify-between border-b border-t">
                    <select
                        id="Status"
                        className="mx-3 my-10 w-[300px] rounded-lg border p-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-transparent dark:text-white"
                    >
                        <option
                            className="bg-[#41023f] text-white"
                            value="closed"
                        >
                            Pending
                        </option>
                        <option
                            className="bg-[#41023f] text-white"
                            value="received"
                        >
                            Received
                        </option>
                        <option
                            className="bg-[#41023f] text-white"
                            value="in_progress"
                        >
                            In Progress
                        </option>
                        <option
                            className="bg-[#41023f] text-white"
                            value="completed"
                        >
                            Completed
                        </option>
                        <option
                            className="bg-[#41023f] text-white"
                            value="rejected"
                        >
                            Rejected
                        </option>
                    </select>

                    <select
                        id="Asignee"
                        className="mx-3 my-10 w-[300px] rounded-lg border p-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-transparent dark:text-white"
                    >
                        <option className="bg-[#41023f] text-white" value="">
                            Unassigned
                        </option>
                        <option className="bg-[#41023f] text-white" value="">
                            Toàn
                        </option>
                        <option className="bg-[#41023f] text-white" value="">
                            Khang
                        </option>
                        <option className="bg-[#41023f] text-white" value="">
                            Quân
                        </option>
                        <option className="bg-[#41023f] text-white" value="">
                            Vi
                        </option>
                        <option className="bg-[#41023f] text-white" value="">
                            Hoàng
                        </option>
                    </select>
                </div>
                {isReplying && (
                    <div className="m-3">
                        <div className="m-2 flex justify-between p-2">
                            <div className="flex">
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
                            className="h-20 w-full overflow-auto rounded-md border-2 bg-white text-black focus:border-slate-500 focus-visible:outline-none"
                        ></textarea>
                    </div>
                )}
                <div className="m-3 flex justify-end">
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
            </div>
        </div>
    );
}

export default ReviewReportFrame;
