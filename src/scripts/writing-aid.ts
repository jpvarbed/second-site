import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import matter from "gray-matter";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
dotenv.config();

const postsDirectory = path.join(process.cwd(), "_posts");

// Helper to generate content with Gemini (with fallback)
async function generateWithGemini(prompt: string): Promise<string | null> {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return null;

    try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(apiKey);

        const modelsToTry = ["gemini-2.5-pro", "gemini-2.0-pro-exp-02-05", "gemini-2.0-flash-thinking-exp-01-21", "gemini-2.0-flash"];

        for (const modelName of modelsToTry) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text().trim();
            } catch (e: any) {
                if (e.message.includes("404") || e.message.includes("not found")) {
                    continue;
                }
                throw e;
            }
        }
        return null; // All models failed
    } catch (error) {
        console.error("Error calling Gemini:", error);
        return null;
    }
}

async function main() {
    // 1. Prompt for file path
    const { filePath } = await inquirer.prompt([
        {
            type: "input",
            name: "filePath",
            message: "Absolute path to Obsidian note:",
            validate: (input) => {
                if (!fs.existsSync(input)) return "File does not exist";
                if (!input.endsWith(".md")) return "File must be a markdown file";
                return true;
            },
        },
    ]);

    // 2. Read file
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { data: existingFrontmatter, content: rawContent } = matter(fileContent);

    // 3. Choose Mode
    const { mode } = await inquirer.prompt([
        {
            type: "list",
            name: "mode",
            message: "Choose mode:",
            choices: ["Quick Import", "Writing Aid (Interactive)"],
            default: "Writing Aid (Interactive)",
        },
    ]);

    let processedContent = rawContent;
    let finalSummary = existingFrontmatter.excerpt || "";

    // Convert WikiLinks [[Link]] -> [Link](/posts/Link)
    processedContent = processedContent.replace(/\[\[([^\]]+)\]\]/g, (match, p1) => {
        const [link, alias] = p1.split("|");
        const displayText = alias || link;
        const slug = link.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
        return `[${displayText}](/posts/${slug})`;
    });

    if (mode === "Writing Aid (Interactive)" && process.env.GOOGLE_API_KEY) {
        console.log("\n--- 🤖 Writing Aid Mode ---\n");

        // A. Structure Analysis
        console.log("Analyzing content structure...");
        const structurePrompt = `Analyze the following blog post draft. Suggest a better structure (headings, sections) to make it more engaging and readable. Return ONLY the suggested structure outline (bullet points). \n\n${processedContent.substring(0, 3000)}`; // Limit context
        const structureSuggestion = await generateWithGemini(structurePrompt);

        if (structureSuggestion) {
            console.log("\nSuggested Structure:\n" + structureSuggestion);
            const { applyStructure } = await inquirer.prompt([{
                type: "confirm",
                name: "applyStructure",
                message: "Do you want to apply this structure? (This is a manual step for now - say Yes to acknowledge)",
                default: false
            }]);
            if (applyStructure) {
                console.log("Great! You can use this outline to reorganize your content in the editor later.");
            }
        }

        // B. Iterative Summarization
        console.log("\nDrafting summary...");
        let currentSummary = await generateWithGemini(`Summarize this text for a blog post excerpt (2-3 sentences):\n\n${processedContent.substring(0, 3000)}`);

        if (currentSummary) {
            while (true) {
                console.log(`\nCurrent Summary:\n"${currentSummary}"`);

                const { action } = await inquirer.prompt([{
                    type: "list",
                    name: "action",
                    message: "What do you want to do with this summary?",
                    choices: ["Accept", "Refine with AI", "Edit Manually"],
                }]);

                if (action === "Accept") {
                    finalSummary = currentSummary;
                    break;
                } else if (action === "Edit Manually") {
                    const { manualEdit } = await inquirer.prompt([{
                        type: "input",
                        name: "manualEdit",
                        message: "Edit summary:",
                        default: currentSummary
                    }]);
                    finalSummary = manualEdit;
                    break;
                } else if (action === "Refine with AI") {
                    const { instruction } = await inquirer.prompt([{
                        type: "input",
                        name: "instruction",
                        message: "Instructions (e.g., 'Make it punchier', 'Focus on tech'):",
                    }]);
                    const newSummary = await generateWithGemini(`Original Text: ${processedContent.substring(0, 1000)}\n\nCurrent Summary: ${currentSummary}\n\nRefinement Instruction: ${instruction}\n\nNew Summary:`);
                    if (newSummary) currentSummary = newSummary;
                }
            }
        }
    } else if (mode === "Writing Aid (Interactive)" && !process.env.GOOGLE_API_KEY) {
        console.log("⚠️  GOOGLE_API_KEY not found. Skipping AI features.");
    }

    // 4. Metadata Prompt
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Post Title:",
            default: existingFrontmatter.title || path.basename(filePath, ".md"),
            validate: (input) => input.length > 0 || "Title is required",
        },
        {
            type: "list",
            name: "type",
            message: "Post Type:",
            choices: ["Post", "Book", "Review", "Note"],
            default: existingFrontmatter.type || "Note",
        },
        {
            type: "input",
            name: "subject",
            message: "Subject:",
            default: (answers: any) => existingFrontmatter.subject || (answers.type === "Book" ? "Book" : "Tech"),
        },
        {
            type: "input",
            name: "excerpt",
            message: "Excerpt:",
            default: finalSummary,
        },
    ]);

    // 5. Construct File
    const slug = answers.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "");

    const date = new Date().toISOString();
    const targetFilename = `${slug}.md`;
    const targetPath = path.join(postsDirectory, targetFilename);

    if (fs.existsSync(targetPath)) {
        const { overwrite } = await inquirer.prompt([
            {
                type: "confirm",
                name: "overwrite",
                message: `Post ${targetFilename} already exists. Overwrite?`,
                default: false,
            },
        ]);
        if (!overwrite) {
            console.log("Aborted.");
            return;
        }
    }

    const newFrontmatter: Record<string, any> = {
        layout: "@/layouts/post.astro",
        date: existingFrontmatter.date || date,
        author: { name: "Jason Varbedian" },
        ...existingFrontmatter,
        title: answers.title,
        excerpt: answers.excerpt,
        type: answers.type,
        subject: answers.subject,
    };

    if (!newFrontmatter.coverImage) {
        if (answers.type === "Book") {
            newFrontmatter.coverImage = "";
        } else {
            newFrontmatter.coverImage = "/assets/blog/preview/cover.jpg";
        }
    }

    const newFileContent = matter.stringify(processedContent, newFrontmatter);
    fs.writeFileSync(targetPath, newFileContent);
    console.log(`\nSuccessfully imported to: ${targetPath}`);
}

main().catch(console.error);
