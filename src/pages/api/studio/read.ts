import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const filePath = req.query.path as string;

    if (!filePath) {
        return res.status(400).json({ error: 'Path is required' });
    }

    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'File not found' });
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        res.status(200).json({
            content,
            frontmatter: data,
            raw: fileContent
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
