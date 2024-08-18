import { MediaDisplay } from '@components/index';

const IMGURL =
    'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png';

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
                        url: IMGURL,
                    },
                    bgColor: '#AF2896',
                },
                {
                    title: 'Love',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#1D3164',
                },
                {
                    title: 'Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#D5A3C7',
                },
                {
                    title: 'Jazz',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#B2B2B2',
                },
                {
                    title: 'R&B',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#AF2848',
                },
                {
                    title: 'Party',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#B9B326',
                },
                {
                    title: 'Indie',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#27856A',
                },
                {
                    title: 'Chill',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#655192',
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
                        url: IMGURL,
                    },
                    bgColor: '#847E9F',
                },
                {
                    title: 'V-Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#643F1D',
                },
                {
                    title: 'K-Pop',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#007F42',
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
