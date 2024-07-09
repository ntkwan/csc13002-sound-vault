if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const SongModel = require('../models/song.schema');

const get_trending_songs = async (req, res) => {
    try {
        const songs = await SongModel.find().sort({ view: -1 }).limit(10);

        res.status(200).send(
            songs.map((song) => {
                return {
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    audiourl: song.audiourl,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const get_new_songs = async (req, res) => {
    try {
        const songs = await SongModel.find().sort({ createdAt: -1 }).limit(10);

        res.status(200).send(
            songs.map((song) => {
                return {
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    audiourl: song.audiourl,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const play_song = async (req, res) => {
    const songId = req.params.id;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        await Song.increaseView();
        await Song.save();

        res.status(200).json({
            title: Song.title,
            artist: Song.artist,
            view: Song.view,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const get_song_view = async (req, res) => {
    const songId = req.params.id;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        res.status(200).json({
            view: Song.view,
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    get_trending_songs,
    get_new_songs,
    play_song,
    get_song_view,
};
