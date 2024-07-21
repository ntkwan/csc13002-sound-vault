if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const UserModel = require('../models/user.schema');

/*
const set_verified_artist = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        let isVerified = Boolean(User.getVerification());
        if (isVerified == true) {
            console.log('yes');
            await User.setUnverfied();
        } else {
            console.log('no');

            await User.setVerified();
        }

        console.log(isVerified, User.isVerified);

        const message = isVerified ? 'User unverified successfully' : 'User verified successfully';
        return res.status(200).json({
            message: message,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};
*/

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
    //set_verified_artist,
    get_all_accounts,
    remove_account_by_id,
};
