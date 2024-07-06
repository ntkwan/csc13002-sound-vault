if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const UserModel = require('../models/user.schema');

const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const HOST_EMAIL = process.env.HOST_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
);

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

        const accessToken = User.generateToken();
        const refreshToken = User.generateRefreshToken();

        User.refreshToken = refreshToken;
        await User.save({ validateBeforeSave: false });

        const loggedInUser = await UserModel.findById(User._id).select(
            '-password -refreshToken',
        );

        const options = {
            httpOnly: true,
            secure: true,
        };

        return res
            .status(200)
            .cookie('refreshToken', refreshToken, options)
            .json({
                user: loggedInUser,
                accessToken,
                refreshToken,
                message: 'Sign in successfully',
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const refresh_token = async (req, res) => {
    const incomingRefreshToken =
        req.body.refreshToken || req.cookies.refreshToken;

    if (!incomingRefreshToken) {
        return res.status(401).json({ message: 'Refresh token not found' });
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_KEY,
        );

        const user = await UserModel.findById(decodedToken?._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user?.refreshToken !== incomingRefreshToken) {
            return res
                .status(401)
                .json({ message: 'Refresh token is incorrect' });
        }

        const options = {
            httpOnly: true,
            secure: true, // Enable in a production environment with HTTPS
        };

        const accessToken = user.generateToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return res
            .status(200)
            .cookie('refreshToken', refreshToken, options)
            .json({
                accessToken,
                refreshToken,
                message: 'Access token refreshed',
            });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const signout = async (req, res) => {
    const userId = UserModel.findOne({ email: req.body.email })._id;
    await UserModel.findByIdAndUpdate(
        userId,
        {
            $set: { refreshToken: undefined },
        },
        { new: true },
    );

    const options = {
        httpOnly: true,
        secure: true, // Enable in a production environment with HTTPS
    };

    return res
        .status(200)
        .cookie('refreshToken', options)
        .json({ user: {}, message: 'Logged out successfully' });
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
        const payload = jwt.verify(token, process.env.REFRESH_KEY);

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

            const accessToken = User.generateToken();
            const refreshToken = User.generateRefreshToken();
            User.refreshToken = refreshToken;
            await User.save({ validateBeforeSave: false });

            const options = {
                httpOnly: true,
                secure: true, // Enable in a production environment with HTTPS
            };

            return res
                .status(200)
                .cookie('refreshToken', refreshToken, options)
                .json({
                    accessToken,
                    refreshToken,
                    message: 'Password updated successfully',
                });
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

const send_email = async (send_to, url) => {
    try {
        oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
        const accessToken = await oAuth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: HOST_EMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });

        console.log(HOST_EMAIL, send_to, url);

        const mailOptions = {
            from: HOST_EMAIL,
            to: send_to,
            subject: 'Reset Password',
            html: `<a href="${url}">Click here to reset password</a>`,
        };

        const result = await transporter.sendMail(mailOptions);
        return result;
    } catch (error) {
        return error;
    }
};

const forgot_password = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({
            message: 'Email is required',
        });
    }

    try {
        const User = await UserModel.findOne({ email });
        if (!User) {
            return res.status(400).json({
                message: 'Email does not exist',
            });
        }

        const token = jwt.sign({ email: email }, process.env.REFRESH_KEY, {
            expiresIn: '1m',
        });
        const url = `http://localhost:${process.env.CLIENT_PORT}/reset-password?email=${email}&token=${token}`;
        send_email(email, url)
            .then((result) => {
                return res.status(200).json({
                    message: 'Email sent successfully',
                    url: url,
                });
            })
            .catch((err) => {
                return res.status(400).json({
                    message: err.message,
                });
            });
    } catch (error) {
        return res.status(500).json({
            message: error.message,
        });
    }
};

module.exports = {
    signup,
    signin,
    signout,
    reset_password,
    forgot_password,
    refresh_token,
};
