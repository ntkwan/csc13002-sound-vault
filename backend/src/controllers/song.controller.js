if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const uploader = require('../config/cloudinary.config');
const SongModel = require('../models/song.schema');

const get_song_by_id = async (req, res) => {
    const songId = req.params.id;
    try {
        const song = await SongModel.findById(songId);
        if (!song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        return res.status(200).json({
            title: song.title,
            artist: song.artist,
            genre: song.genre,
            imageurl: song.image,
            coverimg: song.coverimg,
            view: song.view,
            region: song.region,
            uploader: song.uploader,
            audiourl: song.audiourl,
            isverified: song.isVerified,
            isdisabled: song.isDisabled,
            createdAt: song.createdAt,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_trending_songs = async (req, res) => {
    try {
        const songs = await SongModel.find().sort({ view: -1 });

        res.status(200).send(
            songs.map((song) => {
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    coverimg: song.coverimg,
                    view: song.view,
                    region: song.region,
                };
            }),
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_new_songs = async (req, res) => {
    try {
        const songs = await SongModel.find({ view: { $gt: '0' } }).sort({
            createdAt: -1,
        });

        res.status(200).send(
            songs.map((song) => {
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    coverimg: song.coverimg,
                    view: song.view,
                    region: song.region,
                };
            }),
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const play_song = async (req, res) => {
    const songId = req.params.id;
    const user = req.user;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        await Song.increaseView();
        await Song.save();

        if (user) {
            await user.addToRecentlyPlayed(songId);
            await user.save();
        }

        return res.status(200).json({
            audiourl: Song.audiourl,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const undo_play_song = async (req, res) => {
    const songId = req.params.id;
    const user = req.user;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        await Song.decreaseView();
        await Song.save();

        if (user) {
            await user.removeFromRecentlyPlayed(songId);
            await user.save();
        }

        return res.status(200).json({
            message: 'Undo play song successfully',
        });
    } catch (error) {
        return res.status(500).json({
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
                message: 'Song is not found',
            });
        }

        return res.status(200).json({
            view: Song.view,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_songs_by_region = async (req, res) => {
    // 3 regions: 'VPop', 'KPop', 'US-UK'
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
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    coverimg: song.coverimg,
                    view: song.view,
                };
            }),
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_songs_by_genre = async (req, res) => {
    const genre = req.params.genre;
    try {
        const songs = await SongModel.find({ genre: genre }).sort({ view: -1 });

        if (!songs) {
            return res.status(404).json({
                message: 'The genre is not found',
            });
        }

        res.status(200).send(
            songs.map((song) => {
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    coverimg: song.coverimg,
                    view: song.view,
                };
            }),
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_top_songs = async (req, res) => {
    const regions = ['V-Pop', 'K-Pop', 'USUK'];
    try {
        const topSongs = [];
        for (let region of regions) {
            const songs = await SongModel.find({ region: region })
                .sort({ view: -1 })
                .limit(1);
            const [song] = songs;
            const { audiourl, ...songWithoutAudio } = song.toObject();
            topSongs.push(songWithoutAudio);
        }

        res.status(200).send(
            topSongs.map((song) => {
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    coverimg: song.coverimg,
                    region: song.region,
                };
            }),
        );
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const disable_song = async (req, res) => {
    const songId = req.params.id;
    try {
        const song = await SongModel.findById(songId);
        if (!song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        song.isDisabled = true;
        await song.save();

        return res.status(200).json({
            message: 'Song is disabled',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const delete_track_by_id = async (req, res) => {
    const song = req.song;

    try {
        if (!song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        req.publicId = song.image.publicId;
        let log = await uploader.songThumbnailDestroyer(req, res);
        if (log.result !== 'ok') {
            return res.status(500).json({
                message: 'Error occured while deleting song',
            });
        }

        const coverimage = song.coverimg;
        if (JSON.stringify(coverimage) !== '{}') {
            const coverprofile = req.user.coverimage.publicId;
            if (coverimage.publicId !== coverprofile) {
                req.publicId = coverimage.publicId;
                log = await uploader.songThumbnailDestroyer(req, res);
                if (log.result !== 'ok') {
                    return res.status(500).json({
                        message: 'Error occured while deleting song',
                    });
                }
            }
        }

        await SongModel.deleteOne({ _id: song._id });

        return res.status(200).json({
            message: 'Song deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const enable_song = async (req, res) => {
    const songId = req.params.id;
    try {
        const song = await SongModel.findById(songId);
        if (!song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        song.isDisabled = false;
        await song.save();

        return res.status(200).json({
            message: 'Song is enabled',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    delete_track_by_id,
    get_song_by_id,
    get_trending_songs,
    get_new_songs,
    play_song,
    undo_play_song,
    get_song_view,
    get_songs_by_region,
    get_songs_by_genre,
    get_top_songs,
    disable_song,
    enable_song,
};
