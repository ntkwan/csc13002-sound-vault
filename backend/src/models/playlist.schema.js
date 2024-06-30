const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    user: {
        ref: 'User',
        required: true,
    },
    desc: {
        type: String,
    },
    songs: {
        type: Array,
        default: [],
    },
    img: {
        type: String,
    },
});

module.exports = mongoose.model('Playlist', PlaylistSchema);
