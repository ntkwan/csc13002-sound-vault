import star from "../../assets/img/star.svg";
import headphone from "../../assets/img/headphone.svg";

function ChartTable({ tableData }) {
  const { country, data } = tableData;

  return (
    <div className="chart__table">
      <h3 className="m-4 ml-10 flex items-center justify-items-start gap-3 font-kodchasan text-xl uppercase italic">
        <img src={headphone} alt="Headphone icon" />
        {country}
      </h3>
      <div className="grid auto-rows-auto">
        <div className="grid grid-cols-12 border-b-[2.5px] border-b-[#DFE1E6] py-3.5 font-kodchasan text-base font-bold uppercase">
          <img src={star} alt="Star icon" />
          <p className="col-span-4">Song name</p>
          <p className="col-span-4">Artist</p>
          <p className="col-span-3">View</p>
        </div>
        {data.map((row_data) => {
          const { rank, song, artist, view } = row_data;
          const props = rank === 5 ? "border-b border-b-[#DFE1E6]" : "";

          return ChartRow(rank, song, artist, view, props);
        })}
      </div>
    </div>
  );
}

export default ChartTable;

function ChartRow(rank, song, artist, view, props) {
  return (
    <div className={`grid grid-cols-12 py-4 font-montserrat ${props}`}>
      <p className="pl-1">{rank}</p>
      <p className="col-span-4">{song}</p>
      <a href="#" className="col-span-4 text-[#2F65DD]">
        {artist}
      </a>
      <span className="col-span-3 flex w-min items-center rounded-[0.1875rem] bg-[#ECFFEE66] px-3 py-0.5 text-sm font-bold text-[#F0AFFB]">
        {view}
      </span>
    </div>
  );
}
