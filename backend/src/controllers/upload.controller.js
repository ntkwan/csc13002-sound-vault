require('dotenv').config();
const uploader = require('../config/cloudinary.config');
const SongModel = require('../models/song.schema');
const UserModel = require('../models/user.schema');

const upload_song = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            message: `File validation error: ${req.fileValidationError}`,
        });
    }

    const audioResponse = await uploader.audioUploader(req, res);
    if (!audioResponse) {
        return res.status(500).json({
            message: 'Error occured while uploading song',
        });
    }

    let imageurl = process.env.DEFAULT_THUMBNAIL;

    let song_data = {
        title: req.body.title,
        artist: req.body.artist,
        //album: req.body.album,
        genre: req.body.genre,
        imageurl: req.body?.imageurl || imageurl,
        audiourl: audioResponse.secure_url,
    };

    const result = await SongModel.create(song_data);
    if (!result) {
        return res.status(500).json({
            message: 'Error occured while uploading song',
        });
    }

    return res.status(200).json({
        message: 'Upload song successfully',
        song: song_data,
        audioResponse: audioResponse.secure_url,
    });
};

const upload_profile_pic = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            message: `File validation error: ${req.fileValidationError}`,
        });
    }

    const email = req.params.email;
    const User = await UserModel.findOne({ email });
    if (!User) {
        return res.status(500).json({
            message: 'Error occured while uploading profile picture',
        });
    }

    const imageResponse = await uploader.imageUploader(req, res);
    if (!imageResponse) {
        return res.status(500).json({
            message: 'Error occured while uploading profile picture',
        });
    }

    await User.setProfilePicture(imageResponse);
    await User.save();

    return res.status(200).json({
        message: 'Upload profile picture successfully',
        imageurl: imageResponse.secure_url,
    });
};

module.exports = { upload_song, upload_profile_pic };
