import { useGetPopularAlbumsQuery } from '@services/api';
import { PageTitle, MediaDisplay } from '@components';
import { Loading } from '@components';

function AlbumPage() {
    const { data, isLoading } = useGetPopularAlbumsQuery();

    if (isLoading) return <Loading />;

    const media = {
        type: 'Album',
        header: '',
        visibility: '',
        link: '',
        data: data.albums,
    };

    return (
        <div className="album-bar pt-8">
            <PageTitle title="Top Album" className="pb-8" />
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

export default AlbumPage;
