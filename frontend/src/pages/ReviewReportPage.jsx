import { useState } from 'react';
import {
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
    ReviewReportFrame,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { useGetReportsQuery } from '@services/api';
import { Loading } from '@components';

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};
const formatTime = (date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
};
function ReviewReportPage() {
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
    const [selectedReport, setSelectedReport] = useState(null);

    const { data: reportListData, isLoading: reportListIsLoading } =
        useGetReportsQuery();
    if (reportListIsLoading) return <Loading />;
    const reports =
        reportListIsLoading || !reportListData
            ? []
            : reportListData.map((report) => ({
                  // report info
                  idReport: report.id,
                  contentLink: report.contentLink,
                  date: formatDate(new Date(report.createdAt)),
                  time: formatTime(new Date(report.createdAt)),
                  isSong: report.isSong,
                  reason: report.reason,
                  category: report.rpCategory,
                  type: report.rpType,
                  status: report.status,
                  assignee: report.assignee,
                  // user info
                  idUser: report.account,
                  name: report.fullName,
                  email: report.email,
                  idNumber: report.idNumber,
                  phone: report.phoneNumber,
              }));

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
        const status =
            report.status && report.assignee != ''
                ? 'Finished'
                : !report.status && report.assignee == ''
                  ? 'Pending'
                  : 'Reject';
        return (
            (tabStatus === 'all' || status === tabStatus) &&
            (!filterDate ||
                isEqual(parseDate1(report.date), parseDate2(filterDate))) &&
            (!searchTerm ||
                report.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedReports = filteredReports.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Username') {
            return a.name.localeCompare(b.name);
        } else if (filterSortOption === 'Admin Assignee') {
            return a.assignee.localeCompare(b.assignee);
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
            <h1 className="admin-page__title inline-block select-none px-4 py-8 text-7xl">
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
                    <tr className="cursor-default border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">
                            Report ID
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
                        <th className="px-2 py-5 text-center font-normal">
                            Assignee
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedReports.map((report, index) => (
                        <tr
                            key={index}
                            className="cursor-pointer border-b-2 transition-colors duration-300 ease-in-out hover:bg-white hover:bg-opacity-25"
                            onClick={() => setSelectedReport(report)}
                        >
                            <td className="px-2 py-6">{report.idReport}</td>
                            <td className="px-2 py-5">{report.date}</td>
                            <td className="py-5 pl-8">
                                {report.isSong ? 'Song' : 'User'}
                            </td>
                            <td className="px-2 py-5">{report.category}</td>
                            <td className="flex items-end justify-end p-2 py-5">
                                <div
                                    className={`mx-2 my-[6px] h-3 w-[40px] rounded-lg ${
                                        report.status && report.assignee != ''
                                            ? 'bg-[#188038]'
                                            : !report.status &&
                                                report.assignee == ''
                                              ? 'bg-[#F6FE00]'
                                              : 'bg-[#FD0053]'
                                    }`}
                                />
                            </td>
                            <td className="px-2 py-5 text-center">
                                {report.assignee
                                    ? report.assignee
                                    : 'Unassigned'}
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
