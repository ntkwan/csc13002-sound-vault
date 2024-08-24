if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const PlaylistSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        uploader: {
            type: objectId,
            ref: 'users',
        },
        desc: {
            type: String,
        },
        songs: {
            type: Array,
            default: [],
        },

        isAlbum: {
            type: Boolean,
            default: false,
        },
        image: {
            publicId: {
                type: String,
                default: 'default',
            },
            url: {
                type: String,
                default: process.env.DEFAULT_THUMBNAIL,
            },
        },
    },
    {
        timestamps: true,
    },
);

PlaylistSchema.methods.setPlaylistThumbnail = async function (imageurl) {
    this.image.publicId = imageurl.public_id;
    this.image.url = imageurl.secure_url;
};

module.exports = mongoose.model('Playlist', PlaylistSchema);
