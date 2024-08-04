import propTypes from 'prop-types';
import { useSong } from '@hooks';
import ChartRow from './ChartRow';
import { useDispatch, useSelector } from 'react-redux';
import { selectCurrentPlaylist } from '@services/selectors';
import { setCurrentPlaylist } from '@features/playlists/slices';

function ChartTable({ tableData }) {
    const dispatch = useDispatch();
    const { type, data } = tableData;

    const currentPlaylist = useSelector(selectCurrentPlaylist);
    const { currentSong, isPlaying, activateSong } = useSong();

    const handlePlayClick = (rowData) => {
        if (!currentPlaylist.id || currentPlaylist.id !== 'chart' + type) {
            dispatch(
                setCurrentPlaylist({
                    id: 'chart' + type,
                    songs: data,
                }),
            );
        }
        activateSong(rowData);
    };
    return (
        <div className="mx-auto mb-28 max-w-7xl rounded-[3rem] border-2 pl-7 pr-10 pt-6 text-[1.325rem]">
            <h3 className="mb-5 font-kodchasan text-3xl font-bold">{type}</h3>
            <div className="grid auto-rows-auto font-bold text-zinc-400">
                {data.map((rowData, index) => {
                    const isOnPlaying = currentSong === rowData.id && isPlaying;
                    const rank = index + 1;
                    return (
                        <ChartRow
                            key={rank}
                            rank={rank}
                            {...rowData}
                            isOnPlaying={isOnPlaying}
                            handlePlayClick={() => handlePlayClick(rowData)}
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
