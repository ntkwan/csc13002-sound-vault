const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/user.schema');
const userController = require('../controllers/user.controller');
/*
router.get('/profile', authMiddleware.check_user, (req, res) => {
    delete req.user.isAdmin;
    return res.status(200).json(req.user.name);
});

router.get('/getall', authMiddleware.check_admin, async (req, res) => {
    const users = await User.find().select('-password -__v');
    res.status(200).send({ data: users });
});
*/

router.get(
    '/get-my-profile',
    authMiddleware.check_user,
    userController.get_my_profile,
);
router.get('/get-profile-by-id/:profileId', userController.get_profile_by_id);
router.get(
    '/get-profile-popular-songs/:profileId',
    authMiddleware.check_user,
    userController.get_profile_popular_songs,
);

module.exports = router;
