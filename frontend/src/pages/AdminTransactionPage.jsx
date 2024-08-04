import React, { useState } from 'react';
import {
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import DepositeIcon from '@assets/img/wallet-type-icon.svg';
import MusicIcon from '@assets/img/wallet-type-music-icon.svg';
import { WalletIcon } from '@components/index';

const sampleTransactions = [
    {
        from: 'Sơn Tùng MTP',
        fromGmail: 'abc@gmail.com',
        to: 'System',
        toGmail: '',
        date: '23-05-2024',
        time: '23:59',
        availableBalance: 2000000,
        changing: 50000,
        status: 'Deposite',
    },
    {
        from: 'Jane Doe',
        fromGmail: 'jane.doe@gmail.com',
        to: 'John Smith',
        toGmail: 'john.smith@gmail.com',
        date: '24-06-2024',
        time: '15:30',
        availableBalance: 1500000,
        changing: 150000,
        status: 'Deposite',
    },
    {
        from: 'John Smith',
        fromGmail: 'john.smith@gmail.com',
        to: 'Alice Johnson',
        toGmail: 'alice.johnson@gmail.com',
        date: '12-07-2024',
        time: '10:00',
        availableBalance: 500000,
        changing: 50000,
        status: 'Withdraw',
    },
    {
        from: 'Alice Johnson',
        fromGmail: 'alice.johnson@gmail.com',
        to: 'Bob Brown',
        toGmail: 'bob.brown@gmail.com',
        date: '05-08-2024',
        time: '09:45',
        availableBalance: 1200000,
        changing: 200000,
        status: 'Donation',
    },
    {
        from: 'Bob Brown',
        fromGmail: 'bob.brown@gmail.com',
        to: 'Jane Doe',
        toGmail: 'jane.doe@gmail.com',
        date: '15-09-2024',
        time: '14:20',
        availableBalance: 1800000,
        changing: 100000,
        status: 'Deposite',
    },
];

const generateTransactions = (samples, counts) => {
    let transactions = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            transactions.push({ ...sample });
        }
    });
    return transactions;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialTransactions = generateTransactions(sampleTransactions, counts);

function AdminTransactionPage() {
    const [transactions, setTransactions] = useState(initialTransactions);
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

    const filteredTransactions = transactions.filter((transaction) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd-MM-yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || transaction.status === tabStatus) &&
            (!filterDate ||
                isEqual(
                    parseDate1(transaction.date),
                    parseDate2(filterDate),
                )) &&
            (!searchTerm ||
                transaction.from
                    .toLowerCase()
                    .startsWith(searchTerm.toLowerCase()) ||
                transaction.to
                    .toLowerCase()
                    .startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedTransactions = filteredTransactions.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Name (sender)') {
            return a.from.localeCompare(b.from);
        } else if (filterSortOption === 'Name (receiver)') {
            return a.to.localeCompare(b.to);
        } else if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(parseDate(a.date), parseDate(b.date));
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(parseDate(a.date), parseDate(b.date));
        }
    });

    const paginatedTransactions = sortedTransactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

    const buttonFilter = [
        { name: 'All transactions', status: 'all' },
        { name: 'Deposite money', status: 'Deposite' },
        { name: 'Withdraw Money', status: 'Withdraw' },
        { name: 'Donation', status: 'Donation' },
    ];

    const sortMethods = [
        'Name (sender)',
        'Name (receiver)',
        'Date (oldest first)',
        'Date (newest first)',
    ];

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
                Transactions
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

            <div className="admin-page__action flex select-none items-center space-x-4 border-b-2 py-6">
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
                            Type
                        </th>
                        <th className="px-2 py-5 text-left font-normal">To</th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-right font-normal">
                            Time
                        </th>
                        <th className="px-2 py-5 text-right font-normal">
                            Available Balance
                        </th>
                        <th className="px-2 py-5 text-right font-normal">
                            Changing
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedTransactions.map((transaction, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer border-b-2 transition-colors duration-400 ease-in-out"
                        >
                            <td className="h-[98px] px-2 py-5">
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">
                                        {transaction.from}
                                    </p>
                                    <p className="text-sm text-[#718096]">
                                        {transaction.fromGmail}
                                    </p>
                                </div>
                            </td>
                            <td className="h-[98px] px-2 py-5">
                                <div className="flex flex-nowrap items-center">
                                    {transaction.status === 'Deposite' ? (
                                        <img
                                            src={DepositeIcon}
                                            alt="deposite-icon"
                                            className="mr-3 inline-block h-14 w-14"
                                        />
                                    ) : transaction.status === 'Donation' ? (
                                        <img
                                            src={MusicIcon}
                                            alt="deposite-icon"
                                            className="ml-2 mr-3 inline-block h-9 w-9"
                                        />
                                    ) : (
                                        <div className="ml-[6px] mr-3 flex h-10 w-10 items-center justify-center rounded-full border">
                                            <WalletIcon />
                                        </div>
                                    )}
                                    <p>{transaction.status} money</p>
                                </div>
                            </td>
                            <td className="h-[98px] px-2 py-5">
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">
                                        {transaction.to}
                                    </p>
                                    {transaction.toGmail && (
                                        <p className="text-sm text-[#718096]">
                                            {transaction.toGmail}
                                        </p>
                                    )}
                                </div>
                            </td>
                            <td className="h-[98px] px-2 py-5">
                                {transaction.date}
                            </td>
                            <td className="h-[98px] px-2 py-5 text-right">
                                {transaction.time}
                            </td>
                            <td className="h-[98px] px-2 py-5 text-right">
                                {formatCurrency(transaction.availableBalance)}
                            </td>
                            <td className="h-[98px] px-2 py-5 text-right">
                                {transaction.status === 'Deposite'
                                    ? '+'
                                    : transaction.status === 'Withdraw'
                                      ? '-'
                                      : ''}{' '}
                                {formatCurrency(transaction.changing)}
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

export default AdminTransactionPage;
