import { useState } from 'react';
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
import { Loading, WalletIcon } from '@components';
import { useGetAllPaymentHistoryQuery } from '@services/api';

function AdminTransactionPage() {
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

    const { data: historyData, isLoading } = useGetAllPaymentHistoryQuery();

    if (isLoading) {
        return <Loading />;
    }
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const transactions = historyData.map((transaction) => {
        const { type, ...rest } = transaction;
        return {
            type: capitalizeFirstLetter(type),
            ...rest,
        };
    });

    const filteredTransactions = transactions.filter((transaction) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd/MM/yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || transaction.type === tabStatus) &&
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
        const parseDate = (dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date());

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
        { name: 'Deposit money', status: 'Deposit' },
        { name: 'Withdraw Money', status: 'Withdraw' },
        { name: 'Donation', status: 'Donate' },
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
                            className="cursor-default border-b-2 transition-colors duration-300 ease-in-out"
                        >
                            <td className="h-[74px] px-2">
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">
                                        {transaction.from}
                                    </p>
                                    <p className="text-sm text-[#718096]">
                                        {transaction.fromGmail}
                                    </p>
                                </div>
                            </td>
                            <td className="h-[74px] px-2">
                                <div className="flex flex-nowrap items-center">
                                    {transaction.type === 'Deposit' ? (
                                        <img
                                            src={DepositeIcon}
                                            alt="deposit-icon"
                                            className="mr-3 inline-block h-14 w-14"
                                        />
                                    ) : transaction.type === 'Donate' ? (
                                        <img
                                            src={MusicIcon}
                                            alt="deposit-icon"
                                            className="my-[6px] ml-2 mr-5 inline-block h-9 w-9"
                                        />
                                    ) : (
                                        <div className="ml-[6px] mr-3 flex h-10 w-10 items-center justify-center rounded-full border">
                                            <WalletIcon />
                                        </div>
                                    )}
                                    <p>{transaction.type} money</p>
                                </div>
                            </td>
                            <td className="h-[74px] px-2">
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
                            <td className="h-[74px] px-2">
                                {transaction.date}
                            </td>
                            <td className="h-[74px] px-2 text-right">
                                {transaction.time}
                            </td>
                            <td className="h-[74px] px-2 text-right">
                                {formatCurrency(transaction.availableBalance)}
                            </td>
                            <td className="h-[74px] px-2 text-right">
                                {transaction.type === 'Deposit'
                                    ? '+'
                                    : transaction.type === 'Withdraw'
                                      ? '-'
                                      : ''}{' '}
                                {formatCurrency(transaction.amount)}
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
