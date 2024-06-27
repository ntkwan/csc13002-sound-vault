const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    artist: {
        type: String,
        required: true,
    },
    song: {
        type: String,
        required: true,
    },
    imageurl: {
        type: String,
        required: true,
    },
    audiourl: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    view: {
        type: Number,
        default: 0,
    },
});

module.exports = mongoose.model('Song', SongSchema);
