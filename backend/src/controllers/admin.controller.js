if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const UserModel = require('../models/user.schema');
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
            const blacklist = await BlacklistModel.findById(User.blacklist);
            await BlacklistModel.deleteOne({ _id: blacklist._id });
            User.blacklist = null;
        } else {
            User.isBanned = true;
            const bannedUtil = moment().add(days, 'days').toDate();
            const blacklist = await BlacklistModel.create({
                account: profileId,
                expireDate: bannedUtil,
                reason: reason,
            });
            User.blacklist = blacklist._id;
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
            expireDate: { $lte: now },
        });

        let hasBanned = false;
        for (const ban of expiredBans) {
            const user = await UserModel.findById(ban.account);
            user.isBanned = false;
            user.blacklist = null;
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

const get_ban_status_by_id = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User is not found',
            });
        }

        const blacklist = await BlacklistModel.findById(User.blacklist);
        if (!blacklist) {
            return res.status(200).json({
                ban_status: User.isBanned,
                message: 'User is not banned',
            });
        }

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

module.exports = {
    get_ban_status_by_id,
    ban_account,
    set_verified_artist,
    get_all_accounts,
    remove_account_by_id,
};
