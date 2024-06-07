import { MediaDisplay } from "@components";

function MediaContainer() {
    const mediaData = [
        {
            type: "artist",
            header: "Featured Artists",
            visibility: "",
            link: "artist",
            data: [
                { name: "Hoàng Thùy Linh", ext: "jpg" },
                { name: "Phan Mạnh Quỳnh", ext: "jpg" },
                { name: "Obito", ext: "jpg" },
                { name: "HIEUTHUHAI", ext: "jpg" },
                { name: "Anh Tú", ext: "png" },
            ],
        },
        {
            type: "song",
            header: "Trending",
            visibility: "",
            link: "library",
            data: [
                { name: "Ngày mai người ta lấy chồng", desc: "Thành Đạt", ext: "jpg" },
                { name: "Trời giấu trời mang đi", desc: "AMEE", ext: "png" },
                { name: "Duyên mình lỡ", desc: "Hương Tràm", ext: "jpg" },
                { name: "Ngủ một mình", desc: "HIEUTHUHAI", ext: "jpg" },
                { name: "Cô đơn trên sô pha", desc: "Hồ Ngọc Hà", ext: "jpg" },
                { name: "Đom đóm", desc: "J97", ext: "jpg" },
            ],
        },
        {
            type: "song",
            header: "New Release",
            visibility: "",
            link: "library",
            data: [
                { name: "Lucki", desc: "Liu Grace", ext: "jpg" },
                { name: "Heya", desc: "IVE", ext: "jpg" },
                { name: "Thủy Triều", desc: "Quang Hùng MasterD", ext: "jpg" },
                { name: "intro (end of the world)", desc: "Ariana Grande", ext: "jpg" },
                { name: "Buồn hay vui", desc: "VSOUL, MCK, OBITO, RONBOOGZ, BOYZED", ext: "jpg" },
                { name: "Đánh đổi", desc: "Obito", ext: "jpg" },
            ],
        },
        {
            type: "album",
            header: "Top Album",
            visibility: "",
            link: "library",
            data: [
                { name: "Đánh đổi", desc: "Obito", ext: "jpg" },
                { name: "Loi Choi", desc: "Wren Evans", ext: "jpg" },
                { name: "Minh Tinh", desc: "Văn Mai Hương", ext: "jpg" },
                { name: "Ai Cũng Phải Bắt Đầu Từ Đâu Đó", desc: "HIEUTHUHAI", ext: "jpg" },
                { name: "Ái", desc: "tlinh", ext: "jpg" },
                { name: "Vũ Trụ Cò Bay", desc: "Phương Mỹ Chi", ext: "jpg" }
            ],
        },
    ];

    return (
        <div className="Media__container grid auto-rows-auto gap-y-14 mt-20 font-kodchasan">
            {mediaData.map((media, index) => (
                <MediaDisplay
                    key={index} media={media} displayItems="1"
                    displayType={media.header === "Featured Artists" ? "grid grid-cols-5" : "grid grid-cols-6"} />
            ))}
        </div>
    );
}

export default MediaContainer;
