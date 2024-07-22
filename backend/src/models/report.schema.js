if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const ReportSchema = new Schema(
    {
        //auto generated
        account: {
            type: objectId,
            ref: 'users',
            required: true,
        },
        contentLink: {
            type: String,
            required: true,
        },

        //user input
        email: {
            type: String,
            required: true,
        },
        fullName: {
            type: String,
            required: true,
        },
        idNumber: {
            type: Number,
            required: true,
        },
        phoneNumber: {
            type: String,
            required: true,
        },
        rpType: {
            type: String,
            required: true,
        },
        rpCategory: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        /*
        document: {
            publicId: {
                type: String,
                required: true,
            },
            url: {
                type: String,
                required: true,
            },
        },
        */
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Report', ReportSchema);
