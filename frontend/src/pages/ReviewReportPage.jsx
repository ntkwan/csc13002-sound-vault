import React, { useEffect, useState } from 'react';
import {
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
    ReviewReportFrame,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { setReportList } from '@features/admindashboard/slices';
import { useDispatch, useSelector } from 'react-redux';

const sampleReports = [
    {
        report: {
            reportid: '1',
            username: 'SmokeShack Burger',
            idcard: '123456789',
            email: 'abcxyz@gmail.com',
            phone: '0123456789',
            linktocontent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            reporttype: 'violence',
            category: 'song',
            date: '23-05-2024',
            time: '12:00',
            describe:
                'For example, mt-6 would add 1.5rem of margin to the top of an element, mr-4 would add 1rem of margin to the right of an element, mb-8 would add 2rem of margin to the bottom of an element, and ml-2 would add 0.5rem of margin to the left of an element.',
        },
        assignee: {
            adminid: '1',
            adminname: 'Silva',
            image: {
                url: '',
            },
        },
        status: 'Finished',
    },
    {
        report: {
            reportid: '2',
            username: 'Waffle Fries',
            idcard: '123456789',
            email: 'abcxyz@gmail.com',
            phone: '0123456789',
            linktocontent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            reporttype: 'violence',
            category: 'artist',
            date: '21-04-2022',
            time: '9:00',
            describe:
                'For example, mt-6 would add 1.5rem of margin to the top of an element, mr-4 would add 1rem of margin to the right of an element, mb-8 would add 2rem of margin to the bottom of an element, and ml-2 would add 0.5rem of margin to the left of an element.',
        },
        assignee: {
            adminid: '2',
            adminname: 'Rice',
            image: {
                url: '',
            },
        },
        status: 'Pending',
    },
    {
        report: {
            reportid: '3',
            username: 'Chalupa Supreme',
            idcard: '123456789',
            email: 'abcxyz@gmail.com',
            phone: '0123456789',
            linktocontent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            reporttype: 'violence',
            category: 'song',
            date: '19-01-2020',
            time: '9:00',
            describe:
                'For example, mt-6 would add 1.5rem of margin to the top of an element, mr-4 would add 1rem of margin to the right of an element, mb-8 would add 2rem of margin to the bottom of an element, and ml-2 would add 0.5rem of margin to the left of an element.',
        },
        assignee: {
            adminid: '3',
            adminname: 'Saka',
            image: {
                url: '',
            },
        },
        status: 'Reject',
    },
    {
        report: {
            reportid: '4',
            username: 'Checkers Seasoned Fries',
            idcard: '123456789',
            email: 'abcxyz@gmail.com',
            phone: '0123456789',
            linktocontent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            reporttype: 'violence',
            category: 'song',
            date: '02-10-2024',
            time: '9:00',
            describe:
                'For example, mt-6 would add 1.5rem of margin to the top of an element, mr-4 would add 1rem of margin to the right of an element, mb-8 would add 2rem of margin to the bottom of an element, and ml-2 would add 0.5rem of margin to the left of an element.',
        },
        assignee: {
            adminid: '4',
            adminname: 'Bruno',
            image: {
                url: '',
            },
        },
        status: 'Pending',
    },
    {
        report: {
            reportid: '5',
            username: 'French Fries',
            idcard: '123456789',
            email: 'abcxyz@gmail.com',
            phone: '0123456789',
            linktocontent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            reporttype: 'violence',
            category: 'artist',
            date: '03-12-2019',
            time: '9:00',
            describe:
                'For example, mt-6 would add 1.5rem of margin to the top of an element, mr-4 would add 1rem of margin to the right of an element, mb-8 would add 2rem of margin to the bottom of an element, and ml-2 would add 0.5rem of margin to the left of an element.',
        },
        assignee: {
            adminid: '5',
            adminname: 'Booker',
            image: {
                url: '',
            },
        },
        status: 'Finished',
    },
    {
        report: {
            reportid: '6',
            username: 'Taquito with Cheese',
            idcard: '123456789',
            email: 'abcxyz@gmail.com',
            phone: '0123456789',
            linktocontent: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            reporttype: 'violence',
            category: 'artist',
            date: '23-04-2024',
            time: '9:00',
            describe:
                'For example, mt-6 would add 1.5rem of margin to the top of an element, mr-4 would add 1rem of margin to the right of an element, mb-8 would add 2rem of margin to the bottom of an element, and ml-2 would add 0.5rem of margin to the left of an element.',
        },
        assignee: {
            adminid: '6',
            adminname: 'Kendall',
            image: {
                url: '',
            },
        },
        status: 'Reject',
    },
];

const generateReports = (samples, counts) => {
    let reports = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            reports.push({ ...sample });
        }
    });
    return reports;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialReports = generateReports(sampleReports, counts);

