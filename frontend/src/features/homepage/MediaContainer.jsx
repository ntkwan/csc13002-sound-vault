import { MediaDisplay } from '@components';
import {
    useGetFeaturedArtistsQuery,
    useGetTrendingSongsQuery,
    useGetNewSongsQuery,
    useGetPopularAlbumsQuery,
} from '@services/api';

function MediaContainer() {
    const { data: artist } = useGetFeaturedArtistsQuery();
    const { data: trendingSongs } = useGetTrendingSongsQuery();
    const { data: newSongs } = useGetNewSongsQuery();
    const { data: topAlbums } = useGetPopularAlbumsQuery();
    const { albums } = topAlbums || {};

    if (!artist | !trendingSongs | !newSongs | !albums) return;

    const mediaData = [
        {
            type: 'Home Artist',
            title: 'Featured artist',
            link: 'artist',
            data: artist,
        },
        {
            type: 'Home Single Song',
            title: 'Trending',
            link: 'trending',
            data: trendingSongs,
        },
        {
            type: 'Home Single Song',
            title: 'New Releases',
            link: 'newrelease',
            data: newSongs,
        },
        {
            type: 'Album',
            title: 'Popular Album',
            link: 'album',
            data: albums,
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
                        media.type.includes('Artist')
                            ? 'grid grid-cols-5'
                            : 'grid grid-cols-[repeat(6,170px)] justify-between'
                    }
                />
            ))}
        </div>
    );
}

export default MediaContainer;
