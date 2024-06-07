const express = require('express');
const router = express.Router();

const authorize = require('../controllers/auth.controller');

router.post('/signin', authorize.signin);
router.post('/signup', authorize.signup);
router.post('/signout', authorize.signout);
router.post('/reset-password/:email/:token', authorize.reset_password);
router.post('/forgot-password', authorize.forgot_password);

module.exports = router;
