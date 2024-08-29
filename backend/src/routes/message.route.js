const express = require('express');
const router = express.Router();
const messageController = require('../controllers/message.controller');
const messageMiddleware = require('../middleware/message');

router.get('/get-all-messages', messageController.get_all_messages);

router.post(
    '/send-message',
    messageMiddleware.check_name,
    messageMiddleware.check_email,
    messageMiddleware.check_message,
    messageController.send_message,
);

module.exports = router;
