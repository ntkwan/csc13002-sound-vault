import { useGetNewSongsQuery } from '@services/api';
import { PageTitle, MediaDisplay } from '@components';

function NewReleaseBar() {
    const { data: newSongs } = useGetNewSongsQuery();
    if (!newSongs) return;
    const media = {
        type: 'Single Song',
        title: '',
        visibility: '',
        link: '',
        data: newSongs,
    };

    return (
        <div className="album-bar pt-8">
            <PageTitle title="New Releases" />
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
