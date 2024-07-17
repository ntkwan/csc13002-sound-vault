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

    const isSliceArtist = artist && artist.length > 6;
    const isSliceTrending = trendingSongs && trendingSongs.length > 6;
    const isSliceNew = newSongs && newSongs.length > 6;
    const isSliceAlbum = albums && albums.length > 6;

    const mediaData = [
        {
            type: 'Artist',
            title: 'Featured artist',
            visibility: '',
            link: isSliceArtist ? 'artist' : '',
            data: isSliceArtist ? artist.slice(0, 5) : artist,
        },
        {
            type: 'Song',
            title: 'Trending',
            visibility: '',
            link: isSliceTrending ? 'trending' : '',
            data: isSliceTrending ? trendingSongs.slice(0, 6) : trendingSongs,
        },
        {
            type: 'Song',
            title: 'New Releases',
            visibility: '',
            link: isSliceNew ? 'newrelease' : '',
            data: isSliceNew ? newSongs.slice(0, 6) : newSongs,
        },
        {
            type: 'Album',
            title: 'Popular Album',
            visibility: '',
            link: isSliceAlbum ? 'album' : '',
            data: isSliceAlbum ? albums.slice(0, 6) : albums,
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
