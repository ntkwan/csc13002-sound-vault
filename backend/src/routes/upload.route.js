const express = require('express');
const router = express.Router();
const stage_file = require('../middleware/multer');
const uploader = require('../controllers/upload.controller');

router.post('/upload-song', stage_file.audio_upload, uploader.upload_song);
router.post(
    '/upload-profile-pic/:email',
    stage_file.image_upload,
    uploader.upload_profile_pic,
);

module.exports = router;
