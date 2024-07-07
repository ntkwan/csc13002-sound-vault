import { MediaDisplay } from '@components';

function MediaContainer() {
    const mediaData = [
        {
            type: 'Artist',
            title: 'Featured Artists',
            visibility: '',
            link: 'artist',
            data: [
                {
                    artist: 'Hoàng Thùy Linh',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'Phan Mạnh Quỳnh',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'Obito',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'HIEUTHUHAI',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
                {
                    artist: 'Anh Tú',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                },
            ],
        },
        {
            type: 'Song',
            title: 'Trending',
            visibility: '',
            link: 'library',
            data: [
                {
                    title: 'Ngày Mai Người Ta Lấy Chồng',
                    artist: 'Thành Đạt',
                    genre: 'Pop',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352623/tracks/ngaymainguoitalaychong-thanhdat.mp3',
                    view: 0,
                },
                {
                    title: 'trời giấu trời mang đi',
                    artist: 'AMEE',
                    genre: 'Pop',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352422/tracks/troigiautroimangdi-amee.mp3',
                    view: 0,
                },
                {
                    title: 'Duyên Mình Lỡ',
                    artist: 'Hương Tràm',
                    genre: 'Pop',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720352815/tracks/duyenminhlo-huongtram.mp3',
                    view: 0,
                },
                {
                    title: 'ngủ một mình',
                    artist: 'HIEUTHUHAI',
                    genre: 'Rap',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720353266/tracks/ngumotminh-hieuthuhai.mp3',
                    view: 0,
                },
                {
                    title: 'Cô Đơn Trên Sofa',
                    artist: 'Hồ Ngọc Hà',
                    genre: 'Pop',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720353414/tracks/codontrensofa-hongocha.mp3',
                    view: 0,
                },
                {
                    title: 'Đom Đóm',
                    artist: 'J97',
                    genre: 'Pop',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720353558/tracks/domdom-j97.mp3',
                    view: 0,
                },
            ],
        },
        {
            type: 'Song',
            title: 'New Release',
            visibility: '',
            link: 'library',
            data: [
                {
                    title: 'Lucki',
                    artist: 'Liu Grace',
                    genre: 'Rap',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720353701/tracks/lucki-liugrace.mp3',
                    view: 0,
                },
                // {
                //     title: 'Heya',
                //     desc: 'IVE'
                // },
                // {
                //     title: 'Thủy Triều',
                //     artist: 'Quang Hùng MasterD'
                // },
                // {
                //     title: 'intro (end of the world)',
                //     artist: 'Ariana Grande'
                // },
                // {
                //     name: 'Buồn hay vui',
                //     artist: 'VSOUL, MCK, OBITO, RONBOOGZ, BOYZED',
                // },
                {
                    title: 'Đánh đổi',
                    artist: 'Obito',
                    genre: 'Rap',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720379651/tracks/danhdoi-obito.mp3',
                    view: 0,
                },
            ],
        },
        {
            type: 'Album',
            title: 'Top Album',
            visibility: '',
            link: 'library',
            data: [
                {
                    title: 'Đánh đổi',
                    artist: 'Obito',
                    genre: 'Rap',
                    imageurl:
                        'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png',
                    audiourl:
                        'https://res.cloudinary.com/drnwr3wz8/video/upload/v1720379651/tracks/danhdoi-obito.mp3',
                    view: 0,
                },
                // { name: 'Loi Choi', desc: 'Wren Evans' },
                // { name: 'Minh Tinh', desc: 'Văn Mai Hương' },
                // { name: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó', desc: 'HIEUTHUHAI' },
                // { name: 'Ái', desc: 'tlinh' },
                // { name: 'Vũ Trụ Cò Bay', desc: 'Phương Mỹ Chi' },
            ],
        },
    ];

    return (
        <div className="Media__container mt-20 grid auto-rows-auto gap-y-14 font-kodchasan">
            {mediaData.map((media, index) => (
                <MediaDisplay
                    key={index}
                    media={media}
                    displayItems="1"
                    displayType={
                        media.title === 'Featured Artists'
                            ? 'grid grid-cols-5'
                            : 'grid grid-cols-6'
                    }
                />
            ))}
        </div>
    );
}

export default MediaContainer;
