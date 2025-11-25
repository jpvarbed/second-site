import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { format } from "date-fns";

const postsDirectory = path.join(process.cwd(), "_posts");

async function main() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Post Title:",
            validate: (input) => input.length > 0 || "Title is required",
        },
        {
            type: "list",
            name: "type",
            message: "Post Type:",
            choices: ["Post", "Book", "Review", "Note"],
            default: "Post",
        },
        {
            type: "input",
            name: "subject",
            message: "Subject (e.g. Book, Tech, Life):",
            default: (answers: { type: string }) => (answers.type === "Book" ? "Book" : "Tech"),
        },
        {
            type: "input",
            name: "excerpt",
            message: "Excerpt:",
        },
    ]);

    const slug = answers.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    const date = new Date().toISOString();
    const filename = `${slug}.md`;
    const filepath = path.join(postsDirectory, filename);

    if (fs.existsSync(filepath)) {
        console.error(`Error: Post ${filename} already exists.`);
        process.exit(1);
    }

    const frontmatter = [
        "---",
        `title: "${answers.title}"`,
        `excerpt: "${answers.excerpt}"`,
        `date: "${date}"`,
        `type: "${answers.type}"`,
        `subject: "${answers.subject}"`,
        "author:",
        '  name: "Jason Varbedian"',
    ];

    if (answers.type === "Book") {
        frontmatter.push('coverImage: ""'); // Will be filled by update-covers
    } else {
        frontmatter.push('coverImage: "/assets/blog/preview/cover.jpg"');
    }

    frontmatter.push("---", "", `# ${answers.title}`, "", "");

    fs.writeFileSync(filepath, frontmatter.join("\n"));

    console.log(`Created new post: ${filepath}`);
}

main().catch(console.error);
