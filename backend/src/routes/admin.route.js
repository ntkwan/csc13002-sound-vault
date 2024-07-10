const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

router.post(
    '/set-verified-artist-by-id/:profileId',
    authMiddleware.check_admin,
    adminController.set_verified_artist,
);

module.exports = router;
