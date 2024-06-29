import MediaDisplay from '@components/MediaDisplay';

function ArtistPage() {
    const mediaData = [
        {
            type: 'artist',
            header: 'Popular Artists',
            visibility: '',
            link: '',
            data: [
                { name: 'Hoàng Thùy Linh', desc: 'artist' },
                { name: 'Phan Mạnh Quỳnh', desc: 'artist' },
                { name: 'Obito', desc: 'artist' },
                { name: 'HIEUTHUHAI', desc: 'artist' },
                { name: 'Anh Tú', desc: 'artist', ext: 'png' },
                { name: 'Sơn Tùng MTP', desc: 'artist' },
            ],
        },
        {
            type: 'artist',
            header: 'Indie Artists',
            visibility: '',
            link: '',
            data: [
                { name: 'Hoàng Thùy Linh', desc: 'artist' },
                { name: 'Phan Mạnh Quỳnh', desc: 'artist' },
                { name: 'Obito', desc: 'artist' },
                { name: 'HIEUTHUHAI', desc: 'artist' },
                { name: 'Anh Tú', desc: 'artist', ext: 'png' },
                { name: 'Sơn Tùng MTP', desc: 'artist' },
            ],
        },
        {
            type: 'artist',
            header: 'New Artists',
            visibility: '',
            link: '',
            data: [
                { name: 'Hoàng Thùy Linh', desc: 'artist' },
                { name: 'Phan Mạnh Quỳnh', desc: 'artist' },
                { name: 'Obito', desc: 'artist' },
                { name: 'HIEUTHUHAI', desc: 'artist' },
                { name: 'Anh Tú', desc: 'artist', ext: 'png' },
                { name: 'Sơn Tùng MTP', desc: 'artist' },
            ],
        },
    ];

    return (
        <div className="Media__container mt-20 grid auto-rows-auto gap-y-14 font-kodchasan">
            {mediaData.map((media, index) => (
                <MediaDisplay
                    key={index}
                    media={media}
                    displayItems="2"
                    displayType="grid grid-cols-6"
                />
            ))}
        </div>
    );
}

export default ArtistPage;
