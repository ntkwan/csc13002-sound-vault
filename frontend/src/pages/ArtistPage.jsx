import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';
import { Loading } from '@components/index';
import {
    useGetFeaturedArtistsQuery,
    useGetArtistsByRegionQuery,
} from '@services/api';

function ArtistPage() {
    const { data: Artists } = useGetFeaturedArtistsQuery();

    const regions = ['V-Pop', 'K-Pop', 'USUK'];
    const { data: artistVPop } = useGetArtistsByRegionQuery(regions[0]);
    const { data: artistKPop } = useGetArtistsByRegionQuery(regions[1]);
    const { data: artistUSUK } = useGetArtistsByRegionQuery(regions[2]);

    if (!Artists | !artistVPop | !artistKPop | !artistUSUK) {
        return <Loading />;
    }

    const mediaData = [
        {
            type: 'Artist Detail',
            title: 'New Artists',
            data: Artists,
        },
        {
            type: 'Artist Detail',
            title: 'Vietnamese Artists',
            data: artistVPop,
        },
        {
            type: 'Artist Detail',
            title: 'Korean Artists',
            data: artistKPop,
        },
        {
            type: 'Artist Detail',
            title: 'US-UK Artists',
            data: artistUSUK,
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
