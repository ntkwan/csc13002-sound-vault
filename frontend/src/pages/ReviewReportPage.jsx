import React, { useEffect, useState } from 'react';
import {
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { setReportList } from '@features/admindashboard/slices';
import { useDispatch, useSelector } from 'react-redux';

const sampleReports = [
    {
        username: 'SmokeShack Burger',
        date: '23-05-2024',
        category: 'song',
        status: 'Finished',
        description: 'Description',
        adminAssignee: 'Silva',
        image: {
            url: '',
        },
    },
    {
        username: 'Waffle Fries',
        date: '21-04-2022',
        category: 'artist',
        status: 'Pending',
        description: 'Description',
        adminAssignee: 'Rice',
        image: {
            url: '',
        },
    },
    {
        username: 'Chalupa Supreme',
        date: '19-01-2020',
        category: 'song',
        status: 'Reject',
        description: 'Description',
        adminAssignee: 'Saka',
        image: {
            url: '',
        },
    },
    {
        username: 'Checkers Seasoned Fries',
        date: '02-10-2024',
        category: 'song',
        status: 'Pending',
        description: 'Description',
        adminAssignee: 'Bruno',
        image: {
            url: '',
        },
    },
    {
        username: 'French Fries',
        date: '03-12-2019',
        category: 'artist',
        status: 'Finished',
        description: 'Description',
        adminAssignee: 'Booker',
        image: {
            url: '',
        },
    },
    {
        username: 'Taquito with Cheese',
        date: '23-04-2024',
        category: 'artist',
        status: 'Reject',
        description: 'Description',
        adminAssignee: 'Kendall',
        image: {
            url: '',
        },
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
                isEqual(parseDate1(report.date), parseDate2(filterDate))) &&
            (!searchTerm ||
                report.username
                    .toLowerCase()
                    .startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedReports = filteredReports.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Username') {
            return a.username.localeCompare(b.username);
        } else if (filterSortOption === 'Admin Assignee') {
            return a.adminAssignee.localeCompare(b.adminAssignee);
        } else if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(parseDate(a.date), parseDate(b.date));
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(parseDate(a.date), parseDate(b.date));
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
                            Category
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Description
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
                        >
                            <td className="px-2 py-5">{report.username}</td>
                            <td className="px-2 py-5">{report.date}</td>
                            <td className="px-2 py-5">{report.category}</td>
                            <td className="px-2 py-5">{report.description}</td>
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
                            <td>
                                <div className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-full border-[3px]">
                                    {report?.image?.url ? (
                                        <img
                                            src={report.image.url}
                                            alt="user avatar"
                                            className="h-full w-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <i className="ri-user-3-fill text-2xl" />
                                    )}
                                </div>
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
        </div>
    );
}

export default ReviewReportPage;
