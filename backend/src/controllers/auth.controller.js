const UserModel = require('../models/user.schema');
const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }

    try {
        const exist = await UserModel.findOne({ email });
        if (exist) {
            return res.status(400).json({
                message: 'Email has already existed',
            });
        }
        const User = new UserModel({ email });
        await User.setPassword(password);
        await User.save();

        if (User) {
            return res.status(200).json({
                message: 'Account created successfully',
            });
        } else {
            return res.status(400).json({
                message: 'Error occured while creating account',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const signin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({
            message: 'Email and password are required',
        });
    }

    try {
        const User = await UserModel.findOne({ email });
        if (!User) {
            return res.status(400).json({
                message: 'Email does not exist',
            });
        }

        const isValid = await User.validatePassword(password);
        if (!isValid) {
            return res.status(400).json({
                message: 'Password is incorrect',
            });
        }

        const Token = jwt.sign(
            {
                email: User.email,
            },
            process.env.JWT_KEY,
            {
                expiresIn: '1h',
            },
        );
        return res.status(200).json({
            message: 'Sign in successfully',
            token: Token,
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { signup, signin };
