const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const mime = require('mime-types');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = uuidv4();
        const { originalname, mimetype } = file;

        const extension = mime.extension(mimetype);
        cb(null, `${uniqueSuffix}.${extension}`);
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 500000 },
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = upload;
