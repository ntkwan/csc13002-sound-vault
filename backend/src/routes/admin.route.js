const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminController = require('../controllers/admin.controller');

router.post(
    '/get-admin-accounts',
    authMiddleware.check_admin,
    adminController.get_admin_accounts,
);

router.post(
    '/set-verified-artist-by-id/:profileId',
    authMiddleware.check_admin,
    adminController.set_verified_artist,
);

router.get(
    '/get-all-accounts',
    authMiddleware.check_admin,
    adminController.get_all_accounts,
);

router.delete(
    '/remove-account-by-id/:profileId',
    authMiddleware.check_admin,
    adminController.remove_account_by_id,
);

router.post(
    '/ban-account',
    authMiddleware.check_admin,
    adminController.ban_account,
);

router.get(
    '/get-account-ban-status-by-id/:profileId',
    authMiddleware.check_admin,
    adminController.get_account_ban_status_by_id,
);

router.get(
    '/get-all-songs',
    authMiddleware.check_admin,
    adminController.get_all_songs,
);

router.put(
    '/set-verified-song-by-id/:songId',
    authMiddleware.check_admin,
    adminController.set_verified_song,
);

router.post(
    '/cancel-copyright-request/',
    authMiddleware.check_admin,
    adminController.cancel_copyright_request,
);

router.delete(
    '/remove-song-by-id/:songId',
    authMiddleware.check_admin,
    adminController.remove_song_by_id,
);

router.post(
    '/deactivate-song/:songId',
    authMiddleware.check_admin,
    adminController.deactivate_song,
);

router.post(
    '/activate-song/:songId',
    authMiddleware.check_admin,
    adminController.activate_song,
);

router.get(
    '/get-dashboard-stats',
    authMiddleware.check_admin,
    adminController.get_dashboard_stats,
);

module.exports = router;
