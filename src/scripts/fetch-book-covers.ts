import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "_posts");
const publicDirectory = path.join(process.cwd(), "public");

async function fetchBookCover(title: string): Promise<string | null> {
    try {
        const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(
                title
            )}`
        );
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data = await response.json();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const book = data.items?.[0];
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const imageLinks = book?.volumeInfo?.imageLinks;

        if (!imageLinks) return null;

        // Prioritize higher resolution images
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        const imageUrl = imageLinks.extraLarge ?? imageLinks.large ?? imageLinks.medium ?? imageLinks.thumbnail ?? imageLinks.smallThumbnail;

        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return imageUrl ?? null;
    } catch (error) {
        console.error(`Failed to fetch cover for ${title}:`, error);
        return null;
    }
}

async function downloadImage(url: string, filepath: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filepath, new Uint8Array(buffer));
}

async function main() {
    const files = fs.readdirSync(postsDirectory);

    for (const file of files) {
        if (!file.endsWith(".md")) continue;

        const fullPath = path.join(postsDirectory, file);
        const fileContents = fs.readFileSync(fullPath, "utf8");
        const { data, content } = matter(fileContents);

        if (data.subject === "Book" && data.title) {
            console.log(`Processing book: ${data.title as string}`);

            // Check if cover image already exists and is local
            if (data.coverImage && (data.coverImage as string).startsWith("/assets/images/books/")) {
                const existingPath = path.join(publicDirectory, data.coverImage as string);
                if (fs.existsSync(existingPath)) {
                    console.log(`Cover already exists for ${data.title as string}, skipping.`);
                    continue;
                }
            }

            const coverUrl = await fetchBookCover(data.title as string);

            if (coverUrl) {
                const slug = file.replace(/\.md$/, "");

                // Determine extension from Content-Type
                let extension = ".jpg";
                try {
                    const imageResponse = await fetch(coverUrl, { method: 'HEAD' });
                    const contentType = imageResponse.headers.get('content-type');

                    if (contentType) {
                        switch (contentType) {
                            case 'image/jpeg':
                                extension = '.jpg';
                                break;
                            case 'image/png':
                                extension = '.png';
                                break;
                            case 'image/gif':
                                extension = '.gif';
                                break;
                            case 'image/webp':
                                extension = '.webp';
                                break;
                            default:
                                console.warn(`Unknown content type ${contentType} for ${coverUrl}, defaulting to .jpg`);
                        }
                    } else {
                        // Fallback to URL parsing if HEAD fails or no content-type
                        const urlObj = new URL(coverUrl);
                        const pathname = urlObj.pathname;
                        const ext = path.extname(pathname);
                        if (ext) {
                            extension = ext;
                        }
                    }
                } catch (e) {
                    console.warn(`Could not determine content type for ${coverUrl}, defaulting to .jpg`, e);
                }

                // Clean extension (remove any query params if they somehow got in, though path.extname handles most)
                const cleanExt = extension.split(/[?#]/)[0] ?? ".jpg";

                const relativePath = `/assets/images/books/${slug}${cleanExt}`;
                const outputPath = path.join(publicDirectory, "assets", "images", "books", `${slug}${cleanExt}`);

                // Ensure directory exists
                const dir = path.dirname(outputPath);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }

                console.log(`Downloading cover for ${data.title as string} to ${relativePath}`);
                await downloadImage(coverUrl, outputPath);

                // Update frontmatter
                data.coverImage = relativePath;
                const newContent = matter.stringify(content, data);
                fs.writeFileSync(fullPath, newContent);
            } else {
                console.log(`No cover found for ${data.title as string}`);
            }
        }
    }
}

main().catch(console.error);
