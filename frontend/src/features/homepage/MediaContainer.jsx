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
            type: 'Artist',
            title: 'Featured artist',
            visibility: '',
            link: 'artist',
            data: artist,
        },
        {
            type: 'Song',
            title: 'Trending',
            visibility: '',
            link: 'trending',
            data: trendingSongs,
        },
        {
            type: 'Song',
            title: 'New Releases',
            visibility: '',
            link: 'newrelease',
            data: newSongs,
        },
        {
            type: 'Album',
            title: 'Popular Album',
            visibility: '',
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
                        media.type === 'Artist'
                            ? 'grid grid-cols-5'
                            : 'grid grid-cols-[repeat(6,170px)] justify-between'
                    }
                />
            ))}
        </div>
    );
}

export default MediaContainer;
