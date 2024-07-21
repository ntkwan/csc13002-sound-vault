if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const BlacklistSchema = new Schema(
    {
        account: {
            type: objectId,
            ref: 'users',
            required: true,
        },
        expireDate: {
            type: Date,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Blacklist', BlacklistSchema);
