const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const playlistController = require('../controllers/playlist.controller');

router.post(
    '/create-playlist',
    authMiddleware.check_user,
    playlistController.create_playlist,
);
router.delete(
    '/delete-playlist-by-id/:playlistId',
    authMiddleware.check_user,
    authMiddleware.check_playlist_uploader,
    playlistController.delete_playlist_by_id,
);
router.post(
    '/add-song-to-playlist',
    authMiddleware.check_playlist_uploader,
    playlistController.add_song_to_playlist,
);
router.delete(
    '/remove-song-from-playlist',
    authMiddleware.check_user,
    authMiddleware.check_playlist_uploader,
    playlistController.remove_song_from_playlist,
);
router.get(
    '/get-playlist-by-id/:playlistId',
    playlistController.get_playlist_by_id,
);

module.exports = router;
