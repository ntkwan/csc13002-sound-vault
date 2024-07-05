import { createTransform } from 'redux-persist';

const playerTransform = createTransform(
    // eslint-disable-next-line no-unused-vars
    (inboundState, key) => {
        return { ...inboundState, isPlaying: false };
    },
    // eslint-disable-next-line no-unused-vars
    (outboundState, key) => {
        return outboundState;
    },
    { whitelist: ['player'] },
);

export default playerTransform;
