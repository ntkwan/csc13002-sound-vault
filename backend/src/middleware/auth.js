const jwt = require('jsonwebtoken');

const playlistModel = require('../models/playlist.schema');
const UserModel = require('../models/user.schema');

const check_user = async (req, res, next) => {
    try {
        const token =
            req.cookies?.refreshToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: 'Token not found',
            });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_KEY);

        const user = await UserModel.findById(decoded?._id).select(
            '-password -refreshToken',
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
};

const check_admin = async (req, res, next) => {
    try {
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: 'Token not found',
            });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_KEY);

        const user = await UserModel.findById(decoded?._id).select(
            '-password -refreshToken',
        );

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        if (!user.isAdmin) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
};

const check_playlist_uploader = async (req, res, next) => {
    try {
        const playlistId = req.params.id || req.body.playlistId;
        const token =
            req.cookies?.accessToken ||
            req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                message: 'Token not found',
            });
        }

        const decoded = jwt.verify(token, process.env.REFRESH_KEY);
        const user = await UserModel.findById(decoded?._id);

        if (!user) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        const playlist = await playlistModel.findById(playlistId);
        if (!playlist) {
            return res.status(404).json({
                message: 'Playlist not found',
            });
        }

        if (!playlist.uploader.equals(user._id)) {
            return res.status(401).json({
                message: 'Unauthorized',
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Unauthorized',
        });
    }
};

module.exports = { check_user, check_admin, check_playlist_uploader };
