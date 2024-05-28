const express = require('express');
const router = express.Router();
const authorize = require('../controllers/auth.controller');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/signin', authorize.signin);
router.post('/signup', authorize.signup);

module.exports = router;
