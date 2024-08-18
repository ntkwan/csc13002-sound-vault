import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';
import { useGetFeaturedArtistsQuery } from '@services/api';

function ArtistPage() {
    const { data: Artists } = useGetFeaturedArtistsQuery();
    if (!Artists) return;
    const mediaData = [
        {
            type: 'Artist',
            title: 'Popular Artists',
            visibility: '',
            link: '',
            data: Artists.slice(0, 6),
        },
        {
            type: 'Artist',
            title: 'Indie Artists',
            visibility: '',
            link: '',
            data: Artists.slice(6, 12),
        },
        {
            type: 'Artist',
            title: 'New Artists',
            visibility: '',
            link: '',
            data: Artists.slice(-6),
        },
    ];

    return (
        <div className="pt-4">
            <PageTitle title="Artists" />
            <div className="Media__container grid auto-rows-auto gap-y-14 font-kodchasan">
                {mediaData.map((media, index) => (
                    <MediaDisplay
                        key={index}
                        media={media}
                        displayItems="2"
                        displayType="grid grid-cols-6"
                    />
                ))}
            </div>
        </div>
    );
}

export default ArtistPage;
