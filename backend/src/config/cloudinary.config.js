if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const cloudinary = require('cloudinary');

const CLOUD_LIST = JSON.parse(process.env.CLOUD_NAME);
const CLOUD_KEY = JSON.parse(process.env.API_KEY);
const CLOUD_SECRET = JSON.parse(process.env.API_SECRET);
var len = CLOUD_LIST.length;

var cloud_name = CLOUD_LIST[len - 1];
var api_key = CLOUD_KEY[len - 1];
var api_secret = CLOUD_SECRET[len - 1];
cloudinary.config({
    cloud_name: cloud_name,
    api_key: api_key,
    api_secret: api_secret,
});

const audioUploader = async (req, res) => {
    const file = req.file || req.files.audio;

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    const fName = file[0].originalname;

    try {
        const uploadAudio = await cloudinary.uploader.upload(file[0].path, {
            resource_type: 'auto',
            public_id: fName,
            folder: 'tracks',
        });

        console.log(uploadAudio);
        return uploadAudio;
    } catch (error) {
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
        return res.status(400).json({ message: error.message });
    }
};

const songThumbnailDestroyer = async (req, res) => {
    try {
        const options = {
            type: 'upload',
            resource_type: 'image',
        };

        let destroyer = await cloudinary.uploader.destroy(
            req.publicId,
            options,
        );
        for (let i = 0; i < len - 1; i++) {
            if (destroyer.result === 'ok') {
                return destroyer;
            }
            cloudinary.config({
                cloud_name: CLOUD_LIST[i],
                api_key: CLOUD_KEY[i],
                api_secret: CLOUD_SECRET[i],
            });
            destroyer = await cloudinary.uploader.destroy(
                req.publicId,
                options,
            );
        }

        return destroyer;
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

const songThumbnailUploader = async (req, res) => {
    const file = req.isCover == true ? req.files.cover : req.files.thumbnail;
    const songId = req._id;

    if (!file) {
        return res.status(400).json({ message: 'File not found' });
    }

    const fName = req.isCover
        ? 'cover_' + songId.toString()
        : songId.toString();

    try {
        const uploadImage = await cloudinary.uploader.upload(file[0].path, {
            invalidate: 'true',
            resource_type: 'auto',
            public_id: fName,
            folder: 'thumbnail',
        });

        console.log(uploadImage);
        return uploadImage;
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
    songThumbnailDestroyer,
    audioUploader,
    profileUploader,
    songThumbnailUploader,
};
