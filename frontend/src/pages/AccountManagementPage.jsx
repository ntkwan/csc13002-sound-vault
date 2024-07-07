import React, { useEffect } from 'react';
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
import {
    setAccounts,
    setAccountDate,
    setAccountSortOption,
    setAccountFilterDate,
    setAccountFilterSortOption,
    setAccountTabStatus,
    setAccountSearchTerm,
    setAccountCurrentPage,
    setAccountItemsPerPage,
    selectAdminAccountManagement,
    setAccountShowFilters,
} from '@features/admindashboard/slices';

const sampleAccounts = [
    {
        name: 'John Doe',
        date: '23-05-2024',
        gmail: 'john_doe@gmail.com',
        status: 'Verified',
    },
    {
        name: 'Jane Smith',
        date: '21-04-2022',
        gmail: 'janesmith@gmail.com',
        status: 'Unverified',
    },
    {
        name: 'Alice Johnson',
        date: '19-01-2020',
        gmail: 'fkalicejohnson@gmail.com',
        status: 'Pending',
    },
    {
        name: 'Bob Brown',
        date: '02-10-2024',
        gmail: 'lulbob_brown@gmail.com',
        status: 'Verified',
    },
    {
        name: 'Charlie Davis',
        date: '03-12-2019',
        gmail: 'charliedavis@gmail.com',
        status: 'Unverified',
    },
    {
        name: 'Eve Martinez',
        date: '23-04-2024',
        gmail: 'evemartinez@gmail.com',
        status: 'Pending',
    },
];

const generateAccounts = (samples, counts) => {
    let accounts = [];
    samples.forEach((sample, index) => {
        for (let i = 0; i < counts[index]; i++) {
            accounts.push({
                ...sample,
                gmail: `${sample.gmail}${i}@gmail.com`,
            });
        }
    });
    return accounts;
};

const counts = [10, 10, 10, 10, 5, 5];

const initialAccounts = generateAccounts(sampleAccounts, counts);

function AdminAccountPage() {
    const dispatch = useDispatch();
    const adminAccount = useSelector(selectAdminAccountManagement);
    const {
        accounts,
        date,
        sortOption,
        filterDate,
        filterSortOption,
        tabStatus,
        searchTerm,
        currentPage,
        itemsPerPage,
        showFilters,
    } = adminAccount;

    useEffect(() => {
        dispatch(setAccounts(initialAccounts));
    }, [dispatch]);

    const applyFilter = () => {
        dispatch(setAccountCurrentPage(1));
        dispatch(setAccountFilterDate(date));
        dispatch(setAccountFilterSortOption(sortOption));
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
        } else if (filterSortOption === 'Gmail') {
            return a.gmail.localeCompare(b.gmail);
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

    const actionsButton = [
        { name: 'View', background: 'bg-[#195FF0]' },
        { name: 'Edit', background: 'bg-[#34AAA3]' },
        { name: 'Remove', background: 'bg-[#B63D65]' },
        { name: 'Disable', background: 'bg-[#CACD6D]' },
    ];

    const sortMethods = [
        'Name',
        'Gmail',
        'Date (oldest first)',
        'Date (newest first)',
    ];

    const handleItemsPerPageChange = (e) => {
        dispatch(setAccountItemsPerPage(Number(e.target.value)));
        dispatch(setAccountCurrentPage(1));
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
                        dispatch(setAccountTabStatus(tabStatus));
                        dispatch(setAccountCurrentPage(1));
                    }}
                />
            </div>

            <div className="admin-page__action flex items-center space-x-4 border-b-2 py-6">
                <SearchBar
                    searchTerm={searchTerm}
                    onSearch={(term) => {
                        dispatch(setAccountSearchTerm(term));
                        dispatch(setAccountCurrentPage(1));
                    }}
                />
                <button
                    className="admin-page__filter h-11 rounded-xl bg-black px-4"
                    onClick={() =>
                        dispatch(setAccountShowFilters(!showFilters))
                    }
                >
                    <i className="ri-equalizer-2-line px-1"></i>
                    Filters
                    {console.log(showFilters)}
                </button>
            </div>

            {showFilters && (
                <FilterSort
                    date={date}
                    setDate={(date) => dispatch(setAccountDate(date))}
                    sortMethods={sortMethods}
                    sortOption={sortOption}
                    setSortOption={(option) =>
                        dispatch(setAccountSortOption(option))
                    }
                    applyFilter={applyFilter}
                />
            )}

            <table className="w-full overflow-hidden">
                <thead>
                    <tr className="border-b-2 text-[#718096]">
                        <th className="px-2 py-5 text-left font-normal">
                            Name
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Date
                        </th>
                        <th className="px-2 py-5 text-left font-normal">
                            Gmail
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
                            <td className="px-2 py-5">{account.name}</td>
                            <td className="px-2 py-5">{account.date}</td>
                            <td className="px-2 py-5">{account.gmail}</td>
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
                                {actionsButton.map((action, index) => (
                                    <ManagementButtons
                                        key={index}
                                        background={action.background}
                                        children={action.name}
                                    />
                                ))}
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
                    setCurrentPage={(page) =>
                        dispatch(setAccountCurrentPage(page))
                    }
                    totalPages={totalPages}
                />
            </div>
        </div>
    );
}

export default AdminAccountPage;
