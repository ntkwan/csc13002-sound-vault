if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.schema');
const SongModel = require('../models/song.schema');

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
            followers: User.followers.length,
            id: User._id,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_my_profile = async (req, res) => {
    const refreshToken =
        req.cookies?.refreshToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    const profileId = decoded?._id;

    req.params.profileId = profileId;
    get_profile_by_id(req, res);
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
                    audiourl: song.audiourl,
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

const follow_profile_by_id = async (req, res) => {
    const profileId = req.params.profileId;
    const refreshToken =
        req.cookies?.refreshToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    const userId = decoded?._id;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        User.followers.push(userId);
        await User.save();

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
    const profileId = req.params.profileId;
    const refreshToken =
        req.cookies?.refreshToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_KEY);
    const userId = decoded?._id;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        User.followers = User.followers.filter((id) => id !== userId);
        await User.save();

        return res.status(200).json({
            message: 'Unfollowed successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    follow_profile_by_id,
    unfollow_profile_by_id,
    get_profile_by_id,
    get_my_profile,
    get_profile_all_songs,
    get_featured_artists,
};
