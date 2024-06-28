require('dotenv').config();
const uploader = require('../config/cloudinary.config');
const SongModel = require('../models/song.schema');

const upload_song = async (req, res) => {
    if (req.fileValidationError) {
        return res.status(400).json({
            message: `File validation error: ${req.fileValidationError}`,
        });
    }

    const audioResponse = await uploader.cloudinaryUploader(req, res);

    let imageurl = process.env.DEFAULT_THUMBNAIL;

    let song_data = {
        title: req.body.title,
        //artist: req.body.artist,
        //album: req.body.album,
        genre: req.body.genre,
        imageurl: imageurl,
        audiourl: audioResponse.secure_url,
    };

    const result = await SongModel.create(song_data);
    if (!result) {
        return res
            .status(400)
            .json({
                message:
                    'Internal server error: error occured while uploading song',
            });
    }

    return res
        .status(200)
        .json({ song: song_data, audioResponse: audioResponse.secure_url });
};

module.exports = { upload_song };
