import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
    useGetDashboardStatsQuery,
    useGetAllAccountsQuery,
    useGetAllSongsQuery,
} from '@services/api';
import { Loading } from '@components';

const StatCard = ({ title, value, bgColor, iconClass }) => {
    return (
        <div className="my-4 flex h-32 items-center justify-between rounded-xl bg-[#273142] p-1">
            <div className="text-left">
                <p className="select-none p-3 font-kodchasan font-medium leading-4 text-slate-400">
                    {title}
                </p>
                <p className="p-3 text-3xl font-semibold">{value}</p>
            </div>
            <div
                className={`m-2 flex h-14 w-14 items-center justify-center self-start rounded-3xl ${bgColor}`}
            >
                <i
                    className={`${iconClass} rounded-3xl text-3xl text-slate-50`}
                />
            </div>
        </div>
    );
};

StatCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    bgColor: PropTypes.string.isRequired,
    iconClass: PropTypes.string.isRequired,
};

function AdminDashboardPage() {
    const navigate = useNavigate();
    const { data: statsData, isLoading: statsIsLoading } =
        useGetDashboardStatsQuery();
    const { data: accountListData, isLoading: accountListIsLoading } =
        useGetAllAccountsQuery();
    const { data: songListData, isLoading: songListIsLoading } =
        useGetAllSongsQuery();

    if (accountListIsLoading || songListIsLoading || statsIsLoading) {
        return <Loading />;
    }
    const statItems = [
        {
            title: 'Total Users',
            value: statsData?.totalUsers || 0,
            bgColor: 'bg-[#8280FF]',
            iconClass: 'ri-group-fill',
        },
        {
            title: 'Total Songs',
            value: statsData?.totalSongs || 0,
            bgColor: 'bg-[#80FFDD]',
            iconClass: 'ri-music-2-fill',
        },
        {
            title: 'Total Verified Artists',
            value: statsData?.totalVerifiedArtists || 0,
            bgColor: 'bg-[#FF80C8]',
            iconClass: 'ri-user-follow-fill',
        },
        {
            title: 'Total Reports',
            value: statsData?.totalReports || 0,
            bgColor: 'bg-[#FFB380]',
            iconClass: 'bx bxs-envelope',
        },
        {
            title: 'Total Transactions',
            value: statsData?.totalTransactions || 0,
            bgColor: 'bg-[#bb80ff]',
            iconClass: 'ri-inbox-line',
        },
        {
            title: 'Total Withdrawal Requests',
            value: statsData?.totalWithdrawalRequests || 0,
            bgColor: 'bg-[#FF8082]',
            iconClass: 'ri-article-line',
        },
    ];
    const accounts = accountListData.slice(0, 10).map((account) => ({
        id: account.id,
        name: account.name,
        status: account.isBanned
            ? 'Banned'
            : account.isVerified
              ? 'Verified'
              : 'Unverified',
        image: account?.image?.url ? account.image.url : '',
    }));
    const songs = songListData.slice(0, 10).map((song) => ({
        id: song.id,
        name: song.title,
        artist: song.artist,
        status: song.isVerified ? 'Verified' : 'Unverified',
        image: song?.image?.url ? song.image.url : '',
        isDisabled: song.isDisabled,
    }));

    const handleUserSeeAll = () => {
        navigate('/admin/user');
    };
    const handleSongSeeAll = () => {
        navigate('/admin/song');
    };
    const handleViewUser = (id) => {
        navigate(`/profile/${id}`);
    };
    const handleViewSong = (id) => {
        navigate(`/song/${id}`);
    };
    return (
        <div className="admin-dashboard cursor-default">
            <h1 className="admin-page__title inline-block select-none px-4 py-8 text-7xl">
                Dashboard
            </h1>
            <div className="admin-page__stat-card grid grid-cols-3 gap-x-24 gap-y-4">
                {statItems.map((item) => (
                    <StatCard
                        key={item.title}
                        title={item.title}
                        value={item.value}
                        bgColor={item.bgColor}
                        iconClass={item.iconClass}
                    />
                ))}
            </div>
            <div className="admin-page__user-song-list mt-8 flex gap-24">
                <div className="userlist__container flex-[1] rounded-2xl bg-[#273142] pb-4 pl-6 pr-4 pt-7">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="select-none pb-4 text-left font-semibold">
                                    User list
                                </th>
                                <th className="pb-4">
                                    <button
                                        className="select-none rounded-3xl bg-[#7551FF] px-3 py-2 text-sm font-medium duration-200 ease-in-out hover:scale-105"
                                        onClick={handleUserSeeAll}
                                    >
                                        See all
                                    </button>
                                </th>
                            </tr>
                            <tr className="text-sm text-slate-300">
                                <th className="select-none pb-2 text-left font-normal">
                                    Name
                                </th>
                                <th className="select-none pb-2 font-normal">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {accounts.map((account) => (
                                <tr key={account.id}>
                                    <td className="py-2">
                                        <div
                                            className="flex cursor-pointer items-center"
                                            onClick={() =>
                                                handleViewUser(account.id)
                                            }
                                        >
                                            <img
                                                src={account.image}
                                                alt=""
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <p className="ml-2 truncate text-sm hover:underline">
                                                {account.name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-2 py-2 text-center">
                                        <span
                                            className={`ml-2 rounded-lg px-2 py-1 text-sm font-bold ${
                                                account.status === 'Verified'
                                                    ? 'bg-[#E7F7EF] text-[#0CAF60]'
                                                    : account.status ===
                                                        'Unverified'
                                                      ? 'bg-[#E7F7EF] text-[#eb4141]'
                                                      : 'bg-[#E7F7EF] text-[#FE964A]'
                                            }`}
                                        >
                                            {account.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex-[2] rounded-2xl bg-[#273142] pb-4 pl-6 pr-4 pt-7">
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="select-none pb-4 text-left font-semibold">
                                    Song list
                                </th>
                                <th className="pb-4"></th>
                                <th className="pb-4">
                                    <button
                                        className="mr-[9px] select-none rounded-3xl bg-[#7551FF] px-3 py-2 text-sm font-medium duration-200 ease-in-out hover:scale-105"
                                        onClick={handleSongSeeAll}
                                    >
                                        See all
                                    </button>
                                </th>
                            </tr>
                            <tr className="text-sm text-slate-300">
                                <th className="select-none pb-2 text-left font-normal">
                                    Name
                                </th>
                                <th className="select-none pb-2 font-normal">
                                    Status
                                </th>
                                <th className="select-none pb-2 font-normal">
                                    Artist
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {songs.map((song) => (
                                <tr key={song.id}>
                                    <td className="py-2">
                                        <div
                                            className="flex cursor-pointer items-center"
                                            onClick={() =>
                                                handleViewSong(song.id)
                                            }
                                        >
                                            <img
                                                src={song.image}
                                                alt=""
                                                className="h-8 w-8 rounded-full"
                                            />
                                            <p className="ml-2 w-40 truncate text-sm hover:underline">
                                                {song.name}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="flex items-center justify-center px-2 py-2">
                                        <span
                                            className={`rounded-lg px-2 py-1 text-sm font-bold ${
                                                song.status === 'Verified'
                                                    ? 'bg-[#E7F7EF] text-[#0CAF60]'
                                                    : song.status ===
                                                        'Unverified'
                                                      ? 'bg-[#E7F7EF] text-[#eb4141]'
                                                      : 'bg-[#E7F7EF] text-[#FE964A]'
                                            }`}
                                        >
                                            {song.status}
                                        </span>
                                    </td>
                                    <td className="px-2 py-2">
                                        <p className="truncate text-center text-sm">
                                            {song.artist}
                                        </p>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
