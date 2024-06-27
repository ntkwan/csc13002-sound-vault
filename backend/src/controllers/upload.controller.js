const uploader = require('../config/cloudinary.config');

const upload_song = async (req, res) => {
    if (req.fileValidationError) {
        return res
            .status(400)
            .json({
                message: `File validation error: ${req.fileValidationError}`,
            });
    }

    const audioResponse = await uploader.cloudinaryUploader(req, res);

    return res.status(200).json({ audioResponse: audioResponse.secure_url });
};

module.exports = { upload_song };
