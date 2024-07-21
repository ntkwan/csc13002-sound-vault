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
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isVerified: {
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
            type: Array,
            default: [],
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

UserSchema.methods.setVerified = async function () {
    this.isVerified = true;
};

UserSchema.methods.setUnverified = async function () {
    this.isVerified = false;
};

UserSchema.methods.getVerification = async function () {
    return this.isVerified;
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

module.exports = mongoose.model('User', UserSchema);
