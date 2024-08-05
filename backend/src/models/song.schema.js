if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const SongSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
        },
        uploader: {
            type: objectId,
            ref: 'users',
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        /*
        album: {
            ref: 'Playlist',
        }
        */
        releaseDate: {
            type: Date,
        },
        genre: {
            type: String,
        },
        region: {
            type: String,
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
        coverimg: {
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
        view: {
            type: Number,
            default: 0,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isDisabled: {
            type: Boolean,
            default: false,
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

SongSchema.methods.setSongCover = async function (imageurl) {
    this.coverimg.publicId = imageurl.public_id;
    this.coverimg.url = imageurl.secure_url;
};

SongSchema.methods.increaseView = async function () {
    this.view += 1;
};

SongSchema.methods.decreaseView = async function () {
    this.view -= 1;
};

SongSchema.methods.setRegion = async function (region) {
    this.region = region;
};

SongSchema.methods.setUploader = async function (uploader) {
    this.uploader = uploader;
};

module.exports = mongoose.model('Song', SongSchema);
