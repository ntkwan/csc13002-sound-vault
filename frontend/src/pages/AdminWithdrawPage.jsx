import React, { useState } from 'react';
import {
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';

const sampleRequests = [
    {
        name: 'Sơn Tùng MTP',
        gmail: 'abc@gmail.com',
        date: '23-05-2024',
        time: '23:59',
        amount: 2000000,
        status: 'Paid',
    },
    {
        name: 'Jane Doe',
        gmail: 'jane.doe@gmail.com',
        date: '24-06-2024',
        time: '15:30',
        amount: 1500000,
        status: 'Unpaid',
    },
    {
        name: 'John Smith',
        gmail: 'john.smith@gmail.com',
        date: '12-07-2024',
        time: '10:00',
        amount: 500000,
        status: 'Paid',
    },
    {
        name: 'Alice Johnson',
        gmail: 'alice.johnson@gmail.com',
        date: '05-08-2024',
        time: '09:45',
        amount: 1200000,
        status: 'Unpaid',
    },
    {
        name: 'Bob Brown',
        gmail: 'bob.brown@gmail.com',
        date: '15-09-2024',
        time: '14:20',
        amount: 1800000,
        status: 'Paid',
    },
];

const generateRequest = (samples, counts) => {
    let requests = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            requests.push({ ...sample });
        }
    });
    return requests;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialRequest = generateRequest(sampleRequests, counts);

function AdminWithdrawPage() {
    const [requests, setRequests] = useState(initialRequest);
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

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
    };

    const filteredRequests = requests.filter((request) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd-MM-yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || request.status === tabStatus) &&
            (!filterDate ||
                isEqual(parseDate1(request.date), parseDate2(filterDate))) &&
            (!searchTerm ||
                request.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedRequests = filteredRequests.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Name') {
            return a.name.localeCompare(b.name);
        } else if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(parseDate(a.date), parseDate(b.date));
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(parseDate(a.date), parseDate(b.date));
        }
    });

    const paginatedRequests = sortedRequests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);

    const buttonFilter = [
        { name: 'All requests', status: 'all' },
        { name: 'Paid', status: 'Paid' },
        { name: 'Unpaid', status: 'Unpaid' },
    ];

    const sortMethods = ['Name', 'Date (oldest first)', 'Date (newest first)'];

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const formatCurrency = (amount) => {
        return amount
            .toLocaleString('vi-VN', {
                style: 'currency',
                currency: 'VND',
                minimumFractionDigits: 0,
            })
            .replace('₫', '')
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title inline-block select-none px-4 py-8 text-7xl">
                Withdrawal Request
            </h1>

            <div className="admin-page__filter flex space-x-4 border-b-2 px-2">
                <FilterStatus
                    filterList={buttonFilter}
                    tabStatus={tabStatus}
                    onFilterClick={(tabStatus) => {
                        setTabStatus(tabStatus);
                        setCurrentPage(1);
                    }}
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
                    <tr className="cursor-default border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">
                            From
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Time
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Amount
                        </th>
                        <th className="px-2 py-5 text-right font-normal">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedRequests.map((request, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer border-b-2 transition-colors duration-400 ease-in-out"
                        >
                            <td className="px-2 py-5">
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">
                                        {request.name}
                                    </p>
                                    <p className="text-sm text-[#718096]">
                                        {request.gmail}
                                    </p>
                                </div>
                            </td>
                            <td className="px-2 py-5">{request.date}</td>
                            <td className="px-2 py-5">{request.time}</td>
                            <td className="px-2 py-5">
                                {formatCurrency(request.amount)}
                            </td>
                            <td className="flex items-end justify-end p-2 py-5">
                                <span
                                    className={`rounded-lg px-2 py-1 ${
                                        request.status === 'Paid'
                                            ? 'w-[70px] bg-[#FFF0F0] text-center text-[#0CAF60]'
                                            : 'w-[70px] bg-[#FFF0E6] text-center text-[#eb4141]'
                                    }`}
                                >
                                    {request.status}
                                </span>
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

export default AdminWithdrawPage;
