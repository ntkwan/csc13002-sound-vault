require('dotenv').config();
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

const audioUploader = async (req, res) => {
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }
    const fName = file.originalname.split('.')[0];

    try {
        const uploadAudio = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
            public_id: fName,
            folder: 'tracks',
        });

        return uploadAudio;
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};

const profileUploader = async (req, res) => {
    const file = req.file;
    const profileId = req.user._id;

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    const fName = req.isCover ? 'cover_' + profileId : profileId;

    try {
        const uploadImage = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
            public_id: fName,
            folder: 'profiles',
        });

        return uploadImage;
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};

const songThumbnailUploader = async (req, res) => {
    const file = req.file;
    const songId = req.params.id;

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }
    const fName = songId;

    try {
        const uploadImage = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'auto',
            public_id: fName,
            folder: 'thumbnail',
        });

        return uploadImage;
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }
};

module.exports = { audioUploader, profileUploader, songThumbnailUploader };