function ReviewReportPage() {
    const dispatch = useDispatch();
    const reports = useSelector((state) => state.admindashboard.reportList);
    const [date, setDate] = useState('');
    const [sortOption, setSortOption] = useState('Date (newest first)');
    const [filterDate, setFilterDate] = useState('');
    const [filterSortOption, setFilterSortOption] = useState(
        'Date (newest first)',
    );
    const [tabStatus, setTabStatus] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [showFilters, setShowFilters] = useState(false);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);

    useEffect(() => {
        dispatch(setReportList(initialReports));
    }, [dispatch]);

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
    };

    const filteredReports = reports.filter((report) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd-MM-yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || report.status === tabStatus) &&
            (!filterDate ||
                isEqual(
                    parseDate1(report.report.date),
                    parseDate2(filterDate),
                )) &&
            (!searchTerm ||
                report.report.username
                    .toLowerCase()
                    .startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedReports = filteredReports.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Username') {
            return a.report.username.localeCompare(b.report.username);
        } else if (filterSortOption === 'Admin Assignee') {
            return a.assignee.adminname.localeCompare(b.assignee.adminname);
        } else if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(
                parseDate(a.report.date),
                parseDate(b.report.date),
            );
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(
                parseDate(a.report.date),
                parseDate(b.report.date),
            );
        }
    });

    const paginatedReports = sortedReports.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredReports.length / itemsPerPage);

    const buttonFilter = [
        { name: 'All reports', status: 'all' },
        { name: 'Finished', status: 'Finished' },
        { name: 'Pending', status: 'Pending' },
        { name: 'Reject', status: 'Reject' },
    ];

    const sortMethods = [
        'Username',
        'Admin Assignee',
        'Date (oldest first)',
        'Date (newest first)',
    ];

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title inline-block px-4 py-8 text-7xl">
                Review Reports
            </h1>

            <div className="admin-page__filter flex space-x-4 border-b-2 px-2">
                <FilterStatus
                    filterList={buttonFilter}
                    tabStatus={tabStatus}
                    onFilterClick={(tabStatus) => {
                        setTabStatus(tabStatus);
                        setCurrentPage(1);
                    }}
                    isReviewPage={true}
                />
            </div>

            <div className="admin-page__action flex items-center space-x-4 border-b-2 py-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearch={(term) => {
                        setSearchTerm(term);
                        setCurrentPage(1);
                    }}
                />
                <button
                    className="admin-page__filter h-11 rounded-xl bg-black px-4 duration-200 ease-in-out hover:scale-105"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <i className="ri-equalizer-2-line px-1"></i>
                    Filters
                </button>
            </div>

            {showFilters && (
                <FilterSort
                    date={date}
                    setDate={setDate}
                    sortMethods={sortMethods}
                    sortOption={sortOption}
                    setSortOption={setSortOption}
                    applyFilter={applyFilter}
                />
            )}

            <table className="w-full overflow-hidden">
                <thead>
                    <tr className="border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">
                            User name
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Report type
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Category
                        </th>
                        <th className="px-2 py-5 text-right font-normal">
                            Status
                        </th>
                        <th className="px-2 py-5 text-right font-normal">
                            Assignee
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedReports.map((report, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer border-b-2 transition-colors duration-400 ease-in-out hover:bg-white hover:bg-opacity-25"
                            onClick={() => setSelectedReport(report)}
                        >
                            <td className="px-2 py-5">
                                {report.report.username}
                            </td>
                            <td className="px-2 py-5">{report.report.date}</td>
                            <td className="px-2 py-5">
                                {report.report.reporttype}
                            </td>
                            <td className="px-2 py-5">
                                {report.report.category}
                            </td>
                            <td className="flex items-end justify-end p-2 py-5">
                                <div
                                    className={`mx-2 my-[6px] h-4 w-[40px] rounded-lg ${
                                        report.status === 'Finished'
                                            ? 'bg-[#188038]'
                                            : report.status === 'Pending'
                                              ? 'bg-[#F6FE00]'
                                              : 'bg-[#FD0053]'
                                    }`}
                                />
                            </td>
                            <td className="relative">
                                <div
                                    className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-full border-[3px] px-1"
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {report?.assignee?.image?.url ? (
                                        <img
                                            src={report.assignee.image.url}
                                            alt="user avatar"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <i className="ri-user-3-fill text-2xl" />
                                    )}
                                </div>
                                {hoveredIndex === index && (
                                    <div className="absolute right-0 rounded-lg bg-gray-900 px-2 text-center text-xs text-white shadow-lg">
                                        {report.assignee.adminname}
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-8 flex items-center justify-between">
                <ItemsPerPageSelector
                    itemsPerPage={itemsPerPage}
                    handleItemsPerPageChange={handleItemsPerPageChange}
                />
                <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                />
            </div>

            {selectedReport && (
                <ReviewReportFrame
                    item={selectedReport}
                    onClose={() => setSelectedReport(null)}
                />
            )}
        </div>
    );
}

export default ReviewReportPage;
