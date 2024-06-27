const express = require('express');
const router = express.Router();
const { upload } = require('../middleware/multer');
const uploader = require('../controllers/upload.controller');

router.post('/upload-audio', upload, uploader.upload_song);

module.exports = router;
