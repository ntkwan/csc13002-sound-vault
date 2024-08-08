import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    useSetVerifiedArtistByIdMutation,
    useGetAllAccountsQuery,
    useRemoveAccountByIdMutation,
    useBanAccountMutation,
} from '@services/api';

const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

function AdminAccountPage() {
    const navigate = useNavigate();
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
    const [banDays, setBanDays] = useState('1');
    const [banReason, setBanReason] = useState('Violation of terms');

    const [setVerifiedArtistById, { isLoading: isLoadingVerify }] =
        useSetVerifiedArtistByIdMutation();

    const handleVerify = async (id) => {
        if (isLoadingVerify) return;
        try {
            await setVerifiedArtistById(id).unwrap();
        } catch (error) {
            console.error('Failed to verify the artist: ', error);
        }
    };
    const [removeAccountById, { isLoading: isLoadingRemove }] =
        useRemoveAccountByIdMutation();
    const handleRemove = async (id) => {
        if (isLoadingRemove) return;
        try {
            await removeAccountById(id).unwrap();
        } catch (error) {
            console.error('Failed to remove the account: ', error);
        }
    };
    const [banAccount, { isLoading: isLoadingban }] = useBanAccountMutation();
    const handleBan = async (id) => {
        if (isLoadingban) return;
        try {
            const profileId = id;
            const days = parseInt(banDays, 10);
            const reason = banReason;
            await banAccount({ profileId, days, reason }).unwrap();
        } catch (error) {
            console.error('Failed to ban the account: ', error);
        }
    };

    const handleView = (id) => {
        navigate(`/profile/${id}`);
    };

    const { data: accountListData, isLoading: accountListIsLoading } =
        useGetAllAccountsQuery();
    const accounts =
        accountListIsLoading || !accountListData
            ? []
            : accountListData.map((account) => ({
                  id: account.id,
                  name: account.name,
                  date: formatDate(new Date(account.createdAt)),
                  status: account.isVerified ? 'Verified' : 'Unverified',
                  isBanned: account.isBanned,
              }));

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

    const confirmActionHandler = () => {
        if (confirmAction === 'verify' || confirmAction === 'unverify') {
            handleVerify(selectedAccountId);
        } else if (confirmAction === 'remove') {
            handleRemove(selectedAccountId);
        } else if (confirmAction === 'ban' || confirmAction === 'unban') {
            handleBan(selectedAccountId);
        } else if (confirmAction === 'view') {
            handleView(selectedAccountId);
        }
        setConfirmAction(null);
        setSelectedAccountId(null);
    };

    return (
        <>
            <div className="admin-page">
                <h1 className="admin-page__title inline-block select-none px-4 py-8 text-7xl">
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
                        <tr className="cursor-default border-b-2 text-[#718096]">
                            <th className="px-2 py-5 text-left font-normal">
                                ID
                            </th>
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
                                <td
                                    className={`px-2 py-5 ${account.isBanned ? 'font-bold text-[rgb(255,51,51)]' : 'text-white'}`}
                                >
                                    {account.id}
                                </td>
                                <td
                                    className={`px-2 py-5 ${account.isBanned ? 'font-bold text-[rgb(255,51,51)]' : 'text-white'}`}
                                >
                                    {account.name}
                                </td>
                                <td
                                    className={`px-2 py-5 ${account.isBanned ? 'font-bold text-[rgb(255,51,51)]' : 'text-white'}`}
                                >
                                    {account.date}
                                </td>
                                <td className="px-2 py-5">
                                    <span
                                        className={`rounded-lg px-2 py-1 ${
                                            account.status === 'Verified'
                                                ? 'bg-[#FFF0F0] text-[#3663c2]'
                                                : account.status ===
                                                    'Unverified'
                                                  ? 'bg-[#FFF0E6] text-[#eb4141]'
                                                  : 'bg-[#E7F7EF] text-[#0CAF60]'
                                        }`}
                                    >
                                        {account.status}
                                    </span>
                                </td>
                                <td className="flex justify-evenly p-2 py-5">
                                    <ManagementButtons
                                        background={
                                            account.status === 'Verified'
                                                ? 'bg-[#FE964A]'
                                                : 'bg-[#9F68B2]'
                                        }
                                        children={
                                            account.status === 'Verified'
                                                ? 'Unverify'
                                                : 'Verify'
                                        }
                                        onClick={() => {
                                            const action =
                                                account.status === 'Verified'
                                                    ? 'unverify'
                                                    : 'verify';
                                            setConfirmAction(action);
                                            setSelectedAccountId(account.id);
                                        }}
                                    />
                                    <ManagementButtons
                                        background="bg-[#195FF0]"
                                        children="View"
                                        onClick={() => {
                                            setConfirmAction('view');
                                            setSelectedAccountId(account.id);
                                        }}
                                    />
                                    <ManagementButtons
                                        background="bg-[#B63D65]"
                                        children="Remove"
                                        onClick={() => {
                                            setConfirmAction('remove');
                                            setSelectedAccountId(account.id);
                                        }}
                                    />
                                    <ManagementButtons
                                        background={
                                            account.isBanned
                                                ? 'bg-[#0CAF60]'
                                                : 'bg-[#CACD6D]'
                                        }
                                        children={
                                            account.isBanned ? 'Unban' : 'Ban'
                                        }
                                        onClick={() => {
                                            const action = account.isBanned
                                                ? 'unban'
                                                : 'ban';
                                            setConfirmAction(action);
                                            setSelectedAccountId(account.id);
                                        }}
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
                                {confirmAction === 'view'
                                    ? 'Are you sure you want to leave this page?'
                                    : `Are you sure you want to ${confirmAction} this account?`}
                                {confirmAction === 'ban' && (
                                    <div className="mb-4">
                                        <label className="mb-2 block font-bold">
                                            Ban Duration (days):
                                        </label>
                                        <select
                                            className="w-full rounded border px-3 py-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-black dark:text-white"
                                            value={banDays}
                                            onChange={(e) =>
                                                setBanDays(e.target.value)
                                            }
                                        >
                                            <option value="1">1 day</option>
                                            <option value="3">3 days</option>
                                            <option value="7">1 week</option>
                                            <option value="30">1 month</option>
                                            <option value="365">1 year</option>
                                        </select>
                                        <label className="mb-2 mt-4 block font-bold">
                                            Ban Reason:
                                        </label>
                                        <select
                                            className="w-full rounded border px-3 py-2 text-gray-900 hover:cursor-pointer focus:border-slate-500 focus:ring-0 dark:bg-black dark:text-white"
                                            value={banReason}
                                            onChange={(e) =>
                                                setBanReason(e.target.value)
                                            }
                                        >
                                            <option value="violation">
                                                Violation of terms
                                            </option>
                                            <option value="spam">
                                                Spamming
                                            </option>
                                            <option value="abuse">
                                                Abusive behavior
                                            </option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                )}
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
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default AdminAccountPage;
