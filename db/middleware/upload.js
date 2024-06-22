const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed!'), false);
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueSuffix);
    },
});

const uploadMiddleware = upload.array('productImage', 5);

const uploadSingle = upload.single('profileImage');

const compressImage = async (file) => {
    await sharp(file.buffer)
        .resize({ width: 600, height: 600, fit: 'inside' })
        .toBuffer()
        .then((data) => {
            file.buffer = data;
        });
};

const compressImages = async (req, res, next) => {
    try {
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                await compressImage(file);
            }
        }
        next();
    } catch (error) {
        console.error('Error compressing images:', error);
        return res.status(500).json({ error: 'Failed to compress images' });
    }
};

const compressSingleImage = async (req, res, next) => {
    try {
        if (req.file) {
            await compressImage(req.file);
        }
        next();
    } catch (error) {
        console.error('Error compressing image:', error);
        return res.status(500).json({ error: 'Failed to compress image' });
    }
};

module.exports = {
    uploadMiddleware,
    uploadSingle,
    compressImages,
    compressSingleImage,
};
``;
