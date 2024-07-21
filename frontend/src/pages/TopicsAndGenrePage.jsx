import React from 'react';
import { MediaDisplay } from '@components/index';

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
                        url: '',
                    },
                },
                {
                    title: 'LOVE',
                    imageurl: {
                        url: '',
                    },
                },
                {
                    title: 'POP',
                    imageurl: {
                        url: '',
                    },
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
                        url: '',
                    },
                },
                {
                    title: 'V-POP',
                    imageurl: {
                        url: '',
                    },
                },
                {
                    title: 'K-POP',
                    imageurl: {
                        url: '',
                    },
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
                    displayType="grid grid-cols-6 gap-10"
                />
            ))}
        </div>
    );
}

export default TopicsAndGenrePage;
