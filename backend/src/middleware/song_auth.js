const SongModel = require('../models/song.schema');
const BlacklistModel = require('../models/blacklist.schema');

const check_disable_song = async (req, res, next) => {
    try {
        const songId = req.params.id;

        const song = await SongModel.findById(songId).select('isDisabled');

        if (!song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        if (song.isDisabled) {
            return res.status(403).json({
                message: 'Song is disabled',
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

const check_deactivate_song = async (req, res, next) => {
    try {
        const songId = req.params.id;
        console.log(songId);

        const isInBlacklist = await BlacklistModel.exists({
            type: 'song',
            ref: songId,
        });
        if (isInBlacklist) {
            return res.status(403).json({
                message: 'Song is deactivated',
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
    check_disable_song,
    check_deactivate_song,
};
