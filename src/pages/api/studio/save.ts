import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { content, frontmatter, filename } = req.body;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    try {
        const postsDirectory = path.join(process.cwd(), '_posts');
        const targetPath = path.join(postsDirectory, filename.endsWith('.md') ? filename : `${filename}.md`);

        const fileContent = matter.stringify(content, frontmatter);

        fs.writeFileSync(targetPath, fileContent);

        res.status(200).json({ success: true, path: targetPath });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
