const multer = require('multer');
const streamifier = require('streamifier');
const sharp = require('sharp');
const { uploadBlob } = require('@vercel/blob');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadMiddleware = (req, res, next) => {
    upload.single('productImage')(req, res, (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to upload file' });
        }
        next();
    });
};

export const handleUpload = async (req, res) => {
    try {
        const stream = streamifier.createReadStream(req.file.buffer);
        const blob = await uploadBlob({
            name: `uploads/uncompressed/${req.file.originalname}`,
            body: stream,
            size: req.file.size,
            contentType: req.file.mimetype,
        });

        const compressedBuffer = await sharp(req.file.buffer)
            .resize({ width: 600, height: 600, fit: 'inside' })
            .toBuffer();

        const compressedStream = streamifier.createReadStream(compressedBuffer);
        const compressedBlob = await uploadBlob({
            name: `uploads/compressed-${req.file.originalname}`,
            body: compressedStream,
            size: compressedBuffer.length,
            contentType: req.file.mimetype,
        });

        res.status(200).json({
            message: 'File uploaded successfully',
            url: blob.url,
            compressedUrl: compressedBlob.url,
        });
    } catch (error) {
        console.error('Error uploading to Vercel Blob:', error);
        res.status(500).json({ error: 'Failed to upload to Vercel Blob' });
    }
};
