if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
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

    let song_data = {
        title: req.body.title,
        artist: req.user.name,
        uploader: req.user._id,
        genre: req.body.genre,
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

    const email = req.user.email;
    const User = await UserModel.findOne({ email });
    if (!User) {
        return res.status(500).json({
            message: 'Error occured while uploading profile picture',
        });
    }

    const imageResponse = await uploader.profileUploader(req, res);
    if (!imageResponse) {
        return res.status(500).json({
            message: 'Error occured while uploading profile picture',
        });
    }

    if (req.isCover) {
        await User.setCoverPicture(imageResponse);
    } else {
        await User.setProfilePicture(imageResponse);
    }
    await User.save();

    return res.status(200).json({
        message: req.isCover
            ? 'Upload profile cover successfully'
            : 'Upload profile picture successfully',
        imageurl: imageResponse.secure_url,
    });
};

const upload_profile_cover = async (req, res) => {
    req.isCover = true;
    upload_profile_pic(req, res);
};

const upload_song_thumbnail = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            message: `File validation error: ${req.fileValidationError}`,
        });
    }

    const songId = req.params.id;
    const Song = await SongModel.findById(songId);
    if (!Song) {
        return res.status(500).json({
            message: 'Error occured while uploading song thumbnail',
        });
    }

    const imageResponse = await uploader.songThumbnailUploader(req, res);
    if (!imageResponse) {
        return res.status(500).json({
            message: 'Error occured while uploading song thumbnail',
        });
    }

    if (req.isCover) {
        await Song.setSongCover(imageResponse);
    } else {
        await Song.setSongThumbnail(imageResponse);
    }
    await Song.save();

    return res.status(200).json({
        message: req.isCover
            ? 'Upload song cover successfully'
            : 'Upload song thumbnail successfully',
        imageurl: imageResponse.secure_url,
    });
};

const upload_song_cover = async (req, res) => {
    req.isCover = true;
    upload_song_thumbnail(req, res);
};

module.exports = {
    upload_song,
    upload_profile_pic,
    upload_song_thumbnail,
    upload_song_cover,
    upload_profile_cover,
};
