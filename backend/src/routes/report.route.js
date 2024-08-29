const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const reportController = require('../controllers/report.controller');

router.post(
    '/reply-report',
    authMiddleware.check_admin,
    reportController.reply_report,
);

router.post(
    '/reject-report',
    authMiddleware.check_admin,
    reportController.reject_report,
);

router.post(
    '/send-report-on-song/:songId',
    authMiddleware.check_user,
    reportController.send_report_on_song,
);

router.post(
    '/send-report-on-profile/:profileId',
    authMiddleware.check_user,
    reportController.send_report_on_profile,
);

router.get(
    '/get-reports',
    authMiddleware.check_admin,
    reportController.get_reports,
);

module.exports = router;
