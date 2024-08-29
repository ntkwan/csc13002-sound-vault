if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const objectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const PaymentSchema = new Schema(
    {
        from: {
            type: objectId,
            ref: 'User',
            required: true,
        },
        to: {
            type: objectId,
            ref: 'User',
            default: null,
        },
        amount: {
            type: Number,
            required: true,
        },
        song: {
            type: String,
            default: '',
        },
        orderId: {
            type: String,
            required: true,
        },
        paymentId: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            default: 'PENDING',
        },
        type: {
            type: String,
            required: true,
        },
        balance: {
            type: Number,
            required: true,
        },
        toBalance: {
            type: Number,
            default: 0,
        },
        expiredAt: {
            type: Date,
        },
        qrCode: {
            type: String,
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model('Payment', PaymentSchema);
