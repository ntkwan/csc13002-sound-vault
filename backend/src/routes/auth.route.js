const express = require('express');
const router = express.Router();

const authorize = require('../controllers/auth.controller');

router.post('/signin', authorize.signin);
router.post('/signup', authorize.signup);

module.exports = router;
