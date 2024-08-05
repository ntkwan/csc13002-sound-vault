const express = require('express');
const router = express.Router();
const stage_file = require('../middleware/multer');
const uploader = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth');

router.post(
    '/upload-song',
    authMiddleware.check_user,
    stage_file.audio_upload,
    uploader.upload_song,
);

router.post(
    '/upload-profile-pic',
    authMiddleware.check_user,
    stage_file.profile_pic_upload,
    uploader.upload_profile_pic,
);

router.post(
    '/upload-profile-cover',
    authMiddleware.check_user,
    stage_file.profile_pic_upload,
    uploader.upload_profile_cover,
);

router.post(
    '/upload-song-thumbnail/:id',
    stage_file.song_thumbnail_upload,
    uploader.upload_song_thumbnail,
);

router.post(
    '/upload-song-cover/:id',
    stage_file.song_cover_upload,
    uploader.upload_song_cover,
);

router.post(
    '/submit-music',
    authMiddleware.check_user,
    stage_file.upload_at_once,
    uploader.submit_music,
);

module.exports = router;
