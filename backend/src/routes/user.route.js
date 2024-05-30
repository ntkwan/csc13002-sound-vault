const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user.schema');

router.get('/profile', authMiddleware.check_user, (req, res) => {
    delete req.user.isAdmin;
    return res.status(200).json(req.user.name);
});

router.get('/getall', authMiddleware.check_admin, async (req, res) => {
    const users = await User.find().select('-password -__v');
    res.status(200).send({ data: users });
});

module.exports = router;
