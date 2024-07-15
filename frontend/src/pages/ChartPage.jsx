import { useEffect, useState } from 'react';
import { ChartTable, ChartHeader } from '@features/ranking';
import { useGetChartSongsQuery } from '@services/api';

function ChartPage() {
    const { data: vpopData } = useGetChartSongsQuery('VPop');
    const { data: kpopData } = useGetChartSongsQuery('KPop');
    const { data: usukData } = useGetChartSongsQuery('US-UK');
    const [tableDatas, setTableDatas] = useState([]);
    useEffect(() => {
        if (!vpopData || !kpopData || !usukData) return;
        setTableDatas([
            {
                type: 'V-Pop',
                data: vpopData,
            },
            {
                type: 'K-Pop',
                data: kpopData,
            },
            {
                type: 'US-UK',
                data: usukData,
            },
        ]);
    }, [vpopData, kpopData, usukData]);

    return (
        <div>
            <ChartHeader />
            <h2 className="mx-auto mb-16 w-fit bg-gradient-to-r from-[#FCF2FF] to-[#A31ED2] bg-clip-text px-32 text-center text-5xl font-bold uppercase text-transparent">
                Weekly top 5 rankings
            </h2>
            {tableDatas.map((tableData) => {
                return (
                    <ChartTable key={tableData.type} tableData={tableData} />
                );
            })}
        </div>
    );
}

export default ChartPage;
