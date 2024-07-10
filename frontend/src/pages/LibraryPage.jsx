import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';

const IMGURL =
    'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png';

function LibraryPage() {
    const mediaData = [
        {
            type: 'Artist',
            title: 'Following',
            displayItems: '2',
            data: [
                {
                    artist: 'Sơn Tùng MTP',
                    imageurl: {
                        url: IMGURL,
                    },
                },
                {
                    artist: 'Sơn Tùng MTP',
                    imageurl: {
                        url: IMGURL,
                    },
                },
                {
                    artist: 'Sơn Tùng MTP',
                    imageurl: {
                        url: IMGURL,
                    },
                },
            ],
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
            data: [
                {
                    title: 'Nếu lúc đó',
                    artist: 'tlinh',
                    genre: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
                    view: 0,
                },
                {
                    title: 'Nếu lúc đó',
                    artist: 'tlinh',
                    genre: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
                    view: 0,
                },
                {
                    title: 'Nếu lúc đó',
                    artist: 'tlinh',
                    genre: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1719576267/tracks/neulucdo-tlinh.mp3',
                    view: 0,
                },
            ],
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
                                ? 'grid grid-cols-6'
                                : 'grid auto-rows-auto gap-2'
                        }
                    />
                ))}
            </div>
        </div>
    );
}

export default LibraryPage;
