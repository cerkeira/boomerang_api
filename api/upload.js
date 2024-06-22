// api/upload.js
import { uploadBlob } from '@vercel/blob';
import multer from 'multer';
import streamifier from 'streamifier';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const handler = async (req, res) => {
    if (req.method === 'POST') {
        upload.single('productImage')(req, res, async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to upload file' });
            }

            try {
                const stream = streamifier.createReadStream(req.file.buffer);
                const blob = await uploadBlob({
                    name: `uploads/uncompressed/${req.file.originalname}`,
                    body: stream,
                    size: req.file.size,
                    contentType: req.file.mimetype,
                });

                res.status(200).json({
                    message: 'File uploaded successfully',
                    url: blob.url,
                });
            } catch (error) {
                console.error('Error uploading to Vercel Blob:', error);
                res.status(500).json({
                    error: 'Failed to upload to Vercel Blob',
                });
            }
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
};

export default handler;

export const config = {
    api: {
        bodyParser: false, // Disallow default body parsing, as multer handles it
    },
};
