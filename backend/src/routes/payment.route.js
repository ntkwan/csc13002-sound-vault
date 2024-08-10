const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const authMiddleware = require('../middleware/auth');
const paymentMiddleware = require('../middleware/payment');

router.get(
    '/get-payment-history',
    authMiddleware.check_user,
    paymentController.get_payment_history,
);

router.post('/payos/confirm-webhook', paymentController.confirm_webhook_payos);
router.post('/payos/receive-webhook', paymentController.receive_webhook_payos);
router.post('/casso/receive-webhook', paymentController.receive_webhook_casso);

router.post(
    '/deposit',
    authMiddleware.check_user,
    paymentMiddleware.check_pending_payment,
    paymentMiddleware.check_amount,
    paymentController.deposit,
);
router.post(
    '/donate',
    authMiddleware.check_user,
    paymentMiddleware.check_amount,
    paymentMiddleware.check_balance,
    paymentController.donate,
);
router.post(
    '/withdraw',
    authMiddleware.check_artist,
    paymentMiddleware.check_bank_info,
    paymentMiddleware.check_pending_payment,
    paymentMiddleware.check_balance,
    paymentController.withdraw,
);

router.put(
    '/process-deposit/:paymentId',
    authMiddleware.check_user,
    paymentController.process_deposit,
);
router.put(
    '/process-withdraw/:orderId',
    authMiddleware.check_admin,
    paymentController.process_withdraw,
);
router.put(
    '/cancel-withdraw/:orderId',
    authMiddleware.check_user,
    paymentController.cancel_withdraw,
);
module.exports = router;
