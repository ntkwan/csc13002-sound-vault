import { useGetNewSongsQuery } from "@services/api";
import { PageTitle, MediaDisplay, Loading } from "@components";

function AlbumPage() {
    const { data: newSongs, error: newSongsError, isLoading: newSongsLoading } = useGetNewSongsQuery();
    if (newSongsLoading) return <Loading />;
    const media = {
        type: "Album",
        header: "",
        visibility: "",
        link: "",
        data: newSongs,
    };

    return (
        <div className="album-bar pt-8">
            <PageTitle title="Top Album" className="pb-8" />
            <div className="Media__container">
                <MediaDisplay
                    media={media}
                    displayItems="2"
                    displayType="grid grid-cols-[repeat(6,_max-content)] gap-8"
                />
            </div>
        </div>
    );
};

export default AlbumPage;