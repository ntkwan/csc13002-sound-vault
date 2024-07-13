const express = require('express');
const router = express.Router();
const stage_file = require('../middleware/multer');
const uploader = require('../controllers/upload.controller');
const authMiddleware = require('../middleware/auth');

router.post('/upload-song', stage_file.audio_upload, uploader.upload_song);

router.post(
    '/upload-profile-pic',
    authMiddleware.check_user,
    stage_file.profile_pic_upload,
    uploader.upload_profile_pic,
);

router.post(
    '/upload-song-thumbnail/:id',
    stage_file.song_thumbnail_upload,
    uploader.upload_song_thumbnail,
);

module.exports = router;
