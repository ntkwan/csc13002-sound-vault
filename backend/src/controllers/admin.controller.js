if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const UserModel = require('../models/user.schema');

const set_verified_artist = async (req, res) => {
    const profileId = req.params.profileId;

    try {
        const User = await UserModel.findById(profileId);
        if (!User) {
            return res.status(404).json({
                message: 'User not found',
            });
        }

        User.isVerified = true;
        await User.save();

        return res.status(200).json({
            message: 'User verified successfully',
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    set_verified_artist,
};
