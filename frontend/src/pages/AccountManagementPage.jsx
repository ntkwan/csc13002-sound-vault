import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    ManagementButtons,
    FilterStatus,
    SearchBar,
    Pagination,
    FilterSort,
    ItemsPerPageSelector,
} from '@features/admindashboard/components';
import { parse, compareAsc, compareDesc, isEqual } from 'date-fns';
import { setAccountList } from '@features/admindashboard/slices';

const sampleAccounts = [
    {
        id: '1',
        name: 'John Doe',
        date: '23-05-2024',
        status: 'Verified',
    },
    {
        id: '2',
        name: 'Jane Smith',
        date: '21-04-2022',
        status: 'Unverified',
    },
    {
        id: '3',
        name: 'Alice Johnson',
        date: '19-01-2020',
        status: 'Pending',
    },
    {
        id: '4',
        name: 'Bob Brown',
        date: '02-10-2024',
        status: 'Verified',
    },
    {
        id: '5',
        name: 'Charlie Davis',
        date: '03-12-2019',
        status: 'Unverified',
    },
    {
        id: '6',
        name: 'Eve Martinez',
        date: '23-04-2024',
        status: 'Pending',
    },
];

const generateAccounts = (samples, counts) => {
    let accounts = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            accounts.push({
                ...sample,
                id: `${sample.id}-${i}`,
            });
        }
    });
    return accounts;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialAccounts = generateAccounts(sampleAccounts, counts);

function AdminAccountPage() {
    const dispatch = useDispatch();
    const accounts = useSelector((state) => state.admindashboard.accountList);
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
    const [confirmAction, setConfirmAction] = useState(null);
    const [selectedAccountId, setSelectedAccountId] = useState(null);

    useEffect(() => {
        dispatch(setAccountList(initialAccounts));
    }, [dispatch]);

    const applyFilter = () => {
        setCurrentPage(1);
        setFilterDate(date);
        setFilterSortOption(sortOption);
    };

    const filteredAccounts = accounts.filter((account) => {
        const parseDate1 = (dateStr) =>
            parse(dateStr, 'dd-MM-yyyy', new Date());
        const parseDate2 = (dateStr) =>
            parse(dateStr, 'yyyy-MM-dd', new Date());
        return (
            (tabStatus === 'all' || account.status === tabStatus) &&
            (!filterDate ||
                isEqual(parseDate1(account.date), parseDate2(filterDate))) &&
            (!searchTerm ||
                account.name.toLowerCase().startsWith(searchTerm.toLowerCase()))
        );
    });

    const sortedAccounts = filteredAccounts.sort((a, b) => {
        const parseDate = (dateStr) => parse(dateStr, 'dd-MM-yyyy', new Date());

        if (filterSortOption === 'Name') {
            return a.name.localeCompare(b.name);
        } else if (filterSortOption === 'Date (oldest first)') {
            return compareAsc(parseDate(a.date), parseDate(b.date));
        } else if (filterSortOption === 'Date (newest first)') {
            return compareDesc(parseDate(a.date), parseDate(b.date));
        }
    });

    const paginatedAccounts = sortedAccounts.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage,
    );

    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

    const buttonFilter = [
        { name: 'All accounts', status: 'all' },
        { name: 'Verified', status: 'Verified' },
        { name: 'Unverified', status: 'Unverified' },
        { name: 'Pending', status: 'Pending' },
    ];
    const sortMethods = ['Name', 'Date (oldest first)', 'Date (newest first)'];

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const handleVerify = (accountId) => {
        setConfirmAction('Verify');
        setSelectedAccountId(accountId);
    };

    const handleUnverify = (accountId) => {
        setConfirmAction('Unverify');
        setSelectedAccountId(accountId);
    };

    const confirmActionHandler = () => {
        if (confirmAction === 'Verify') {
            const updatedAccounts = accounts.map((acc) =>
                acc.id === selectedAccountId
                    ? { ...acc, status: 'Verified' }
                    : acc,
            );
            dispatch(setAccountList(updatedAccounts));
        } else if (confirmAction === 'Unverify') {
            const updatedAccounts = accounts.map((acc) =>
                acc.id === selectedAccountId
                    ? { ...acc, status: 'Unverified' }
                    : acc,
            );
            dispatch(setAccountList(updatedAccounts));
        }
        setConfirmAction(null);
        setSelectedAccountId(null);
    };

    return (
        <div className="admin-page">
            <h1 className="admin-page__title inline-block px-4 py-8 text-7xl">
                Accounts
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
                    <tr className="border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">ID</th>
                        <th className="px-2 py-5 text-left font-normal">
                            Name
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Status
                        </th>
                        <th className="px-2 py-5 font-normal">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedAccounts.map((account, index) => (
                        <tr key={index} className="border-b-2">
                            <td className="px-2 py-5">{account.id}</td>
                            <td className="px-2 py-5">{account.name}</td>
                            <td className="px-2 py-5">{account.date}</td>
                            <td className="px-2 py-5">
                                <span
                                    className={`rounded-lg px-2 py-1 ${
                                        account.status === 'Verified'
                                            ? 'bg-[#FFF0F0] text-[#FD6A6A]'
                                            : account.status === 'Unverified'
                                              ? 'bg-[#FFF0E6] text-[#FE964A]'
                                              : 'bg-[#E7F7EF] text-[#0CAF60]'
                                    }`}
                                >
                                    {account.status}
                                </span>
                            </td>
                            <td className="flex justify-evenly p-2 py-5">
                                {account.status === 'Verified' ? (
                                    <ManagementButtons
                                        background="bg-[#FE964A]"
                                        children="Unverify"
                                        onClick={() =>
                                            handleUnverify(account.id)
                                        }
                                    />
                                ) : (
                                    <ManagementButtons
                                        background="bg-[#9F68B2]"
                                        children="Verify"
                                        onClick={() => handleVerify(account.id)}
                                    />
                                )}
                                <ManagementButtons
                                    background="bg-[#195FF0]"
                                    children="View"
                                />
                                <ManagementButtons
                                    background="bg-[#34AAA3]"
                                    children="Edit"
                                />
                                <ManagementButtons
                                    background="bg-[#B63D65]"
                                    children="Remove"
                                />
                                <ManagementButtons
                                    background="bg-[#CACD6D]"
                                    children="Disable"
                                />
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

            {/* Modal confirmation */}
            {confirmAction && (
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="rounded-lg bg-slate-500 p-6 shadow-lg">
                        <p className="mb-4">
                            Are you sure you want to {confirmAction} this
                            account?
                        </p>
                        <div className="flex justify-end">
                            <button
                                className="mr-2 rounded-md bg-gray-300 px-4 py-2"
                                onClick={() => setConfirmAction(null)}
                            >
                                Cancel
                            </button>
                            <button
                                className={`${
                                    confirmAction === 'Verify'
                                        ? 'bg-green-500'
                                        : 'bg-red-500'
                                } rounded-md px-4 py-2 text-white`}
                                onClick={confirmActionHandler}
                            >
                                {confirmAction}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminAccountPage;
