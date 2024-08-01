if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const UserModel = require('../models/user.schema');
const SongModel = require('../models/song.schema');
const BlacklistModel = require('../models/blacklist.schema');
const moment = require('moment');
const schedule = require('node-schedule');

const ban_account = async (req, res) => {
    const { profileId, days, reason } = req.body;
    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        let isBanned = User.isBanned;
        if (isBanned == true) {
            User.isBanned = false;
            await BlacklistModel.deleteOne({ type: 'user', ref: profileId });
        } else {
            User.isBanned = true;
            const bannedUtil = moment().add(days, 'days').toDate();
            await BlacklistModel.create({
                type: 'user',
                ref: profileId,
                expireDate: bannedUtil,
                reason: reason,
            });
        }
        await User.save();

        const message = isBanned
            ? 'User unbanned successfully'
            : 'User banned successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const update_ban_status = async () => {
    try {
        const now = new Date();

        const expiredBans = await BlacklistModel.find({
            type: 'user',
            expireDate: { $lte: now },
        });

        let hasBanned = false;
        for (const ban of expiredBans) {
            const user = await UserModel.findById(ban.ref);
            user.isBanned = false;
            await user.save();
            await BlacklistModel.deleteOne({ _id: ban._id });
            hasBanned = true;
        }
        if (hasBanned) {
            console.log('Expired bans have been updated successfully');
        }
    } catch (error) {
        console.error('Error occurred while running cron job', error);
    }
};

const get_account_ban_status_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        if (!User.isBanned) {
            return res.status(200).json({
                ban_status: User.isBanned,
                message: 'User is not banned',
            });
        }

        const blacklist = await BlacklistModel.findOne({
            type: 'user',
            ref: profileId,
        });
        return res.status(200).json({
            ban_status: User.isBanned,
            reason: blacklist.reason,
            expire_date: blacklist.expireDate,
            banned_at: blacklist.createdAt,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const job = schedule.scheduleJob('* * * * * *', async () => {
    await update_ban_status();
});

const set_verified_artist = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        let isVerified = User.isVerified;
        if (isVerified == true) {
            User.isVerified = false;
        } else {
            User.isVerified = true;
        }
        await User.save();

        const message = isVerified
            ? 'User unverified successfully'
            : 'User verified successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_all_accounts = async (req, res) => {
    try {
        const Users = await UserModel.find();
        let candidates = [];
        for (let i = 0; i < Users.length; i++) {
            if (!Users[i].isAdmin) {
                candidates.push(Users[i]);
            }
        }
        res.status(200).send(
            candidates.map((user) => {
                return {
                    id: user._id,
                    name: user.name,
                    isVerified: user.isVerified,
                    isBanned: user.isBanned,
                    createdAt: user.createdAt,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const remove_account_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        await UserModel.deleteOne({ _id: profileId });

        return res.status(200).json({
            message: 'User deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const get_all_songs = async (req, res) => {
    try {
        const Songs = await SongModel.find();
        res.status(200).send(
            Songs.map((song) => {
                return {
                    id: song._id,
                    title: song.title,
                    artist: song.artist,
                    isVerified: song.isVerified,
                    isDisabled: song.isDisabled,
                    createdAt: song.createdAt,
                };
            }),
        );
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

const set_verified_song = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        Song.isVerified = !Song.isVerified;
        await Song.save();

        const message = isVerified
            ? 'Song unverified successfully'
            : 'Song verified successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const remove_song_by_id = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song not found',
            });
        }

        await SongModel.deleteOne({ _id: songId });

        return res.status(200).json({
            message: 'Song deleted successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const deactivate_song = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        Song.isDisabled = true;
        await Song.save();
        const expire_date = moment().add(365, 'days').toDate();
        await BlacklistModel.create({
            type: 'song',
            ref: songId,
            expireDate: expire_date,
            reason: 'Song is strictly prohibited',
        });

        return res.status(200).json({
            message: 'Song is deactivated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const activate_song = async (req, res) => {
    const songId = req.params.songId;

    try {
        const Song = await SongModel.findById(songId);
        if (!Song) {
            return res.status(404).json({
                message: 'Song is not found',
            });
        }

        Song.isDisabled = false;
        await Song.save();
        await BlacklistModel.deleteOne({ type: 'song', ref: songId });

        return res.status(200).json({
            message: 'Song is activated successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    get_account_ban_status_by_id,
    ban_account,
    set_verified_artist,
    get_all_accounts,
    remove_account_by_id,
    get_all_songs,
    set_verified_song,
    remove_song_by_id,
    deactivate_song,
    activate_song,
};
