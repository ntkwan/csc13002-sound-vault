import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUserProfile } from '@features/profilepage/slices';
import { useGetFollowingListByIdQuery, useGetRecentlyPlayedSongsQuery } from '@services/api';

const IMGURL =
    'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png';

function LibraryPage() {
    const { profileId } = useParams();
    const myProfileData = useSelector(selectUserProfile);
    const { id } = myProfileData;
    const { data: followingListData, isLoading: followingListLoading } =
        useGetFollowingListByIdQuery(profileId || id, {
            skip: !profileId && !id,
        });
    const { data: recentlyPlayedSongsData } = useGetRecentlyPlayedSongsQuery();
    
    const { songs: recentlyPlayedSongs } = recentlyPlayedSongsData || {};
    console.log(recentlyPlayedSongs);
    const { following } = followingListData || {};
    const followingDisplay = {
        type: 'Artist',
        title: 'Following',
        visibility: '',
        link: '',
        data: following || [],
    };

    if (followingListLoading) return null;

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
            data: [
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: 'playlist',
                },
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: 'playlist',
                },
                {
                    title: 'Chúng Ta Của Tương Lai',
                    imageurl: {
                        url: IMGURL,
                    },
                    desc: 'playlist',
                },
            ],
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
