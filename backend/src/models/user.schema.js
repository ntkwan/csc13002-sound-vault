if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        },
        password: {
            type: String,
            required: true,
        },
        image: {
            publicId: {
                type: String,
                default: 'avatar-default',
            },
            url: {
                type: String,
                default: process.env.DEFAULT_AVATAR,
            },
        },
        coverimage: {
            publicId: {
                type: String,
            },
            url: {
                type: String,
            },
        },
        shortDesc: {
            type: String,
            default: '',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isBanned: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        followers: {
            type: Array,
            default: [],
        },
        following: {
            type: Array,
            default: [],
        },
        playlist: {
            type: [Schema.Types.ObjectId],
            ref: 'Playlist',
            default: [],
        },
        recentlyPlayed: {
            type: Array,
            default: [],
        },
        balance: {
            type: Number,
            default: 0,
        },
        bankInfo: {
            bankId: {
                type: String,
                default: '',
            },
            accountNo: {
                type: String,
                default: '',
            },
            accountName: {
                type: String,
                default: '',
            },
        },
        publicAddress: {
            type: String,
            default: '',
        },
    },
    {
        timestamps: true,
    },
);

UserSchema.methods.setPassword = async function (password) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.setProfilePicture = async function (imageurl) {
    this.image.publicId = imageurl.public_id;
    this.image.url = imageurl.secure_url;
};

UserSchema.methods.setCoverPicture = async function (imageurl) {
    this.coverimage.publicId = imageurl.public_id;
    this.coverimage.url = imageurl.secure_url;
};

UserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin,
        },
        process.env.ACCESS_KEY,
        {
            expiresIn: process.env.ACCESS_KEY_EXPIRES_IN || '1h',
        },
    );
};

UserSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_KEY,
        {
            expiresIn: process.env.REFRESH_KEY_EXPIRES_IN || '1d',
        },
    );
};

UserSchema.methods.addToRecentlyPlayed = async function (songId) {
    if (this.recentlyPlayed.includes(songId)) {
        this.recentlyPlayed = this.recentlyPlayed.filter(
            (id) => id.toString() !== songId,
        );
    }

    if (this.recentlyPlayed.length === 10) {
        this.recentlyPlayed.pop();
    }

    this.recentlyPlayed.unshift(songId);
};

UserSchema.methods.removeFromRecentlyPlayed = async function (songId) {
    this.recentlyPlayed = this.recentlyPlayed.filter(
        (id) => id.toString() !== songId,
    );
};

UserSchema.methods.createLikedPlaylist = async function () {
    const Playlist = mongoose.model('Playlist');
    const playlist = new Playlist({
        name: 'Liked Songs',
        desc: 'All your liked songs',
        uploader: this._id,
    });
    this.playlist.unshift(playlist._id);
    await playlist.save();
    await this.save();
};

UserSchema.methods.addToLikedSongs = async function (songId) {
    const Playlist = mongoose.model('Playlist');
    let playlist = await Playlist.findById(this.playlist[0]);
    if (!playlist) {
        await this.createLikedPlaylist();
        playlist = await Playlist.findById(this.playlist[0]);
    }
    const addedSong = playlist.songs.find((id) => id.toString() === songId);
    if (addedSong) {
        throw new Error('Song already added to liked songs');
    }
    playlist.songs.push(songId);
    await playlist.save();
};

UserSchema.methods.removeFromLikedSongs = async function (songId) {
    const Playlist = mongoose.model('Playlist');
    const playlist = await Playlist.findById(this.playlist[0]);
    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();
};

module.exports = mongoose.model('User', UserSchema);
