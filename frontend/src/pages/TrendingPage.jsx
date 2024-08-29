import { useGetTrendingSongsQuery } from '@services/api';
import { PageTitle, MediaDisplay } from '@components';

function TrendingBar() {
    const { data: trendingSongs } = useGetTrendingSongsQuery();
    if (!trendingSongs) return;
    const media = {
        type: 'Song',
        title: '',
        visibility: '',
        link: '',
        data: trendingSongs,
    };

    return (
        <div className="album-bar pt-8">
            <PageTitle title="Trending" className="pb-8" />
            <div className="Media__container">
                <MediaDisplay
                    media={media}
                    displayItems="2"
                    displayType="grid grid-cols-6 gap-8"
                />
            </div>
        </div>
    );
}

export default TrendingBar;
