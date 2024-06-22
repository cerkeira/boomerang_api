const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs-extra');
const { v4: uuidv4 } = require('uuid');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/uncompressed';
        fs.mkdir(uploadPath, { recursive: true }, (err) => {
            if (err) {
                console.error('Error creating directory:', err);
                return cb(err);
            }
            cb(null, uploadPath);
        });
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 15 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(
            path.extname(file.originalname).toLowerCase()
        );
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Só são aceites ficheiros jpeg ou png.'));
    },
}).array('productImage', 5);

const deleteUncompressed = () => {
    if (fs.existsSync('uploads/uncompressed')) {
        fs.emptyDirSync('uploads/uncompressed/', (err) => {
            if (err) {
                console.error(`Error removing file: ${err}`);
                return;
            }

            return console.log(
                'Uncompressed files have been successfully removed.'
            );
        });
    }
};

const compressImages = async (req, res, next) => {
    if (!req.files || req.files.length === 0) return next();

    try {
        await Promise.all(
            req.files.map(async (file) => {
                const filePath = path.join(
                    'uploads/uncompressed',
                    file.filename
                );
                const compressedFilePath = path.join(
                    'uploads',
                    `compressed-${file.filename}`
                );

                await sharp(filePath)
                    .resize({ width: 600, height: 600, fit: 'inside' })
                    .toBuffer()
                    .then(async (buffer) => {
                        await fs.promises.writeFile(compressedFilePath, buffer);
                    })
                    .catch((err) => console.error('Error during image compression:', err));
            })
        );
        deleteUncompressed();
    } catch (err) {
        console.error('Error during image processing:', err);
        return res.status(500).json({ message: 'Failed to process images.' });
    }
    next();
};

const uploadMiddleware = (req, res, next) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: 'Este ficheiro ultrapassa o limite de 15MB.',
                });
            }
            return res.status(400).json({ message: err.message });
        }
        if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

module.exports = { uploadMiddleware, compressImages, deleteUncompressed };
