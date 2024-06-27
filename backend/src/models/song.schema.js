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
    img: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Song', SongSchema);
