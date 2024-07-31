import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '@features/profilepage/slices';
import {
    useGetFollowingListByIdQuery,
    useGetRecentlyPlayedSongsQuery,
    useGetMyPlaylistsQuery,
} from '@services/api';

function LibraryPage() {
    const { profileId } = useParams();
    const myProfileData = useSelector(selectUserProfile);
    const { id } = myProfileData;

    const { data: followingListData } = useGetFollowingListByIdQuery(
        profileId || id,
        {
            skip: !profileId && !id,
        },
    );
    const { following } = followingListData || {};

    const { data: recentlyPlayedSongsData } = useGetRecentlyPlayedSongsQuery();
    const { songs: recentlyPlayedSongs } = recentlyPlayedSongsData || {};

    const { data: myPlaylistsData } = useGetMyPlaylistsQuery();
    const { playlists: myPlaylists } = myPlaylistsData || {};

    const mediaData = [
        {
            type: 'Artist',
            title: 'Following',
            displayItems: '2',
            visibility: '',
            link: '',
            data: following || [],
        },
        {
            type: 'Playlist',
            title: 'Playlist',
            displayItems: '2',
            data: myPlaylists || [],
        },
        {
            type: 'Playlist',
            title: 'Recently Playlist',
            displayItems: '4',
            data: recentlyPlayedSongs || [],
        },
    ];

    return (
        <div className="pt-4">
            <PageTitle title="Library" />
            <div className="Media__container grid auto-rows-auto gap-y-14 font-kodchasan">
                {mediaData.map((media, index) => (
                    <MediaDisplay
                        key={index}
                        media={media}
                        displayItems={media.displayItems}
                        displayType={
                            media.displayItems != 4
                                ? 'grid grid-cols-6 gap-8'
                                : 'grid auto-rows-auto gap-2'
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default LibraryPage;
