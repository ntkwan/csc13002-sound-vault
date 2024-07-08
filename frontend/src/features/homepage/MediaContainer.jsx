import { useGetTrendingSongsQuery } from '@services/api';
import { MediaDisplay } from '@components';
import { Loading } from '@components/index';

function MediaContainer() {
    const { data, error, isLoading } = useGetTrendingSongsQuery();
    if (isLoading) return <Loading />;
    const topTrending = data.slice(0, 6);
    const mediaData = [
        {
            type: 'Artist',
            title: 'Featured Artists',
            visibility: '',
            link: 'artist',
            data: [
                {
                    artist: 'Hoàng Thùy Linh',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'Phan Mạnh Quỳnh',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'Obito',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'HIEUTHUHAI',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'Anh Tú',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
            ],
        },
        {
            type: 'Song',
            title: 'Trending',
            visibility: '',
            link: 'library',
            data: topTrending,
        },
        {
            type: 'Song',
            title: 'New Release',
            visibility: '',
            link: 'library',
            data: topTrending,
        },
        {
            type: 'Album',
            title: 'Top Album',
            visibility: '',
            link: 'library',
            data: topTrending,
        },
    ];

    return (
        <div className="Media__container mt-20 grid auto-rows-auto gap-y-14 font-kodchasan">
            {mediaData.map((media, index) => (
                <MediaDisplay
                    key={index}
                    media={media}
                    displayItems="1"
                    displayType={
                        media.title === 'Featured Artists'
                            ? 'grid grid-cols-5'
                            : 'grid grid-cols-6'
                    }
                />
            ))}
        </div>
    );
}

export default MediaContainer;
