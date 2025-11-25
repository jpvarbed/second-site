import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { content, frontmatter, filename, isDraft = false, sourceNotePath } = req.body;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    try {
        const slug = filename.replace('.md', '');
        const targetDir = isDraft ? '_drafts' : '_posts';
        const postsDirectory = path.join(process.cwd(), targetDir);
        const targetPath = path.join(postsDirectory, filename.endsWith('.md') ? filename : `${filename}.md`);

        let finalContent = content;
        const copiedImages: string[] = [];

        // If publishing (not draft), copy images and update paths
        if (!isDraft && sourceNotePath) {
            const noteDir = sourceNotePath.substring(0, sourceNotePath.lastIndexOf('/'));
            const assetsDir = path.join(process.cwd(), 'public', 'assets', 'posts', slug);

            // Ensure assets directory exists
            if (!fs.existsSync(assetsDir)) {
                fs.mkdirSync(assetsDir, { recursive: true });
            }

            // Find all images in content (both Obsidian and markdown syntax)
            const imageRegex = /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g;
            let match: RegExpExecArray | null;
            const imageMap = new Map<string, string>();

            while ((match = imageRegex.exec(content)) !== null) {
                let imagePath: string;

                if (match[1]) {
                    // Obsidian syntax: ![[image.png]] or ![[image.png|alt]]
                    imagePath = match[1]?.split('|')[0]?.trim() || '';
                } else if (match[3]) {
                    // Standard markdown: ![](path)
                    imagePath = match[3];
                } else {
                    continue;
                }

                // Skip if already http/https
                if (imagePath.startsWith('http')) continue;

                // Resolve full path
                let fullPath: string;
                if (imagePath.startsWith('/')) {
                    fullPath = imagePath;
                } else {
                    fullPath = path.join(noteDir, imagePath);
                }

                // Copy image if it exists
                if (fs.existsSync(fullPath)) {
                    const imageName = path.basename(fullPath);
                    const targetImagePath = path.join(assetsDir, imageName);

                    // Copy if not already there
                    if (!fs.existsSync(targetImagePath)) {
                        fs.copyFileSync(fullPath, targetImagePath);
                        copiedImages.push(imageName);
                    }

                    // Map old path to new path
                    imageMap.set(imagePath, `/assets/posts/${slug}/${imageName}`);
                }
            }

            // Replace image paths in content
            finalContent = content.replace(
                /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g,
                (match: string, obsidianImage: string | undefined, mdAlt: string | undefined, mdPath: string | undefined) => {
                    let imagePath: string;
                    let alt: string;

                    if (obsidianImage) {
                        const parts = obsidianImage.split('|');
                        imagePath = parts[0]?.trim() || '';
                        alt = parts[1]?.trim() || imagePath;
                    } else if (mdPath) {
                        imagePath = mdPath;
                        alt = mdAlt || '';
                    } else {
                        return match;
                    }

                    // Replace with new path if we have it
                    const newPath = imageMap.get(imagePath);
                    if (newPath) {
                        return `![${alt}](${newPath})`;
                    }

                    // If it's already an http URL, keep it
                    if (imagePath.startsWith('http')) {
                        return match;
                    }

                    // Otherwise keep original
                    return match;
                }
            );
        }

        const fileContent = matter.stringify(finalContent, frontmatter);
        fs.writeFileSync(targetPath, fileContent);

        res.status(200).json({
            success: true,
            path: targetPath,
            copiedImages,
            isDraft
        });
    } catch (error: any) {
        console.error('Save error:', error);
        res.status(500).json({ error: error.message });
    }
}
