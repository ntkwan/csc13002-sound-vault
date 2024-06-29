import propTypes from 'prop-types';

function ChartTable({ tableData }) {
    const { type, data } = tableData;
    return (
        <div className="mx-auto mb-28 max-w-7xl rounded-[3rem] border-2 pl-7 pr-10 pt-6 text-[1.325rem]">
            <h3 className="mb-3 font-kodchasan text-3xl font-bold">{type}</h3>
            <div className="grid auto-rows-auto font-bold text-zinc-400">
                {data.map((rowData) => {
                    return <ChartRow key={rowData.rank} {...rowData} />;
                })}
            </div>
        </div>
    );
}

ChartTable.propTypes = {
    tableData: propTypes.object.isRequired,
};

export default ChartTable;

function ChartRow({ rank, img, song, artist, view }) {
    return (
        <div className="mb-4 ml-3 flex items-center">
            <p className="mr-7 w-1">{rank}</p>
            <img
                src={img}
                alt="song cover"
                className="mr-3 aspect-square size-[4.5rem]"
            />
            <p className="flex-auto basis-60 font-normal text-white">{song}</p>
            <p className="flex-auto">{artist}</p>
            <span className="w-32">{view}</span>
        </div>
    );
}

ChartRow.propTypes = {
    rank: propTypes.number,
    img: propTypes.string,
    song: propTypes.string,
    artist: propTypes.string,
    view: propTypes.string,
    props: propTypes.string,
};
