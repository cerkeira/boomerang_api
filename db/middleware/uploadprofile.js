const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/uncompressed';
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});

const uploadProfile = multer({
    storage: storage,
    limits: { fileSize: 8 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Só são aceites ficheiros jpeg ou png.'));
        }
    },
}).single('profileImage');

const compressProfileImage = async (req, res, next) => {
    if (!req.file) return next();

    try {
        const filePath = path.join('uploads/uncompressed', req.file.filename);
        const compressedFilePath = path.join(
            'uploads/profile',
            `compressed-${req.file.filename}`
        );

        await sharp(filePath)
            .resize({ width: 500, height: 500, fit: 'inside' })
            .toFile(compressedFilePath);

        req.file.path = compressedFilePath;
        req.file.filename = `compressed-${req.file.filename}`;
        next();
    } catch (err) {
        console.error('Error during image processing:', err);
        return res.status(500).json({ message: 'Failed to process image.' });
    }
};

const uploadProfileMiddleware = (req, res, next) => {
    uploadProfile(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message:
                        'Este ficheiro excede o limite de 8MB para imagens de perfil.',
                });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = { uploadProfileMiddleware, compressProfileImage };
