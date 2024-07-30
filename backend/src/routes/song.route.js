const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const songMiddleware = require('../middleware/song_auth');

router.get('/get-trending-songs', songController.get_trending_songs);
router.get('/get-new-songs', songController.get_new_songs);
router.get('/get-songs-by-region/:region', songController.get_songs_by_region);
router.get('/get-top-songs', songController.get_top_songs);

router.post(
    '/play-song/:id',
    songMiddleware.check_disable_song,
    songController.play_song,
);
router.put(
    '/undo-play-song/:id',
    songMiddleware.check_disable_song,
    songController.undo_play_song,
);

router.get('/get-song-view/:id', songController.get_song_view);
router.get('/get-song-by-id/:id', songController.get_song_by_id);

router.put('/disable-song/:id', songController.disable_song);
router.put(
    '/enable-song/:id',
    songMiddleware.check_deactivate_song,
    songController.enable_song,
);
module.exports = router;
