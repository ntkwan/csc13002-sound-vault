import React from 'react';
import { MediaDisplay } from '@components/index';

const IMGURL =
    'https://res.cloudinary.com/drnwr3wz8/image/upload/v1719574528/default.png';

function TopicsAndGenrePage() {
    const mediaData = [
        {
            type: 'browse',
            title: 'Browse all',
            visibility: '',
            link: '',
            data: [
                {
                    title: 'RAP',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#AF2896',
                },
                {
                    title: 'LOVE',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#1D3164',
                },
                {
                    title: 'POP',
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
            title: 'Browse all',
            visibility: '',
            link: '',
            data: [
                {
                    title: 'USUK',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#847E9F',
                },
                {
                    title: 'V-POP',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#643F1D',
                },
                {
                    title: 'K-POP',
                    imageurl: {
                        url: IMGURL,
                    },
                    bgColor: '#007F42',
                },
            ],
        },
    ];

    return (
        <div className="explorepage relative grid auto-rows-auto gap-y-16">
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

export default TopicsAndGenrePage;
