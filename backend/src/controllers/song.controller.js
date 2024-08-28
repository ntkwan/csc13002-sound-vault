if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const uploader = require('../config/cloudinary.config');
const SongModel = require('../models/song.schema');
const UserModel = require('../models/user.schema');

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
        const collabs = new Map();
        for (let song of songs) {
            let artists = [];
            if (song.collaborators) {
                for (let collab of song.collaborators) {
                    const artist = await UserModel.findById(collab);
                    if (!artist) {
                        continue;
                    }
                    artists.push(artist.name);
                }
                collabs.set(song._id, artists.join(', '));
                console.log(artists);
            }
        }
        res.status(200).send(
            songs.map((song) => {
                return {
                    id: song._id,
                    title:
                        collabs.get(song._id).length === 0
                            ? song.title
                            : song.title +
                              ' (ft ' +
                              collabs.get(song._id) +
                              ')',
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
            if (user.recentlyPlayed.includes(songId)) {
                user.recentlyPlayed = user.recentlyPlayed.filter(
                    (id) => id.toString() !== songId,
                );
            }

            if (user.recentlyPlayed.length === 10) {
                user.recentlyPlayed.pop();
            }

            user.recentlyPlayed.unshift(songId);
            await user.updateOne({ recentlyPlayed: user.recentlyPlayed });
        }

        return res.status(200).json({
            audiourl: Song.audiourl,
        });
    } catch (error) {
        console.log(error);
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

const view_on_blockchain = async (req, res) => {
    const songId = req.params.id;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        let link = '';
        if (Song.isVerified == true) {
            link = process.env.BLOCKCHAIN_EXPLORER + Song.transactionsId;
        }

        return res.status(200).json({
            link: link ? link : 'Song has not yet verified',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const request_copyright = async (req, res) => {
    const songId = req.params.songId;
    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        if (Song.isPending) {
            return res.status(400).json({
                message:
                    'This song has already requested to get copyright, please wait for few days',
            });
        }

        Song.isPending = true;
        return res.status(200).json({
            message: 'Request successfully',
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
    request_copyright,
    view_on_blockchain,
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
