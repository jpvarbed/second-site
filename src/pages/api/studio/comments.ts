import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { slug, comments } = req.body;

    if (!slug || !comments) {
        return res.status(400).json({ message: 'Missing slug or comments' });
    }

    try {
        const draftsDir = path.join(process.cwd(), '_drafts');
        const filePath = path.join(draftsDir, `${slug}.md`);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'Draft not found' });
        }

        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);

        // Update comments in frontmatter
        const updatedData = {
            ...data,
            comments
        };

        const updatedFileContent = matter.stringify(content, updatedData);
        fs.writeFileSync(filePath, updatedFileContent);

        res.status(200).json({ message: 'Comments saved successfully' });
    } catch (error: any) {
        console.error('Error saving comments:', error);
        res.status(500).json({ message: 'Error saving comments', error: error.message });
    }
}
