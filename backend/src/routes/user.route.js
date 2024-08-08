const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const userController = require('../controllers/user.controller');

router.post(
    '/change-profile',
    authMiddleware.check_user,
    userController.change_profile,
);

router.get(
    '/get-profile-information',
    authMiddleware.check_user,
    userController.get_profile_information,
);

router.post(
    '/follow-profile-by-id/:profileId',
    authMiddleware.check_user,
    userController.follow_profile_by_id,
);

router.post(
    '/unfollow-profile-by-id/:profileId',
    authMiddleware.check_user,
    userController.unfollow_profile_by_id,
);

router.get(
    '/get-follow-button-by-id/:profileId',
    authMiddleware.check_user,
    userController.get_follow_button_by_id,
);

router.get(
    '/get-following-list-by-id/:profileId',
    userController.get_following_list_by_id,
);

router.get(
    '/get-my-profile',
    authMiddleware.check_user,
    userController.get_my_profile,
);
router.get('/get-profile-by-id/:profileId', userController.get_profile_by_id);
router.get(
    '/get-profile-all-songs/:profileId',
    userController.get_profile_all_songs,
);

router.get('/get-featured-artists', userController.get_featured_artists);

router.get('/get-popular-albums', userController.get_popular_albums);

router.get(
    '/get-recently-played-songs',
    authMiddleware.check_user,
    userController.get_recently_played_songs,
);

module.exports = router;
