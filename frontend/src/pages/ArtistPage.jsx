import MediaDisplay from '@components/MediaDisplay';
import { PageTitle } from '@components/index';

const IMGURL = "https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png";

function ArtistPage() {
    const mediaData = [
        {
            type: 'Artist',
            title: 'Popular Artists',
            visibility: '',
            link: '',
            data: [
                { artist: 'Hoàng Thùy Linh', imageurl: { url: IMGURL } },
                { artist: 'Phan Mạnh Quỳnh', imageurl: { url: IMGURL } },
                { artist: 'Obito', imageurl: { url: IMGURL } },
                { artist: 'HIEUTHUHAI', imageurl: { url: IMGURL } },
                { artist: 'Anh Tú', imageurl: { url: IMGURL } },
                { artist: 'Sơn Tùng MTP', imageurl: { url: IMGURL } },
            ],
        },
        {
            type: 'Artist',
            title: 'Indie Artists',
            visibility: '',
            link: '',
            data: [
                { artist: 'Hoàng Thùy Linh', imageurl: { url: IMGURL } },
                { artist: 'Phan Mạnh Quỳnh', imageurl: { url: IMGURL } },
                { artist: 'Obito', imageurl: { url: IMGURL } },
                { artist: 'HIEUTHUHAI', imageurl: { url: IMGURL } },
                { artist: 'Anh Tú', imageurl: { url: IMGURL } },
                { artist: 'Sơn Tùng MTP', imageurl: { url: IMGURL } },
            ],
        },
        {
            type: 'Artist',
            title: 'New Artists',
            visibility: '',
            link: '',
            data: [
                { artist: 'Hoàng Thùy Linh', imageurl: { url: IMGURL } },
                { artist: 'Phan Mạnh Quỳnh', imageurl: { url: IMGURL } },
                { artist: 'Obito', imageurl: { url: IMGURL } },
                { artist: 'HIEUTHUHAI', imageurl: { url: IMGURL } },
                { artist: 'Anh Tú', imageurl: { url: IMGURL } },
                { artist: 'Sơn Tùng MTP', imageurl: { url: IMGURL } },
            ],
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
