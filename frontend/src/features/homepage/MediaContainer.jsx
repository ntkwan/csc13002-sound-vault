import { MediaDisplay } from '@components';

function MediaContainer() {
    const mediaData = [
        {
            type: 'artist',
            header: 'Featured Artists',
            visibility: '',
            link: 'artist',
            data: [
                { name: 'Hoàng Thùy Linh' },
                { name: 'Phan Mạnh Quỳnh' },
                { name: 'Obito' },
                { name: 'HIEUTHUHAI' },
                { name: 'Anh Tú', ext: 'png' },
            ],
        },
        {
            type: 'song',
            header: 'Trending',
            visibility: '',
            link: 'library',
            data: [
                { name: 'Ngày mai người ta lấy chồng', desc: 'Thành Đạt' },
                { name: 'Trời giấu trời mang đi', desc: 'AMEE', ext: 'png' },
                { name: 'Duyên mình lỡ', desc: 'Hương Tràm' },
                { name: 'Ngủ một mình', desc: 'HIEUTHUHAI' },
                { name: 'Cô đơn trên sô pha', desc: 'Hồ Ngọc Hà' },
                { name: 'Đom đóm', desc: 'J97' },
            ],
        },
        {
            type: 'song',
            header: 'New Release',
            visibility: '',
            link: 'library',
            data: [
                { name: 'Lucki', desc: 'Liu Grace' },
                { name: 'Heya', desc: 'IVE' },
                { name: 'Thủy Triều', desc: 'Quang Hùng MasterD' },
                { name: 'intro (end of the world)', desc: 'Ariana Grande' },
                {
                    name: 'Buồn hay vui',
                    desc: 'VSOUL, MCK, OBITO, RONBOOGZ, BOYZED',
                },
                { name: 'Đánh đổi', desc: 'Obito' },
            ],
        },
        {
            type: 'album',
            header: 'Top Album',
            visibility: '',
            link: 'library',
            data: [
                { name: 'Đánh đổi', desc: 'Obito' },
                { name: 'Loi Choi', desc: 'Wren Evans' },
                { name: 'Minh Tinh', desc: 'Văn Mai Hương' },
                { name: 'Ai Cũng Phải Bắt Đầu Từ Đâu Đó', desc: 'HIEUTHUHAI' },
                { name: 'Ái', desc: 'tlinh' },
                { name: 'Vũ Trụ Cò Bay', desc: 'Phương Mỹ Chi' },
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
                        media.header === 'Featured Artists'
                            ? 'grid grid-cols-5'
                            : 'grid grid-cols-6'
                    }
                />
            ))}
        </div>
    );
}

export default MediaContainer;
