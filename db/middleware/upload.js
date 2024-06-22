// db/middleware/uploadMiddleware.js
const multer = require('multer');
const sharp = require('sharp');
const streamifier = require('streamifier');
const { uploadBlob } = require('@vercel/blob');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const uploadToVercelBlob = async (file) => {
    const stream = streamifier.createReadStream(file.buffer);
    const blob = await uploadBlob({
        name: `uploads/uncompressed/${file.originalname}`,
        body: stream,
        size: file.size,
        contentType: file.mimetype,
    });
    return blob.url;
};

const compressAndUpload = async (file) => {
    const compressedBuffer = await sharp(file.buffer)
        .resize({ width: 600, height: 600, fit: 'inside' })
        .toBuffer();

    const stream = streamifier.createReadStream(compressedBuffer);
    const blob = await uploadBlob({
        name: `uploads/compressed-${file.originalname}`,
        body: stream,
        size: compressedBuffer.length,
        contentType: file.mimetype,
    });

    return blob.url;
};

const uploadMiddleware = (req, res, next) => {
    upload.array('productImage', 5)(req, res, async (err) => {
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

        try {
            const urls = await Promise.all(
                req.files.map(async (file) => {
                    const url = await uploadToVercelBlob(file);
                    const compressedUrl = await compressAndUpload(file);
                    return { original: url, compressed: compressedUrl };
                })
            );
            req.uploadedFiles = urls;
            next();
        } catch (err) {
            console.error('Error during file upload:', err);
            return res.status(500).json({ message: 'Failed to upload files.' });
        }
    });
};

module.exports = uploadMiddleware;
