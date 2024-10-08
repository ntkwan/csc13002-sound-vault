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
            ref: 'User',
            required: true,
        },
        artist: {
            type: String,
            required: true,
        },
        collaborators: {
            type: Array,
            default: [],
        },
        /*
        album: {
            ref: 'Playlist',
        }
        */
        genre: {
            type: Array,
            default: [],
        },
        region: {
            type: String,
        },
        image: {
            publicId: {
                type: String,
            },
            url: {
                type: String,
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
        isPending: {
            type: Boolean,
            default: false,
        },
        transactionsId: {
            type: String,
            default: '',
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
