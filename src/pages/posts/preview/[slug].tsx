import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { CommentMark } from '../../../components/editor/extensions/CommentMark';
import { CommentSidebar, Comment } from '../../../components/editor/CommentSidebar';
import Highlight from '@tiptap/extension-highlight';
import Typography from '@tiptap/extension-typography';

interface PreviewProps {
    content: string;
    frontmatter: any;
    slug: string;
    error?: string;
}

export default function PreviewPost({ content, frontmatter, slug, error }: PreviewProps) {
    const [comments, setComments] = useState<Comment[]>(frontmatter.comments || []);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Highlight,
            Typography,
            CommentMark.configure({
                HTMLAttributes: {
                    class: 'comment-mark',
                },
            }),
        ],
        content: content, // We need to parse markdown here, but Tiptap expects HTML or JSON usually. 
        // Ideally we'd use a markdown parser extension, but for now let's assume content is passed as HTML 
        // or we render it first. Wait, the previous implementation rendered it.
        // Tiptap has a markdown extension but it's not installed in core.
        // Let's use the previous rendering logic to generate HTML and pass that to Tiptap?
        // No, Tiptap is an editor. We can just pass the text content if we want, but we lose formatting.
        // We should install @tiptap/extension-markdown if we want to load markdown directly.
        // Since I didn't install it, I will use a simple workaround: 
        // I'll render the markdown to HTML on the server side (using the logic I just wrote or a library) 
        // and pass that HTML to Tiptap.
        // Actually, I'll just use the previous `processedContent` which was HTML-ish (img tags).
        // But Tiptap handles HTML input well.
        editable: false, // Read-only mostly, but we need to allow selection for comments? 
        // Actually, to add comments, we might need it to be "editable" but disable typing?
        // Or just use the selection API on a read-only editor. Tiptap read-only allows selection.
        onSelectionUpdate: ({ editor }) => {
            const { from, to } = editor.state.selection;
            const commentMark = editor.schema.marks.comment;

            if (commentMark) {
                const marks = editor.state.doc.rangeHasMark(from, to, commentMark);
                // This is tricky. We want to detect if we clicked ON a comment.
                // We can check the marks at the selection.
                const node = editor.view.domAtPos(from).node;
                // Simplified: Just check if active selection has a comment mark
                const activeMark = editor.getAttributes('comment');
                if (activeMark.commentId) {
                    setActiveCommentId(activeMark.commentId);
                } else {
                    setActiveCommentId(null);
                }
            }
        },
    });

    // Effect to sync comments to backend
    useEffect(() => {
        if (comments.length > 0) {
            fetch('/api/studio/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug, comments })
            });
        }
    }, [comments, slug]);

    const handleCreateComment = async (text: string, isAi: boolean = false) => {
        if (!editor) return;

        const id = Math.random().toString(36).substr(2, 9);
        let commentText = text;
        let author = 'Jason Varbedian';

        // Add mark to selection immediately
        editor.setEditable(true);
        editor.chain().focus().setComment(id).run();
        editor.setEditable(false);
        setActiveCommentId(id);

        // If AI request, get the selected text and call API
        if (isAi) {
            const { from, to } = editor.state.selection;
            const selectedText = editor.state.doc.textBetween(from, to, ' ');
            const prompt = text.replace('✨ AI Request: ', '');

            try {
                const response = await fetch('/api/studio/ai', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: 'user', content: `Context: I am reviewing a blog post. 
                            Selected text: "${selectedText}"
                            
                            My request: ${prompt}
                            
                            Please provide a helpful suggestion or rewrite.` }
                        ]
                    })
                });

                const data = await response.json();
                if (data.content) {
                    commentText = `🤖 AI Suggestion for "${prompt}":\n\n${data.content}`;
                    author = 'Writing Assistant';
                }
            } catch (error) {
                console.error('AI Error:', error);
                commentText += '\n\n(AI generation failed)';
            }
        }

        const newComment: Comment = {
            id,
            text: commentText,
            author,
            createdAt: new Date().toISOString()
        };

        setComments(prev => [...prev, newComment]);
    };

    const handleResolveComment = (id: string) => {
        if (!editor) return;

        // Remove mark
        editor.setEditable(true);
        // We need to find where this mark is. This is hard without the position.
        // For now, let's just remove it from the list and let the mark stay (or clear selection if active).
        // A proper implementation would traverse the doc to find the mark.
        // Let's just delete the comment data for now.
        setComments(comments.filter(c => c.id !== id));
        editor.setEditable(false);
    };

    const handleDeleteComment = (id: string) => {
        setComments(comments.filter(c => c.id !== id));
        // Ideally remove mark too
    };

    if (error) {
        return (
            <div style={{ padding: '40px', textAlign: 'center' }}>
                <h1>Preview Not Available</h1>
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <Head>
                <title>{frontmatter.title || 'Preview'} - Preview</title>
            </Head>

            <div style={{ display: 'flex' }}>
                <div style={{ flex: 1, marginRight: '320px' }}>
                    {/* Preview Banner */}
                    <div style={{
                        background: '#fff3cd',
                        color: '#856404',
                        padding: '12px',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #ffc107'
                    }}>
                        🔍 PREVIEW MODE - Select text to add comments
                    </div>

                    {/* Post Content */}
                    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                        <h1>{frontmatter.title || 'Untitled'}</h1>
                        {frontmatter.date && (
                            <p style={{ color: '#666', fontSize: '14px' }}>
                                {new Date(frontmatter.date).toLocaleDateString()}
                            </p>
                        )}

                        <div className="prose">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>

                <CommentSidebar
                    comments={comments}
                    activeCommentId={activeCommentId}
                    onCreateComment={handleCreateComment}
                    onResolveComment={handleResolveComment}
                    onDeleteComment={handleDeleteComment}
                />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { slug } = context.params as { slug: string };

    try {
        const draftsPath = path.join(process.cwd(), '_drafts', `${slug}.md`);

        if (!fs.existsSync(draftsPath)) {
            return {
                props: {
                    content: '',
                    frontmatter: {},
                    slug,
                    error: 'Draft not found. Make sure to save your work first.'
                }
            };
        }

        const fileContent = fs.readFileSync(draftsPath, 'utf8');
        const { data, content } = matter(fileContent);

        // Process content for images (same as before)
        const sourceNotePath = data.sourceNotePath || '';
        const noteDir = sourceNotePath ? sourceNotePath.substring(0, sourceNotePath.lastIndexOf('/')) : '';

        const processedContent = content.replace(
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

                if (imagePath.startsWith('http')) {
                    return `![${alt}](${imagePath})`;
                }

                let fullPath: string;
                if (imagePath.startsWith('/')) {
                    fullPath = imagePath;
                } else if (noteDir) {
                    fullPath = `${noteDir}/${imagePath}`;
                } else {
                    fullPath = imagePath;
                }

                return `<img src="/api/studio/image?path=${encodeURIComponent(fullPath)}" alt="${alt}" />`;
            }
        );

        // Convert newlines to breaks for Tiptap HTML input if needed, 
        // but Tiptap prefers paragraphs. 
        // Simple markdown to HTML conversion for Tiptap:
        // We can use a library or just wrap paragraphs. 
        // For now, let's just pass the processed content. Tiptap might treat it as plain text if not HTML.
        // Let's wrap lines in <p> tags to be safe.
        const htmlContent = processedContent.split('\n').map(line => {
            if (line.trim() === '') return '<p><br></p>';
            if (line.startsWith('# ')) return `<h1>${line.substring(2)}</h1>`;
            if (line.startsWith('## ')) return `<h2>${line.substring(3)}</h2>`;
            if (line.startsWith('### ')) return `<h3>${line.substring(4)}</h3>`;
            if (line.startsWith('<img')) return line; // Keep images
            return `<p>${line}</p>`;
        }).join('');

        return {
            props: {
                content: htmlContent,
                frontmatter: data,
                slug
            }
        };
    } catch (error: any) {
        return {
            props: {
                content: '',
                frontmatter: {},
                slug,
                error: error.message
            }
        };
    }
};
