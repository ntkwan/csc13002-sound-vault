const express = require('express');
const router = express.Router();
const authorize = require('../controllers/auth.controller');
const check_auth = require('../middleware/check_auth');

router.get('/profile', check_auth, (req, res) => {
    return res.status(200).json(req.user.email);
});
router.post('/signin', authorize.signin);
router.post('/signup', authorize.signup);

module.exports = router;
