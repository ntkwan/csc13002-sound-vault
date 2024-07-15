import { useGetNewSongsQuery } from '@services/api';
import { PageTitle, MediaDisplay, Loading } from '@components';

function NewReleaseBar() {
    const {
        data: newSongs,
        error: newSongsError,
        isLoading: newSongsLoading,
    } = useGetNewSongsQuery();
    if (newSongsLoading) return <Loading />;
    const media = {
        type: 'Song',
        header: '',
        visibility: '',
        link: '',
        data: newSongs,
    };

    return (
        <div className="album-bar pt-8">
            <PageTitle title="New Release" />
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

export default NewReleaseBar;
