import { ChartTable, ChartHeader } from '@features/ranking';

const tableDatas = [
    {
        type: 'V-Pop',
        data: [
            {
                rank: 1,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '10.222.333',
            },
            {
                rank: 2,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 3,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 4,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 5,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
        ],
    },
    {
        type: 'US-UK',
        data: [
            {
                rank: 1,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 2,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 3,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 4,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 5,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
        ],
    },
    {
        type: 'K-Pop',
        data: [
            {
                rank: 1,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 2,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 3,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 4,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
            {
                rank: 5,
                img: 'https://imgs.search.brave.com/0GGD-QY6FQuk8GaB87rCGPy0DdLbjb_KqEVfTNLNTPc/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9pbWcu/eW91dHViZS5jb20v/dmkvbGxmX0wwaTlP/ZEEvMC5qcGc',
                song: 'Sai Gon',
                artist: 'HIEUTHUHAI',
                view: '1.2M',
            },
        ],
    },
];

function ChartPage() {
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
