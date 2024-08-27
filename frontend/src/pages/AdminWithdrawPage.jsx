import { useState } from 'react';
import {
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { useGetWithdrawRequestsQuery } from '@services/api';
import { Loading } from '@components';
import { QrCodeModal } from '@components/index';

function AdminWithdrawPage() {
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
    const [qrCodeModalVisible, setQrCodeModalVisible] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [orderId, setOrderId] = useState('');

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
    };

    const { data: requests, isLoading } = useGetWithdrawRequestsQuery();

    if (isLoading) {
        return <Loading />;
    }
    const decapitalizeExceptFirst = (str) =>
        str[0] + str.slice(1).toLowerCase();

    const closeQrCodeModal = () => setQrCodeModalVisible(false);
    const handleUnpaid = (status, orderId, qrCode) => () => {
        if (status === 'PENDING') {
            setQrCode(qrCode);
            setOrderId(orderId);
            setQrCodeModalVisible(true);
        }
    };

    const filteredRequests = requests.filter((request) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd/MM/yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || request.status === tabStatus) &&
            (!filterDate ||
                isEqual(parseDate1(request.date), parseDate2(filterDate))) &&
            (!searchTerm ||
                request.from.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedRequests = filteredRequests.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd/MM/yyyy', new Date());

        if (filterSortOption === 'Name') {
            return a.from.localeCompare(b.from);
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
        { name: 'Paid', status: 'PAID' },
        { name: 'Unpaid', status: 'PENDING' },
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
                Withdrawal Requests
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
                            className={`${request.status === 'PENDING' ? 'cursor-pointer' : 'cursor-default'} border-b-2 transition-colors duration-300 ease-in-out`}
                            onClick={handleUnpaid(
                                request.status,
                                request.orderId,
                                request.qrCode,
                            )}
                        >
                            <td className="px-2 py-5">
                                <div className="flex flex-col">
                                    <p className="text-lg font-semibold">
                                        {request.from}
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
                                    className={`w-1/3 min-w-fit rounded-lg px-2 py-1 ${
                                        request.status === 'PAID'
                                            ? 'bg-[#FFF0F0] text-center text-[#0CAF60]'
                                            : 'bg-[#FFF0E6] text-center text-[#eb4141]'
                                    }`}
                                >
                                    {request.status === 'PENDING'
                                        ? 'Unpaid'
                                        : decapitalizeExceptFirst(
                                              request.status,
                                          )}
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
            {qrCodeModalVisible && (
                <QrCodeModal
                    qrCode={qrCode}
                    orderId={orderId}
                    closeQrCodeModal={closeQrCodeModal}
                />
            )}
        </div>
    );
}

export default AdminWithdrawPage;
