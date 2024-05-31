import MediaDisplay from "../common/MediaDisplay";

const mediaData = [
    {
        src: "src/assets/img/artist/",
        header: "Featured Artists",
        descript: '',
        isLink: true,
        data: [
            { name: "Hoàng Thùy Linh" },
            { name: "Phan Mạnh Quỳnh" },
            { name: "Obito" },
            { name: "HIEUTHUHAI" },
            { name: "Anh Tú" },
        ],
    },
    {
        src: "src/assets/img/song/",
        header: "Trending",
        descript: '',
        isLink: true,
        data: [
            { name: "Ngày mai người ta lấy chồng", artist: "Thành Đạt" },
            { name: "Trời giấu trời mang đi", artist: "AMEE" },
            { name: "Duyên mình lỡ", artist: "Hương Tràm" },
            { name: "Ngủ một mình", artist: "HIEUTHUHAI" },
            { name: "Cô đơn trên sô pha", artist: "Hồ Ngọc Hà" },
            { name: "Đom đóm", artist: "J97" },
        ],
    },
    {
        src: "src/assets/img/song/",
        header: "New Release",
        descript: '',
        isLink: true,
        data: [
            { name: "Lucki", artist: "Liu Grace" },
            { name: "Heya", artist: "IVE" },
            { name: "Thủy Triều", artist: "Quang Hùng MasterD" },
            { name: "intro (end of the world)", artist: "Ariana Grande" },
            { name: "Buồn hay vui", artist: "VSOUL, MCK, OBITO, RONBOOGZ, BOYZED" },
            { name: "Đánh đổi", artist: "Obito" },
        ],
    },
    {
        src: "src/assets/img/album/",
        header: "Top Album",
        descript: '',
        isLink: true,
        data: [
            { name: "Đánh đổi", artist: "Obito" },
            { name: "Loi Choi", artist: "Wren Evans" },
            { name: "Minh Tinh", artist: "Văn Mai Hương" },
            { name: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó", artist: "HIEUTHUHAI" },
            { name: "Ái", artist: "tlinh" },
            { name: "Vũ Trụ Cò Bay", artist: "Phương Mỹ Chi" }
        ],
    },
];

function MediaContainer() {

    return (
        <div className="Media__container grid auto-rows-auto gap-y-14 font-kodchasan">
            {mediaData.map((media) => {
                if (media.header === "Featured Artists")
                    return <MediaDisplay media={media} displayType="grid grid-cols-5 justify-items-center mt-4" />
                return <MediaDisplay media={media} displayType="grid grid-cols-6 justify-items-center mt-4" />
            })}
        </div>
    );
}

export default MediaContainer;
