import { MediaDisplay } from '@components/index';
import Rap from '@assets/img/Rap.jpg';
import Love from '@assets/img/Love.jpg';
import Pop from '@assets/img/Pop.jpg';
import Jazz from '@assets/img/Jazz.jpg';
import RnB from '@assets/img/RnB.jpg';
import Party from '@assets/img/Party.jpg';
import Indie from '@assets/img/Indie.jpg';
import Chill from '@assets/img/Chill.jpg';
import USUK from '@assets/img/USUK.jpg';
import VPop from '@assets/img/Vpop.jpg';
import KPop from '@assets/img/Kpop.jpg';

function TopicsAndGenresPage() {
    const mediaData = [
        {
            type: 'browse',
            title: 'Browse all',
            visibility: '',
            link: '',
            data: [
                {
                    title: 'Rap',
                    imageurl: {
                        url: Rap,
                    },
                    bgColor: '#363636',
                },
                {
                    title: 'Love',
                    imageurl: {
                        url: Love,
                    },
                    bgColor: '#1D3164',
                },
                {
                    title: 'Pop',
                    imageurl: {
                        url: Pop,
                    },
                    bgColor: '#D5A3C7',
                },
                {
                    title: 'Jazz',
                    imageurl: {
                        url: Jazz,
                    },
                    bgColor: '#c93759',
                },
                {
                    title: 'R&B',
                    imageurl: {
                        url: RnB,
                    },
                    bgColor: '#05131b',
                },
                {
                    title: 'Party',
                    imageurl: {
                        url: Party,
                    },
                    bgColor: '#0505057e',
                },
                {
                    title: 'Indie',
                    imageurl: {
                        url: Indie,
                    },
                    bgColor: '#B2B2B2',
                },
                {
                    title: 'Chill',
                    imageurl: {
                        url: Chill,
                    },
                    bgColor: '#dfb43e',
                },
            ],
        },
        {
            type: 'Region',
            title: 'Region',
            visibility: '',
            link: '',
            data: [
                {
                    title: 'US-UK',
                    imageurl: {
                        url: USUK,
                    },
                    bgColor: '#847E9F',
                },
                {
                    title: 'V-Pop',
                    imageurl: {
                        url: VPop,
                    },
                    bgColor: '#e4d5d5',
                },
                {
                    title: 'K-Pop',
                    imageurl: {
                        url: KPop,
                    },
                    bgColor: '#302e2e',
                },
            ],
        },
    ];

    return (
        <div className="topicsgenre relative grid auto-rows-auto gap-y-16 pt-8">
            {mediaData.map((media, index) => (
                <MediaDisplay
                    key={index}
                    media={media}
                    displayItems="3"
                    displayType="grid grid-cols-4 gap-10"
                />
            ))}
        </div>
    );
}

export default TopicsAndGenresPage;
