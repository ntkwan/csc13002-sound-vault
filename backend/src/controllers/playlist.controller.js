if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const SongModel = require('../models/song.schema');
const UserModel = require('../models/user.schema');
const PlaylistModel = require('../models/playlist.schema');
const mongoose = require('mongoose');

const create_playlist = async (req, res) => {
    const { name, firstSongId } = req.body;

    try {
        const user = await req.user.populate('playlist');
        const playlistNames = user.playlist.map((playlist) => playlist.name);

        if (playlistNames.includes(name)) {
            return res.status(400).json({
                message: 'Playlist already exists',
            });
        }

        const playlist = await PlaylistModel.create({
            name,
            uploader: user._id,
            isAlbum: req.isAlbum,
        });

        if (firstSongId) {
            const song = await SongModel.findById(firstSongId);
            if (!song) {
                return res.status(404).json({
                    message: 'Song not found',
                });
            }

            playlist.songs.push(new mongoose.Types.ObjectId(firstSongId));
            await playlist.save({ validateBeforeSave: false });
        }

        user.playlist.push(playlist._id);
        await user.save({ validateBeforeSave: false });

        return res.status(201).json({
            message: 'Playlist created successfully',
            id: playlist._id,
            name: playlist.name,
            description: playlist.desc,
            playlist_owner: playlist.uploader,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const create_album = async (req, res) => {
    req.isAlbum = true;
    create_playlist(req, res);
};

const delete_playlist_by_id = async (req, res) => {
    const playlistId = req.params.playlistId;
    const user = req.user;

    try {
        const playlist = await PlaylistModel.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({
                message: 'Playlist not found',
            });
        }

        await PlaylistModel.deleteOne({ _id: playlistId });
        user.playlist = user.playlist.filter(
            (id) => id.toString() !== playlistId,
        );
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Playlist deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const add_song_to_playlist = async (req, res) => {
    const { playlistId, songId } = req.body;

    try {
        const Playlist = await PlaylistModel.findById(playlistId);
        if (!Playlist) {
            return res.status(404).json({
                message: 'Playlist is not found',
            });
        }

        if (Playlist.songs.includes(songId)) {
            return res.status(400).json({
                message: 'Song already exists in the playlist',
            });
        }

        Playlist.songs.push(new mongoose.Types.ObjectId(songId));
        await Playlist.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Song added to playlist successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const remove_song_from_playlist = async (req, res) => {
    const { playlistId, songId } = req.body;

    try {
        const Playlist = await PlaylistModel.findById(playlistId);
        if (!Playlist) {
            return res.status(404).json({
                message: 'Playlist is not found',
            });
        }

        if (!Playlist.songs.includes(songId)) {
            return res.status(400).json({
                message: 'Song does not exist in the playlist',
            });
        }

        Playlist.songs = Playlist.songs.filter(
            (id) => id.toString() !== songId,
        );
        await Playlist.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Song removed from playlist successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const add_song_to_liked_playlist = async (req, res) => {
    const user = req.user;
    const songId = req.params.songId;
    try {
        const song = await SongModel.findById(songId);
        if (!song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        await user.addToLikedSongs(songId);

        return res.status(200).json({
            message: 'Song added to liked playlist successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const remove_song_from_liked_playlist = async (req, res) => {
    const user = req.user;
    const songId = req.params.songId;
    try {
        const song = await SongModel.findById(songId);
        if (!song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        await user.removeFromLikedSongs(songId);

        return res.status(200).json({
            message: 'Song removed from liked playlist successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_playlist_by_id = async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        const Playlist = await PlaylistModel.findById(playlistId);
        if (!Playlist) {
            return res.status(404).json({
                message: 'Playlist not found',
            });
        }

        const songs = await SongModel.find({
            _id: { $in: Playlist.songs },
        });

        song_data = songs.map((song) => {
            return {
                id: song._id,
                title: song.title,
                artist: song.artist,
                genre: song.genre,
                imageurl: song.image,
                coverimg: song.coverimg,
                audiourl: song.audiourl,
                view: song.view,
                region: song.region,
            };
        });
        return res.status(200).json({
            id: Playlist._id,
            name: Playlist.name,
            description: Playlist.desc,
            playlist_owner: Playlist.uploader,
            songs: song_data,
            isAlbum: Playlist.isAlbum,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_my_playlists = async (req, res) => {
    const userId = req.user._id;
    const isAlbum = req.query.isAlbum === 'true';

    try {
        const User = await UserModel.findById(userId);
        const playlists = await PlaylistModel.find({
            _id: { $in: User.playlist },
            isAlbum: isAlbum,
        });

        return res.status(200).json({
            playlists: playlists.map((playlist) => {
                return {
                    id: playlist._id,
                    name: playlist.name,
                    description: playlist.desc,
                    playlistOwner: playlist.uploader,
                    image: playlist.image,
                    songs: playlist.songs,
                };
            }),
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const change_playlist_description = async (req, res) => {
    const playlistId = req.params.playlistId;
    const { description } = req.body;

    try {
        const Playlist = await PlaylistModel.findById(playlistId);
        if (!Playlist) {
            return res.status(404).json({
                message: 'Playlist is not found',
            });
        }

        Playlist.desc = description;
        await Playlist.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Playlist description updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    create_album,
    create_playlist,
    delete_playlist_by_id,
    add_song_to_playlist,
    remove_song_from_playlist,
    add_song_to_liked_playlist,
    remove_song_from_liked_playlist,
    get_playlist_by_id,
    get_my_playlists,
    change_playlist_description,
};
