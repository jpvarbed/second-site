import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const dirPath = req.query.path as string;

    if (!dirPath) {
        return res.status(400).json({ error: 'Path is required' });
    }

    try {
        if (!fs.existsSync(dirPath)) {
            return res.status(404).json({ error: 'Directory not found' });
        }

        const stats = fs.statSync(dirPath);
        if (!stats.isDirectory()) {
            return res.status(400).json({ error: 'Path is not a directory' });
        }

        const files = fs.readdirSync(dirPath).filter(file => {
            return file.endsWith('.md') || fs.statSync(path.join(dirPath, file)).isDirectory();
        }).map(file => {
            const fullPath = path.join(dirPath, file);
            const isDir = fs.statSync(fullPath).isDirectory();
            return {
                name: file,
                path: fullPath,
                isDirectory: isDir
            };
        });

        res.status(200).json({ files });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
