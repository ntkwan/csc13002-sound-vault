if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const UserModel = require('../models/user.schema');

const jwt = require('jsonwebtoken');

const signup = async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            message: 'Required fields are missing',
        });
    }

    try {
        const exist = await UserModel.findOne({ email });
        if (exist) {
            return res.status(400).json({
                message: 'Email has already existed',
            });
        }

        const User = await new UserModel({ name, email });
        await User.setPassword(password);
        await User.save();
        User.__v = undefined;

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

        const Token = User.generateToken();
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

const signout = async (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
};

const reset_password = async (req, res) => {
    // url: /reset-password/:email/:token
    const email = req.params.email;
    const token = req.params.token;
    const { attempt_password, confirm_password } = req.body;

    if (attempt_password !== confirm_password) {
        return res.status(400).json({
            message: 'Passwords do not match',
        });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_KEY);

        if (!payload) {
            res.send('Invalid token');
        } else {
            const User = await UserModel.findOne({ email });
            if (!User) {
                return res.status(400).json({
                    message: 'Error occured while updating password',
                });
            }

            await User.setPassword(confirm_password);
            await User.save();
            return res.status(200).json({
                message: 'Password updated successfully',
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = { signup, signin, signout, reset_password };
