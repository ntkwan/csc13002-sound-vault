const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const playlistController = require('../controllers/playlist.controller');
const uploader = require('../controllers/upload.controller');

router.post(
    '/create-playlist',
    authMiddleware.check_user,
    playlistController.create_playlist,
);

router.post(
    '/create-album',
    authMiddleware.check_artist,
    playlistController.create_album,
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
router.post(
    '/add-song-to-liked-playlist/:songId',
    authMiddleware.check_user,
    playlistController.add_song_to_liked_playlist,
);
router.delete(
    '/remove-song-from-liked-playlist/:songId',
    authMiddleware.check_user,
    playlistController.remove_song_from_liked_playlist,
);
router.get(
    '/get-playlist-by-id/:playlistId',
    playlistController.get_playlist_by_id,
);

router.get(
    '/get-my-playlists',
    authMiddleware.check_user,
    playlistController.get_my_playlists,
);

router.get(
    '/get-my-albums',
    authMiddleware.check_user,
    playlistController.get_my_albums,
);

router.post(
    '/change-playlist-description/:playlistId',
    authMiddleware.check_user,
    authMiddleware.check_playlist_uploader,
    playlistController.change_playlist_description,
);

router.post(
    '/change-playlist-thumbnail/:id',
    authMiddleware.check_user,
    authMiddleware.check_playlist_uploader,
    uploader.upload_song_thumbnail,
);

module.exports = router;
