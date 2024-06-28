import MediaDisplay from "@components/MediaDisplay";
import { PageTitle } from "@components/index";

function ArtistPage() {
  const mediaData = [
    {
      type: "Artist",
      title: "Popular Artists",
      visibility: "",
      link: "",
      data: [
        { name: "Hoàng Thùy Linh" },
        { name: "Phan Mạnh Quỳnh" },
        { name: "Obito" },
        { name: "HIEUTHUHAI" },
        { name: "Anh Tú", ext: "png" },
        { name: "Sơn Tùng MTP" },
      ],
    },
    {
      type: "Artist",
      title: "Indie Artists",
      visibility: "",
      link: "",
      data: [
        { name: "Hoàng Thùy Linh" },
        { name: "Phan Mạnh Quỳnh" },
        { name: "Obito" },
        { name: "HIEUTHUHAI" },
        { name: "Anh Tú", ext: "png" },
        { name: "Sơn Tùng MTP" },
      ],
    },
    {
      type: "Artist",
      title: "New Artists",
      visibility: "",
      link: "",
      data: [
        { name: "Hoàng Thùy Linh" },
        { name: "Phan Mạnh Quỳnh" },
        { name: "Obito" },
        { name: "HIEUTHUHAI" },
        { name: "Anh Tú", ext: "png" },
        { name: "Sơn Tùng MTP" },
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
    </div >
  );
}

export default ArtistPage;
