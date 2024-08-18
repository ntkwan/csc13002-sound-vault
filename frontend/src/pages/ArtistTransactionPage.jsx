import { useState } from 'react';
import {
    FilterStatus,
    Pagination,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { Loading, PageTitle } from '@components';
import WalletIcon from '@assets/img/wallet-type-wallet-icon.svg';
import MusicIcon from '@assets/img/wallet-type-music-icon.svg';
import { useGetPaymentHistoryQuery } from '@services/api';

function ArtistTransactionPage() {
    const [date, setDate] = useState('');
    const [sortOption, setSortOption] = useState('Date (newest first)');
    const [filterDate, setFilterDate] = useState('');
    const [filterSortOption, setFilterSortOption] = useState(
        'Date (newest first)',
    );
    const [tabStatus, setTabStatus] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [showFilters, setShowFilters] = useState(false);
    const [changingRange, setChangingRange] = useState('all');
    const [filterChangingRange, setFilterChangingRange] = useState('all');

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
        setFilterChangingRange(changingRange);
    };

    const { data: payments, isLoading } = useGetPaymentHistoryQuery();

    if (isLoading) {
        return <Loading />;
    }

    const filteredPayments = payments.filter((payment) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd/MM/yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());

        let rangeCondition = true;

        if (filterChangingRange === 'Under 100.000đ') {
            rangeCondition = payment.amount < 100000;
        } else if (filterChangingRange === '100.000đ - 500.000đ') {
            rangeCondition =
                payment.amount >= 100000 && payment.amount <= 500000;
        } else if (filterChangingRange === 'Over 1.000.000đ') {
            rangeCondition = payment.amount > 1000000;
        } else if (filterChangingRange === 'Over 5.000.000đ') {
            rangeCondition = payment.amount > 5000000;
        }

        return (
            (tabStatus === 'all' || payment.type === tabStatus) &&
            (!filterDate ||
                isEqual(parseDate1(payment.date), parseDate2(filterDate))) &&
            rangeCondition
        );
    });

    const sortedPayments = filteredPayments.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date());

        if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(parseDate(a.date), parseDate(b.date));
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(parseDate(a.date), parseDate(b.date));
        }
        return 0;
    });

    const paginatedPayments = sortedPayments.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

    const buttonFilter = [
        { name: 'All Transactions', status: 'all' },
        { name: 'Withdraw', status: 'withdraw' },
        { name: 'Donation', status: 'donate' },
    ];

    const sortMethods = ['Date (oldest first)', 'Date (newest first)'];
    const changingRangeMethods = [
        'Under 100.000đ',
        '100.000đ - 500.000đ',
        'Over 1.000.000đ',
        'Over 5.000.000đ',
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
            <PageTitle title="History" />
            <div className="admin-page__filter flex justify-between space-x-4 border-b-2 px-2">
                <FilterStatus
                    filterList={buttonFilter}
                    tabStatus={tabStatus}
                    onFilterClick={(tabStatus) => {
                        setTabStatus(tabStatus);
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
                <div>
                    <div className="mb-4">
                        <label htmlFor="date" className="mb-2 block">
                            Date:
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full rounded-md border p-2 hover:cursor-pointer dark:border-gray-600 dark:bg-black dark:text-white"
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sort" className="mb-2 block">
                            Sort by:
                        </label>
                        <select
                            id="sort"
                            name="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="w-full rounded-md border p-2 hover:cursor-pointer dark:border-gray-600 dark:bg-black dark:text-white"
                        >
                            {sortMethods.map((method, index) => (
                                <option key={index} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="changingRange" className="mb-2 block">
                            Amount:
                        </label>
                        <select
                            id="changingRange"
                            name="changingRange"
                            value={changingRange}
                            onChange={(e) => setChangingRange(e.target.value)}
                            className="w-full rounded-md border p-2 hover:cursor-pointer dark:border-gray-600 dark:bg-black dark:text-white"
                        >
                            <option value="all">All</option>
                            {changingRangeMethods.map((method, index) => (
                                <option key={index} value={method}>
                                    {method}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button
                        type="button"
                        onClick={applyFilter}
                        className="rounded-md bg-slate-50 px-4 py-2 text-black hover:bg-blue-500"
                    >
                        Apply Filter
                    </button>
                </div>
            )}

            <table className="w-full overflow-hidden">
                <thead>
                    <tr className="cursor-default border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">
                            Type
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
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
                    {paginatedPayments.map((payment, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer border-b-2 transition-colors duration-300 ease-in-out hover:bg-white hover:bg-opacity-25"
                        >
                            <td className="px-2 py-5">
                                {payment.type === 'withdraw' ? (
                                    <div className="flex flex-nowrap items-center">
                                        <img
                                            src={WalletIcon}
                                            alt="deposit-icon"
                                            className="ml-2 mr-3 inline-block h-6 w-6"
                                        />
                                        <p>
                                            Withdraw money from Wallet{' '}
                                            {payment.status === 'PENDING' ? (
                                                <i className="font-bold text-orange-400">
                                                    Pending
                                                </i>
                                            ) : payment.status ===
                                              'CANCELLED' ? (
                                                <i className="font-bold text-red-500">
                                                    Rejected
                                                </i>
                                            ) : (
                                                <i className="font-bold text-green-500">
                                                    Paid
                                                </i>
                                            )}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="flex flex-nowrap items-center">
                                        <img
                                            src={MusicIcon}
                                            alt="music-icon"
                                            className="my-[6px] ml-1 mr-5 inline-block h-6 w-6"
                                        />
                                        <div className="flex items-center space-x-1">
                                            <span>
                                                Receive donation from{' '}
                                                <span className="font-bold">
                                                    {payment.from}
                                                </span>
                                                {'<'}
                                                {payment.fromGmail}
                                                {'>'}
                                            </span>
                                            <span>for</span>
                                            <span className="font-bold">
                                                {payment.song}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </td>
                            <td className="px-2 py-5">{payment.date}</td>
                            <td className="px-2 py-5">{payment.time}</td>
                            <td className="px-2 py-5 text-right">
                                {formatCurrency(payment.availableBalance)}
                            </td>
                            <td className="px-2 py-5 text-right">
                                {payment.type === 'deposit' ? '+' : '-'}
                                {formatCurrency(payment.amount)}
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

export default ArtistTransactionPage;
