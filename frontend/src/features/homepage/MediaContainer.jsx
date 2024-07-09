import { useGetTrendingSongsQuery, useGetNewSongsQuery } from '@services/api';
import { MediaDisplay } from '@components';
import { Loading } from '@components/index';

function MediaContainer() {
    const { data: trendingSongs, error: trendingSongsError, isLoading: trendingSongsLoading } = useGetTrendingSongsQuery();
    const { data: newSongs, error: newSongsError, isLoading: newSongsLoading } = useGetNewSongsQuery();

    if (trendingSongsLoading || newSongsLoading) return <Loading />;

    const topTrending = trendingSongs ? trendingSongs.slice(0, 6) : [];
    const newReleases = newSongs ? newSongs.slice(0, 6) : [];
    const mediaData = [
        {
            type: 'Artist',
            title: 'Featured Artists',
            visibility: '',
            link: 'artist',
            data: [
                {
                    artist: 'Hoàng Thùy Linh',
                    imageurl: {
                        url: 'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    }

                },
                {
                    artist: 'Phan Mạnh Quỳnh',
                    imageurl: {
                        url: 'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    }
                },
                {
                    artist: 'Obito',
                    imageurl: {
                        url: 'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    }
                },
                {
                    artist: 'HIEUTHUHAI',
                    imageurl: {
                        url: 'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    }
                },
                {
                    artist: 'Anh Tú',
                    imageurl: {
                        url: 'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    }
                },
            ],
        },
        {
            type: 'Song',
            title: 'Trending',
            visibility: '',
            link: 'trending',
            data: topTrending,
        },
        {
            type: 'Song',
            title: 'New Releases',
            visibility: '',
            link: 'newrelease',
            data: newReleases,
        },
        {
            type: 'Album',
            title: 'Top Album',
            visibility: '',
            link: 'album',
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
                        media.type === 'Artist'
                            ? 'grid grid-cols-5'
                            : 'grid grid-cols-6'
                    }
                />
            ))}
        </div>
    );
}

export default MediaContainer;
