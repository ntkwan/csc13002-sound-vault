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
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    view: song.view,
                    region: song.region,
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
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    view: song.view,
                    region: song.region,
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
            audiourl: Song.audiourl,
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

const get_songs_by_region = async (req, res) => {
    // 3 regions: 'VPop', 'KPop', 'USUK'
    const region = req.params.region;
    try {
        const songs = await SongModel.find({ region: region })
            .sort({ view: -1 })
            .limit(5);

        if (!songs) {
            return res.status(404).json({
                message: 'The region is not found',
            });
        }

        res.status(200).send(
            songs.map((song) => {
                return {
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    view: song.view,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

/*
const set_song_uploader = async (req, res) => {
    const songId = req.params.id;
    const uploader = req.body.uploader;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        await Song.setUploader(uploader);
        await Song.save();

        res.status(200).json({
            message: 'Uploader has been set',
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};
*/
module.exports = {
    get_trending_songs,
    get_new_songs,
    play_song,
    get_song_view,
    get_songs_by_region,
    //set_song_uploader,
};
