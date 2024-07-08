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
        image: {
            publicId: {
                type: String,
            },
            url: {
                type: String,
            },
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

SongSchema.methods.setSongThumbnail = async function (imageurl) {
    this.image.publicId = imageurl.public_id;
    this.image.url = imageurl.secure_url;
};

module.exports = mongoose.model('Song', SongSchema);
