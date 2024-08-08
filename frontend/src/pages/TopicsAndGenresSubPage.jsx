import { useLocation } from 'react-router-dom';
import { PageTitle, MediaDisplay } from '@components/index';
import { useGetChartSongsQuery } from '@services/api';

function TopicsAndGenresSubPage() {
    // get title from current location
    const location = useLocation();
    const { title } = location.state || { title: '' };

    // get data from api
    const type = {
        // browse
        Rap: 'Rap',
        Love: 'Love',
        Pop: 'Pop',
        Jazz: 'Jazz',
        'R&B': 'R&B',
        Party: 'Party',
        Indie: 'Indie',
        Chill: 'Chill',
        // region
        'US-UK': 'US-UK',
        'K-Pop': 'KPop',
        'V-Pop': 'VPop',
    };
    const { data: regionData } = useGetChartSongsQuery(type[title]);

    if (!regionData) return null;
    console.log(regionData);

    const songs = {
        type: 'Song',
        // title: '',
        // visibility: '',
        // link: '',
        data: regionData || [],
    };

    return (
        <div className="topics-and-genre-subpage pt-8">
            <PageTitle title={title} />
            <MediaDisplay
                media={songs}
                displayItems="2"
                displayType="grid grid-cols-6 gap-8"
            />
        </div>
    );
}

export default TopicsAndGenresSubPage;
