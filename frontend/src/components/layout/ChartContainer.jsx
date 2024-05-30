import chart from "@assets/img/chart.svg";
import ChartTable from "@components/common/ChartTable";
const tablesData = [
  {
    country: "Vietnam",
    data: [
      {
        rank: 1,
        song: "Chúng Ta Của Sau Này",
        artist: "Sơn Tùng MTP",
        view: "10.034.345",
      },
      {
        rank: 2,
        song: "Lệ Lưu Ly",
        artist: "Vũ Phụng Tiên, DT Tập Rap, Drum7",
        view: "5.001.000",
      },
      {
        rank: 3,
        song: "Nâng Chén Tiêu Sầu",
        artist: "Bích Phương",
        view: "4.007.076",
      },
      {
        rank: 4,
        song: "Hà Nội",
        artist: "Obito, VSTRA, Shiki",
        view: "3.987.566",
      },
      {
        rank: 5,
        song: "đừng làm nó phức tạp",
        artist: "tlinh",
        view: "2.455.889",
      },
    ],
  },
  {
    country: "US-UK",
    data: [
      {
        rank: 1,
        song: "Fortnight",
        artist: "Taylor Swift",
        view: "10.034.345",
      },
      {
        rank: 2,
        song: "A Bar Song (Tipsy)",
        artist: "Shaboozey",
        view: "5.001.000",
      },
      {
        rank: 3,
        song: "Espresso",
        artist: "Sabriana Carpenter",
        view: "4.007.076",
      },
      {
        rank: 4,
        song: "Too Sweet",
        artist: "Hozier",
        view: "3.987.566",
      },
      {
        rank: 5,
        song: "Like That",
        artist: "Future, Metro Boomin, Kendrick Lamar",
        view: "2.455.889",
      },
    ],
  },
  {
    country: "K-POP",
    data: [
      {
        rank: 1,
        song: "SPOT!",
        artist: "ZICO, JENNIE",
        view: "10.034.345",
      },
      {
        rank: 2,
        song: "Magnetic",
        artist: "ILLIT",
        view: "5.001.000",
      },
      {
        rank: 3,
        song: "HEYA",
        artist: "IVE",
        view: "4.007.076",
      },
      {
        rank: 4,
        song: "Fate",
        artist: "(G)I-DLE",
        view: "3.987.566",
      },
      {
        rank: 5,
        song: "T.B.H",
        artist: "QWER",
        view: "2.455.889",
      },
    ],
  },
];

function ChartContainer() {
  return (
    <div className="chart m-8 text-lg">
      <div className="chart__info m-20 self-center">
        <div className="flex flex-col-reverse min-[1264px]:flex-row">
          <p className="flex-1 font-kodchasan font-bold">
            SoundVault Chart is a dynamic music ranking chart based on the
            number of listeners. It tracks the most popular songs across various
            genres, reflecting real-time listening habits and trends
          </p>
          <h1 className="heading-stroke -mb-3 flex-1 font-italianno text-[6.25rem] leading-none drop-shadow-[0_4px_4px_#00000040] min-[1264px]:text-right">
            SoundVault Chart
          </h1>
        </div>
        <p className="pt-2 font-kodchasan font-medium xl:text-right ">
          Chart dated May 19, 2024
        </p>
      </div>

      <div className="chart__content mx-16 my-8">
        <h2 className="my-12 flex items-center justify-items-start gap-4 font-kodchasan text-3xl font-bold uppercase text-[#EAAEFF]">
          <img src={chart} alt="Chart icon" />
          Weekly top 5 rankings
        </h2>
        <div className="chart__tables grid auto-rows-auto gap-20">
          {tablesData.map((tableData) => (
            <ChartTable key={tableData.country} tableData={tableData} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChartContainer;
