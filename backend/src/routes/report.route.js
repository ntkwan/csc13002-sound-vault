const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const reportController = require('../controllers/report.controller');

router.post(
    '/send-report-on-song/:songId',
    authMiddleware.check_user,
    reportController.send_report_on_song,
);

module.exports = router;
