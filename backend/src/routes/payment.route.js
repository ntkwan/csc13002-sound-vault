const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');

router.post('/deposit', paymentController.deposit);

module.exports = router;
