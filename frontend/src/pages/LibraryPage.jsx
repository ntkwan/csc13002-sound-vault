import MediaDisplay from '@components/MediaDisplay';
import { Loading, PageTitle } from '@components/index';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    useGetFollowingListByIdQuery,
    useGetRecentlyPlayedSongsQuery,
} from '@services/api';
import {
    selectCurrentProfile,
    selectMyAlbums,
    selectMyPlaylists,
} from '@services/selectors';

function LibraryPage() {
    const { profileId } = useParams();
    const myProfileData = useSelector(selectCurrentProfile);
    const { id } = myProfileData;
    const myPlaylists = useSelector(selectMyPlaylists);
    const myAlbums = useSelector(selectMyAlbums);

    const { data: followingListData, isLoading: followingListLoading } =
        useGetFollowingListByIdQuery(profileId || id, {
            skip: !profileId && !id,
        });
    const { following } = followingListData || {};

    const {
        data: recentlyPlayedSongsData,
        isLoading: recentlyPlayedSongsLoading,
    } = useGetRecentlyPlayedSongsQuery();
    const { songs: recentlyPlayedSongs } = recentlyPlayedSongsData || {};

    if (followingListLoading || recentlyPlayedSongsLoading) {
        return <Loading />;
    }

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
            type: 'Album',
            title: 'Albums',
            displayItems: '2',
            data: myAlbums || [],
        },
        {
            type: 'Playlist',
            title: 'Playlist',
            displayItems: '2',
            data: myPlaylists || [],
        },
        {
            type: 'Single Song',
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
