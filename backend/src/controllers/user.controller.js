if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const UserModel = require('../models/user.schema');
const SongModel = require('../models/song.schema');
const PlaylistModel = require('../models/playlist.schema');
const mongoose = require('mongoose');

const get_profile_information = async (req, res) => {
    const profileId = req.user._id;
    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        return res.status(200).json({
            name: User.name,
            email: User.email,
            shortDesc: User.shortDesc,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const change_profile = async (req, res) => {
    const email = req.body.email;
    const name = req.body.name;
    const shortDesc = req.body.shortDesc;
    const profileId = req.user._id;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        User.email = email;
        User.name = name;
        User.shortDesc = shortDesc;
        await User.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Profile updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_featured_artists = async (req, res) => {
    try {
        const Users = await UserModel.find({ isVerified: true }).sort({
            followers: -1,
        });

        res.status(200).send(
            Users.map((user) => {
                return {
                    name: user.name,
                    image: user.image,
                    id: user._id,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const get_profile_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        return res.status(200).json({
            name: User.name,
            image: User.image,
            coverimg: User.coverimage,
            isVerified: User.isVerified,
            followers: User.followers.length,
            following: User.following.length,
            id: User._id,
            isBanned: User.isBanned,
            shortDesc: User.shortDesc,
            publicAddress: User.publicAddress,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_my_profile = async (req, res) => {
    const profileId = req.user._id;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }
        let response = {
            name: User.name,
            image: User.image,
            coverimg: User.coverimage,
            isVerified: User.isVerified,
            followers: User.followers.length,
            following: User.following.length,
            id: User._id,
            isBanned: User.isBanned,
            shortDesc: User.shortDesc,
            balance: User.balance,
        };
        if (User.isVerified) {
            response = {
                ...response,
                bankInfo: User.bankInfo,
            };
        }

        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_profile_all_songs = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const songs = await SongModel.find({ uploader: profileId }).sort({
            view: -1,
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
                    audiourl: song.audiourl,
                    view: song.view,
                    region: song.region,
                    isverified: song.isVerified,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const get_follow_button_by_id = async (req, res) => {
    const profileId = req.params.profileId;
    const userId = req.user._id;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const isFollowing = User.followers.includes(userId);

        return res.status(200).json({
            button_state: isFollowing,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const follow_profile_by_id = async (req, res) => {
    let profileId = req.params.profileId;
    let userId = req.user._id;

    if (profileId === userId) {
        return res.status(400).json({
            message: 'You cannot perform such action on yourself',
        });
    }

    try {
        const targetProfile = await UserModel.findById(profileId);
        const thisProfile = await UserModel.findById(userId);
        if (!targetProfile || !thisProfile) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        profileId = new mongoose.Types.ObjectId(profileId);
        userId = new mongoose.Types.ObjectId(userId);
        if (targetProfile.followers.length < thisProfile.following.length) {
            if (targetProfile.followers.includes(userId)) {
                return res.status(400).json({
                    message: 'You are already following this user',
                });
            }
        } else {
            if (thisProfile.following.includes(profileId)) {
                return res.status(400).json({
                    message: 'You are already following this user',
                });
            }
        }

        targetProfile.followers.push(userId);
        await targetProfile.save({ validateBeforeSave: false });
        thisProfile.following.push(profileId);
        await thisProfile.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Followed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const unfollow_profile_by_id = async (req, res) => {
    let profileId = req.params.profileId;
    let userId = req.user._id;

    if (profileId === userId) {
        return res.status(400).json({
            message: 'You cannot perform such action on yourself',
        });
    }

    try {
        const targetProfile = await UserModel.findById(profileId);
        const thisProfile = await UserModel.findById(userId);
        if (!targetProfile || !thisProfile) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        profileId = new mongoose.Types.ObjectId(profileId);
        userId = new mongoose.Types.ObjectId(userId);

        if (targetProfile.followers.length < thisProfile.following.length) {
            if (!targetProfile.followers.includes(userId)) {
                return res.status(400).json({
                    message: 'You are not following this user',
                });
            }
        } else {
            if (!thisProfile.following.includes(profileId)) {
                return res.status(400).json({
                    message: 'You are not following this user',
                });
            }
        }

        targetProfile.followers = targetProfile.followers.filter(
            (id) => id == userId,
        );
        await targetProfile.save({ validateBeforeSave: false });
        thisProfile.following = thisProfile.following.filter(
            (id) => id == profileId,
        );
        await thisProfile.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Unfollowed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_following_list_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const following = await UserModel.find({
            _id: { $in: User.following },
        });

        return res.status(200).json({
            following: following.map((user) => {
                return {
                    name: user.name,
                    image: user.image,
                    id: user._id,
                };
            }),
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_popular_albums = async (req, res) => {
    try {
        const users = await UserModel.find({ isVerified: true });
        albums = [];
        for (let i = 0; i < users.length; i++) {
            if (users[i].playlist.length > 0) {
                for (let idx = 0; idx < users[i].playlist.length; ++idx) {
                    const album = await PlaylistModel.findById(
                        users[i].playlist[idx],
                    );
                    if (album.isAlbum == true) {
                        albums.push(await PlaylistModel.findById(album));
                    }
                }
            }
        }

        return res.status(200).json({
            albums: albums.map((album) => {
                return {
                    id: album._id,
                    name: album.name,
                    description: album.desc,
                    playlist_owner: album.uploader,
                    image: album.image,
                };
            }),
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const get_recently_played_songs = async (req, res) => {
    const userId = req.user._id;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const songs = await SongModel.find({
            _id: { $in: user.recentlyPlayed },
        });
        const orderedSongs = songs.sort((a, b) => {
            return (
                user.recentlyPlayed.indexOf(a._id) -
                user.recentlyPlayed.indexOf(b._id)
            );
        });

        return res.status(200).json({
            songs: orderedSongs.map((song) => {
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
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_profile_albums = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const albums = await PlaylistModel.find({
            _id: { $in: User.playlist },
            isAlbum: true,
        });

        return res.status(200).json({
            albums: albums.map((album) => {
                return {
                    id: album._id,
                    name: album.name,
                    description: album.desc,
                    playlist_owner: album.uploader,
                    image: album.image,
                };
            }),
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_profile_playlists = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const playlists = await PlaylistModel.find({
            _id: { $in: User.playlist },
            isAlbum: false,
        });

        return res.status(200).json({
            playlists: playlists.map((playlist) => {
                return {
                    id: playlist._id,
                    name: playlist.name,
                    description: playlist.desc,
                    playlist_owner: playlist.uploader,
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

const get_search_results = async (req, res) => {
    const query = req.query.q;
    if (!query) {
        return res.status(400).json({
            message: 'Missing query',
        });
    }
    try {
        const Artists = await UserModel.find({
            name: { $regex: query, $options: 'i' },
            isVerified: true,
        }).limit(5);
        const Users = await UserModel.find({
            name: { $regex: query, $options: 'i' },
            isVerified: false,
        }).limit(5);
        const Songs = await SongModel.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { artist: { $regex: query, $options: 'i' } },
            ],
        }).limit(5);
        const Playlists = await PlaylistModel.find({
            name: { $regex: query, $options: 'i' },
            isAlbum: false,
        }).limit(5);
        const Albums = await PlaylistModel.find({
            name: { $regex: query, $options: 'i' },
            isAlbum: true,
        }).limit(5);

        let artists =
            Artists?.map((artist) => {
                return {
                    name: artist.name,
                    image: artist.image,
                    id: artist._id,
                };
            }) ?? [];
        let users =
            Users?.map((user) => {
                return {
                    name: user.name,
                    image: user.image,
                    id: user._id,
                };
            }) ?? [];
        let songs =
            Songs?.map((song) => {
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    genre: song.genre,
                    imageurl: song.image,
                    coverimg: song.coverimg,
                    view: song.view,
                };
            }) ?? [];
        let playlists =
            Playlists?.map((playlist) => {
                return {
                    id: playlist._id,
                    name: playlist.name,
                    description: playlist.desc,
                    playlist_owner: playlist.uploader,
                    image: playlist.image,
                    songs: playlist.songs,
                };
            }) ?? [];
        let albums =
            Albums?.map((album) => {
                return {
                    id: album._id,
                    name: album.name,
                    description: album.desc,
                    image: album.image,
                    playlist_owner: album.uploader,
                    songs: album.songs,
                };
            }) ?? [];

        if (
            !artists.length &&
            !users.length &&
            !songs.length &&
            !playlists.length &&
            !albums.length
        ) {
            return res.status(404).json({
                message: 'No results found',
            });
        }

        return res.status(200).json({
            users,
            artists,
            songs,
            playlists,
            albums,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const update_bank_info = async (req, res) => {
    const user = req.user;
    const { bankId, accountNo, accountName } = req.body;
    if (!bankId || !accountNo) {
        return res.status(400).json({
            message: 'Missing required fields',
        });
    }
    try {
        user.bankInfo = {
            bankId,
            accountNo,
            accountName,
        };
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            message: 'Bank info updated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    get_profile_information,
    change_profile,
    get_following_list_by_id,
    get_follow_button_by_id,
    follow_profile_by_id,
    unfollow_profile_by_id,
    get_profile_by_id,
    get_my_profile,
    get_profile_all_songs,
    get_featured_artists,
    get_popular_albums,
    get_recently_played_songs,
    get_profile_albums,
    get_profile_playlists,
    get_search_results,
    update_bank_info,
};
