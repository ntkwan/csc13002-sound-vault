const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SongSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        /*
        uploader: {
            ref: 'User',
            required: true,
        },
        */
        artist: {
            type: String,
            required: true,
        },
        /*
        album: {
            ref: 'Playlist',
        }
        */
        genre: {
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
        /*
    duration: {
        type: String,
        required: true,
    },
    */
        view: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Song', SongSchema);
