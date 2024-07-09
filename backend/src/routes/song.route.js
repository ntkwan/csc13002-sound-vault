const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');

router.get('/get-trending-songs', songController.get_trending_songs);
router.get('/get-new-songs', songController.get_new_songs);
router.get('/get-songs-by-region/:region', songController.get_songs_by_region);

router.post('/play-song/:id', songController.play_song);
router.get('/get-song-view/:id', songController.get_song_view);

//router.post('/set-song-uploader/:id', songController.set_song_uploader);
module.exports = router;
