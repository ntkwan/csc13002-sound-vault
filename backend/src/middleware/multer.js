const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        let fileExt = file.originalname.split('.').pop();
        const fileName = `${new Date().getTime()}.${fileExt}`;

        cb(null, fileName);
    },
});

const audioFilter = (req, file, cb) => {
    if (file.mimetype !== 'audio/mpeg' && file.mimetype !== 'audio/mp3') {
        req.fileValidationError = 'File type must be audio/mp3 or audio/mpeg';

        return cb(null, false, req.fileValidationError);
    } else {
        cb(null, true);
    }
};

const imageFilter = (req, file, cb) => {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        req.fileValidationError = 'File type must be image/jpeg or image/png';

        return cb(null, false, req.fileValidationError);
    } else {
        cb(null, true);
    }
};

const audio_upload = multer({
    storage,
    audioFilter,
}).single('audio');

const profile_pic_upload = multer({
    storage,
    imageFilter,
}).single('image');

const song_thumbnail_upload = multer({
    storage,
    imageFilter,
}).single('image');

module.exports = { audio_upload, profile_pic_upload, song_thumbnail_upload };
