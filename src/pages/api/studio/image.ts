import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const imagePath = req.query.path as string;

    if (!imagePath) {
        return res.status(400).json({ error: 'Path is required' });
    }

    try {
        if (!fs.existsSync(imagePath)) {
            return res.status(404).json({ error: 'Image not found' });
        }

        const stat = fs.statSync(imagePath);
        const fileBuffer = fs.readFileSync(imagePath);

        // Simple mime type detection
        const ext = path.extname(imagePath).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.png') contentType = 'image/png';
        if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        if (ext === '.gif') contentType = 'image/gif';
        if (ext === '.webp') contentType = 'image/webp';
        if (ext === '.svg') contentType = 'image/svg+xml';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', stat.size);
        res.send(fileBuffer);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
