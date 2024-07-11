import { MediaDisplay } from '@components';
import { Loading } from '@components/index';
import {
    useGetFeaturedArtistsQuery,
    useGetTrendingSongsQuery,
    useGetNewSongsQuery,
} from '@services/api';

function MediaContainer() {
    const { data: Artists, isLoading: featuredArtistsLoading } =
        useGetFeaturedArtistsQuery();
    const { data: trendingSongs, isLoading: trendingSongsLoading } =
        useGetTrendingSongsQuery();
    const { data: newSongs, isLoading: newSongsLoading } =
        useGetNewSongsQuery();

    if (featuredArtistsLoading || trendingSongsLoading || newSongsLoading)
        return <Loading />;

    const isSliceArtist = Artists && Artists.length > 6;
    const isSliceTrending = trendingSongs && trendingSongs.length > 6;
    const isSliceNew = newSongs && newSongs.length > 6;
    const isSliceAlbum = trendingSongs && trendingSongs.length > 6;

    const mediaData = [
        {
            type: 'Artist',
            title: 'Featured Artists',
            visibility: '',
            link: isSliceArtist ? 'artist' : '',
            data: isSliceArtist ? Artists.slice(0, 5) : Artists,
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
            title: 'Top Album',
            visibility: '',
            link: isSliceAlbum ? 'album' : '',
            data: isSliceAlbum ? trendingSongs.slice(0, 6) : trendingSongs,
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
