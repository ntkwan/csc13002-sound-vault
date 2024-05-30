if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');

const UserSchema = new Schema({
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
    isAdmin: {
        type: Boolean,
        default: false,
    },
});

UserSchema.methods.setPassword = async function (password) {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    this.password = await bcrypt.hash(password, salt);
};

UserSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

UserSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            name: this.name,
            email: this.email,
            isAdmin: this.isAdmin,
        },
        process.env.JWT_KEY,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '1h',
        },
    );
};

module.exports = mongoose.model('User', UserSchema);
