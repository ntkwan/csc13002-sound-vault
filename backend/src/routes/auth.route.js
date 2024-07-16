const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const authorize = require('../controllers/auth.controller');

router.post('/signin', authorize.signin);
router.post('/signup', authorize.signup);

router.post('/signout', authMiddleware.check_user, authorize.signout);
router.post('/refresh-token', authorize.refresh_token);

router.post('/reset-password/:email/:token', authorize.reset_password);
router.post('/forgot-password', authorize.forgot_password);
router.post(
    '/change-password',
    authMiddleware.check_user,
    authorize.change_password,
);

module.exports = router;
