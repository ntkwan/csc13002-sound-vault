if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const mongoose = require('mongoose');
const moment = require('moment');
const schedule = require('node-schedule');
const PaymentModel = require('../models/payment.schema');
const UserModel = require('../models/user.schema');
const payos = require('../utils/payos');
const axios = require('../utils/axios');

const DEPOSIT = 'deposit';
const WITHDRAW = 'withdraw';
const DONATE = 'donate';
const PENDING = 'PENDING';
const PAID = 'PAID';
const CANCELLED = 'CANCELLED';
const TEMPLATE = 'shqQiya';

const confirm_webhook_payos = async (req, res) => {
    const { webhookUrl } = req.body;
    try {
        const response = await payos.confirmWebhook(webhookUrl);
        return res.status(200).json({
            code: 1,
            message: response,
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const receive_webhook_payos = async (req, res) => {
    const webhookData = payos.verifyPaymentWebhookData(req.body);
    if (!webhookData) {
        return res.status(400).json({
            code: -1,
            message: 'Invalid webhook data',
        });
    }
    if (
        ['Ma giao dich thu nghiem', 'VQRIO123'].includes(
            webhookData.description,
        )
    ) {
        return res.status(200).json({
            code: 1,
            message: 'Success',
        });
    }
    const { orderCode, code, amount } = webhookData;
    try {
        const payment = await PaymentModel.findOne({ orderId: orderCode });
        if (!payment) {
            return res.status(404).json({
                code: -1,
                message: 'Payment not found',
            });
        }
        if (code !== '00') {
            payment.status = CANCELLED;
            await payment.save();
            return res.status(400).json({
                code: -1,
                message: 'Payment failed',
            });
        }
        const user = await UserModel.findById(payment.from);

        user.balance += amount;
        await user.save();
        payment.status = PAID;
        payment.balance += amount;
        await payment.save();

        return res.status(200).json({
            code: 1,
            message: 'Payment processed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const receive_webhook_casso = async (req, res) => {
    console.log('Casso webhook data:', req.body);
    const webhookData = req.body.data;
    if (!webhookData) {
        return res.status(400).json({
            success: false,
            code: -1,
            message: 'Invalid webhook data',
        });
    }
    if (webhookData.description.includes('giao dich thu nghiem')) {
        return res.status(200).json({
            success: true,
            code: 1,
            message: 'Success',
        });
    }
    const { description, amount } = webhookData;
    const regex = /WDSV(\d+)/i;
    const matches = description.match(regex);
    if (!matches) {
        return res.status(400).json({
            success: false,
            code: -1,
            message: 'Invalid description',
        });
    }
    const orderId = matches[1];
    try {
        const payment = await PaymentModel.findOne({ orderId });
        if (!payment) {
            return res.status(404).json({
                success: false,
                code: -1,
                message: 'Payment not found',
            });
        }
        const user = await UserModel.findById(payment.from);
        user.balance = 0;
        await user.save();

        payment.status = PAID;
        payment.balance = 0;
        await payment.save();

        return res.status(200).json({
            success: true,
            code: 1,
            message: 'Payment processed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            code: -1,
            message: error.message,
        });
    }
};

const deposit = async (req, res) => {
    const user = req.user;
    let { amount } = req.body;
    amount = Number(amount);
    const orderCode = Number(String(new Date().getTime()).slice(1, 11));

    const body = {
        orderCode,
        amount,
        description: orderCode,
        cancelUrl: `${process.env.CLIENT_URI}/wallet`,
        returnUrl: `${process.env.CLIENT_URI}/wallet/history`,
    };

    try {
        const paymentLink = await payos.createPaymentLink(body);
        const { paymentLinkId, checkoutUrl, status } = paymentLink;
        const expiredAt = moment().add(30, 'minutes').toDate();
        const payment = await PaymentModel.create({
            from: user._id,
            amount,
            orderId: orderCode,
            paymentId: paymentLinkId,
            status: status,
            type: DEPOSIT,
            balance: user.balance,
            expiredAt,
        });
        await payment.save();

        return res.status(200).json({
            code: 1,
            message: 'Success',
            checkoutUrl,
            paymentId: paymentLinkId,
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const process_deposit = async (req, res) => {
    const user = req.user;
    const paymentId = req.params.paymentId;
    try {
        const paymentInfo = await payos.getPaymentLinkInformation(paymentId);
        const { status, amountPaid, orderCode } = paymentInfo;

        const payment = await PaymentModel.findOne({ orderId: orderCode });
        if (!payment) {
            return res.status(404).json({
                code: -1,
                message: 'Payment not found',
            });
        }
        if (payment.status !== PENDING) {
            return res.status(400).json({
                code: -1,
                message: 'Payment already processed',
            });
        }
        if (status === PAID) {
            payment.balance += amountPaid;
            user.balance += amountPaid;
            await user.save();
        }
        payment.status = status;
        await payment.save();
        return res.status(200).json({
            code: 1,
            status,
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const cancel_expired_payment = async () => {
    const payments = await PaymentModel.find({
        status: PENDING,
        expiredAt: { $lt: new Date() },
    });
    for (const payment of payments) {
        payment.status = CANCELLED;
        await payment.save();
    }
};

const job = schedule.scheduleJob('* * * * * *', async () => {
    await cancel_expired_payment();
});

const donate = async (req, res) => {
    const user = req.user;
    let { amount, to } = req.body;
    amount = Number(amount);
    if (!to) {
        return res.status(400).json({
            code: -1,
            message: 'Missing required fields',
        });
    }

    try {
        const toUser = await UserModel.findById(to);
        if (!toUser) {
            return res.status(404).json({
                code: -1,
                message: 'User not found',
            });
        }
        toUser.balance += amount;
        await toUser.save();

        user.balance -= amount;
        await user.save();

        const payment = await PaymentModel.create({
            from: user._id,
            to: mongoose.Types.ObjectId(to),
            amount,
            orderId: Number(String(new Date().getTime()).slice(1, 11)),
            status: 'PAID',
            type: DONATE,
            balance: user.balance,
        });
        await payment.save();

        return res.status(200).json({
            code: 1,
            message: 'Donate successfully',
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const withdraw = async (req, res) => {
    const { bankId, accountNo, accountName } = req.user.bankInfo;
    const amount = req.user.balance;

    const orderId = Number(String(new Date().getTime()).slice(1, 11));
    const description = 'WDSV' + orderId;
    const qrcode = `${process.env.QR_DOMAIN}${bankId}-${accountNo}-${TEMPLATE}.jpg?amount=${amount}&addInfo=${description}&accountName=${accountName}`;
    try {
        const payment = await PaymentModel.create({
            from: req.user._id,
            amount,
            orderId,
            status: PENDING,
            type: WITHDRAW,
            balance: req.user.balance,
            qrCode: qrcode,
        });
        await payment.save();
        return res.status(200).json({
            code: 1,
            message: 'Withdraw request sent successfully',
            orderId,
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const process_withdraw = async (req, res) => {
    try {
        await axios.post('/sync', { bank_acc_id: process.env.BANK_ACC_ID });
        return res.status(200).json({
            code: 1,
            message: 'Withdraw processed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const cancel_withdraw = async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const payment = await PaymentModel.findOne({ orderId });
        if (!payment) {
            return res.status(404).json({
                code: -1,
                message: 'Payment not found',
            });
        }
        if (payment.status !== PENDING) {
            return res.status(400).json({
                code: -1,
                message: 'Payment already processed',
            });
        }
        payment.status = CANCELLED;
        await payment.save();
        return res.status(200).json({
            code: 1,
            message: 'Withdraw cancelled',
        });
    } catch (error) {
        return res.status(500).json({
            code: -1,
            message: error.message,
        });
    }
};

const get_payment_history = async (req, res) => {
    const user = req.user;
    try {
        const payments = await PaymentModel.find({ from: user._id }).sort({
            createdAt: -1,
        });
        return res.status(200).json({
            payments,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    confirm_webhook_payos,
    receive_webhook_payos,
    receive_webhook_casso,
    deposit,
    process_deposit,
    donate,
    withdraw,
    process_withdraw,
    cancel_withdraw,
    get_payment_history,
};
