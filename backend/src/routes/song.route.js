const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');

router.get('/get-trending-songs', songController.get_trending_songs);

module.exports = router;
