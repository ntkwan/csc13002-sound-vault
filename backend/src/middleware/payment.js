const UserModel = require('../models/user.schema');
const PaymentModel = require('../models/payment.schema');

const check_balance = async (req, res, next) => {
    let { amount } = req.body;
    amount = amount ? Number(amount) : req.user.balance;
    try {
        const user = await UserModel.findById(req.user._id).select('balance');
        if (user.balance < 1 || user.balance < amount) {
            return res.status(400).json({
                message: 'Insufficient balance',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const check_amount = (req, res, next) => {
    let { amount, to } = req.body;
    amount = Number(amount);
    if (!amount) {
        return res.status(400).json({
            message: 'Missing required fields',
        });
    }
    if (to) {
        if (amount < 1) {
            return res.status(400).json({
                message: 'Cannot donate less than 1 VND',
            });
        }
    } else {
        if (amount < 10000) {
            return res.status(400).json({
                message: 'Amount must be equal or greater than 10,000 VND',
            });
        }
        if (amount > 500000000) {
            return res.status(400).json({
                message: 'Amount must be equal or less than 500,000,000 VND',
            });
        }
    }
    next();
};

const check_pending_payment = async (req, res, next) => {
    const userId = req.user._id;
    try {
        const payments = await PaymentModel.find({
            from: userId,
            status: 'PENDING',
        });
        const paymentIds = payments.map((payment) => payment.paymentId);
        if (payments.length > 0) {
            return res.status(400).json({
                message: 'You have a pending payment',
                paymentIds,
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const check_bank_info = (req, res, next) => {
    let { bankId, accountNo, accountName } = req.user.bankInfo;
    if (!bankId || !accountNo) {
        return res.status(400).json({
            message: 'Missing bank information',
        });
    }
    next();
};

module.exports = {
    check_balance,
    check_amount,
    check_pending_payment,
    check_bank_info,
};
