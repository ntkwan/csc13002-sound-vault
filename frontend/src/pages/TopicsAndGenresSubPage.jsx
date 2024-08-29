import { useLocation } from 'react-router-dom';
import { PageTitle, MediaDisplay } from '@components';
import { useGetChartSongsQuery, useGetSongsByGenreQuery } from '@services/api';

const regions = ['US-UK', 'K-Pop', 'V-Pop'];
const genres = ['Pop', 'R&B', 'Jazz', 'Rap', 'Indie', 'Chill', 'Party', 'Love'];

function TopicsAndGenresSubPage() {
    // get title from current location
    const location = useLocation();
    const { title } = location.state || { title: '' };
    const { data: regionData } = useGetChartSongsQuery(
        title === 'US-UK' ? 'USUK' : title,
        {
            skip: !title || !regions.includes(title),
        },
    );

    const { data: genreSongs } = useGetSongsByGenreQuery(title, {
        skip: !title || !genres.includes(title),
    });

    const songs = {
        type: 'Song',
        data: genreSongs || regionData || [],
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
