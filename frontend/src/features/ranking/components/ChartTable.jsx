import propTypes from 'prop-types';
import ChartRow from './ChartRow';

function ChartTable({ tableData }) {
    const { type, data } = tableData;
    return (
        <div className="mx-auto mb-28 max-w-7xl rounded-[3rem] border-2 pl-7 pr-10 pt-6 text-[1.325rem]">
            <h3 className="mb-5 font-kodchasan text-3xl font-bold">{type}</h3>
            <div className="grid auto-rows-auto font-bold text-zinc-400">
                {data.map((rowData, index) => {
                    const rank = index + 1;
                    return (
                        <ChartRow
                            key={rank}
                            rank={rank}
                            {...rowData}
                        />
                    );
                })}
            </div>
        </div>
    );
}

ChartTable.propTypes = {
    tableData: propTypes.object.isRequired,
};


export default ChartTable;