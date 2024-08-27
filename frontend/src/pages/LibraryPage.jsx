import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    useGetFollowingListByIdQuery,
    useGetMyPlaylistsQuery,
    useGetRecentlyPlayedSongsQuery,
} from '@services/api';
import { selectCurrentProfile } from '@services/selectors';

function LibraryPage() {
    const { profileId } = useParams();
    const myProfileData = useSelector(selectCurrentProfile);
    const { id } = myProfileData;
    const { data: myPlaylists } = useGetMyPlaylistsQuery(
        { isAlbum: false },
        { skip: !id },
    );

    const { data: followingListData } = useGetFollowingListByIdQuery(
        profileId || id,
        {
            skip: !profileId && !id,
        },
    );
    const { following } = followingListData || {};

    const { data: recentlyPlayedSongsData } = useGetRecentlyPlayedSongsQuery();
    const { songs: recentlyPlayedSongs } = recentlyPlayedSongsData || {};

    const { data: myAlbumData } = useGetMyPlaylistsQuery(
        { isAlbum: true },
        { skip: !id },
    );

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
            data: myAlbumData?.playlists || [],
        },
        {
            type: 'Playlist',
            title: 'Playlist',
            displayItems: '2',
            data: myPlaylists?.playlists || [],
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
