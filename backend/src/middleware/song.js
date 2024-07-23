const SongModel = require('../models/song');

const check_song = async (req, res, next) => {
    try {
        const songId = req.params.songId;

        const song = await SongModel.findById(songId).select('isBanned');

        if (!song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        if (song.isBanned) {
            return res.status(403).json({
                message: 'Song is banned',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

module.exports = {
    check_song,
};
