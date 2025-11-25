import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function WritingStudio() {
    const [obsidianPath, setObsidianPath] = useState('/Users/jasonvarbedian/Documents/Obsidian');
    const [directFilePath, setDirectFilePath] = useState('');
    const [files, setFiles] = useState<any[]>([]);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [content, setContent] = useState('');
    const [frontmatter, setFrontmatter] = useState<any>({});
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [userMessage, setUserMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
    const [isDraft, setIsDraft] = useState(true);

    // Load files from directory
    const loadFiles = async () => {
        try {
            const res = await fetch(`/api/studio/files?path=${encodeURIComponent(obsidianPath)}`);
            const data = await res.json();
            if (data.files) {
                setFiles(data.files);
            }
        } catch (error) {
            console.error('Error loading files:', error);
        }
    };

    // Load a specific file
    const loadFile = async (path: string) => {
        try {
            const res = await fetch(`/api/studio/read?path=${encodeURIComponent(path)}`);
            const data = await res.json();
            if (data.content) {
                setContent(data.content);
                setFrontmatter(data.frontmatter || {});
                setSelectedFile(path);
                setChatHistory([]);
            }
        } catch (error) {
            console.error('Error loading file:', error);
            alert('Error loading file: ' + error);
        }
    };

    // Load file from direct path input
    const loadDirectFile = () => {
        if (directFilePath.trim()) {
            loadFile(directFilePath.trim());
        }
    };

    // Send message to AI
    const sendMessage = async () => {
        if (!userMessage.trim()) return;

        setIsLoading(true);
        const newHistory = [...chatHistory, { role: 'user', content: userMessage }];
        setChatHistory(newHistory);

        try {
            const res = await fetch('/api/studio/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: userMessage,
                    context: content,
                    history: newHistory.map(h => ({ role: h.role, parts: [{ text: h.content }] }))
                })
            });

            const data = await res.json();
            if (data.response) {
                setChatHistory([...newHistory, { role: 'model', content: data.response }]);

                // If the AI response looks like it's trying to rewrite content, update the editor
                if (userMessage.toLowerCase().includes('rewrite') ||
                    userMessage.toLowerCase().includes('change') ||
                    userMessage.toLowerCase().includes('make')) {
                    // Simple heuristic: if response is longer than 50 chars and looks like markdown, use it
                    if (data.response.length > 50) {
                        setContent(data.response);
                    }
                }
            }
            setUserMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-save to drafts
    useEffect(() => {
        if (!selectedFile || !content) return;

        const timer = setTimeout(async () => {
            await saveDraft();
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [content, frontmatter]);

    // Save as draft
    const saveDraft = async () => {
        if (!selectedFile) return;

        const filename = selectedFile.split('/').pop()?.replace('.md', '') || 'untitled';
        setSaveStatus('saving');

        try {
            const res = await fetch('/api/studio/autosave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    frontmatter: {
                        ...frontmatter,
                        layout: '@/layouts/post.astro',
                        date: frontmatter.date || new Date().toISOString(),
                        author: { name: 'Jason Varbedian' },
                        sourceNotePath: selectedFile  // Store source path for preview
                    },
                    filename
                })
            });

            const data = await res.json();
            if (data.success) {
                setSaveStatus('saved');
                setIsDraft(true);
            }
        } catch (error) {
            console.error('Error saving draft:', error);
            setSaveStatus('unsaved');
        }
    };

    // Publish post
    const publishPost = async () => {
        if (!selectedFile) return;

        const filename = selectedFile.split('/').pop()?.replace('.md', '') || 'untitled';
        setSaveStatus('saving');

        try {
            const res = await fetch('/api/studio/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content,
                    frontmatter: {
                        ...frontmatter,
                        layout: '@/layouts/post.astro',
                        date: frontmatter.date || new Date().toISOString(),
                        author: { name: 'Jason Varbedian' }
                    },
                    filename,
                    isDraft: false,
                    sourceNotePath: selectedFile
                })
            });

            const data = await res.json();
            if (data.success) {
                setSaveStatus('saved');
                setIsDraft(false);
                const imageCount = data.copiedImages?.length || 0;
                alert(`Post published successfully!${imageCount > 0 ? ` ${imageCount} image(s) copied.` : ''}`);
            }
        } catch (error) {
            console.error('Error publishing post:', error);
            alert('Error publishing post');
            setSaveStatus('unsaved');
        }
    };

    // Preview post
    const previewPost = () => {
        if (!selectedFile) return;
        const slug = selectedFile.split('/').pop()?.replace('.md', '') || 'untitled';
        window.open(`/posts/preview/${slug}`, '_blank');
    };

    // Process content to replace image paths with API URLs
    const processedContent = content.replace(
        // Match both Obsidian ![[image]] and standard markdown ![](image)
        /!\[\[([^\]]+)\]\]|!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, obsidianImage, mdAlt, mdPath) => {
            let imagePath: string;
            let alt: string;

            if (obsidianImage) {
                // Obsidian syntax: ![[image.png]] or ![[image.png|alt text]]
                const parts = obsidianImage.split('|');
                imagePath = parts[0].trim();
                alt = parts[1]?.trim() || imagePath;
            } else {
                // Standard markdown: ![alt](path)
                imagePath = mdPath;
                alt = mdAlt || '';
            }

            // If it's a local path (not http), serve via our API
            if (!imagePath.startsWith('http')) {
                let fullPath: string;

                // Check if it's an absolute path
                if (imagePath.startsWith('/')) {
                    fullPath = imagePath;
                } else {
                    // Relative path - resolve relative to the note's directory
                    const noteDir = selectedFile ? selectedFile.substring(0, selectedFile.lastIndexOf('/')) : obsidianPath;
                    fullPath = `${noteDir}/${imagePath}`;
                }

                return `![${alt}](/api/studio/image?path=${encodeURIComponent(fullPath)})`;
            }
            return match;
        }
    );

    // Quick prompt suggestions
    const quickPrompts = [
        "Summarize this in 2-3 sentences",
        "Make the intro more engaging",
        "Add more examples",
        "Simplify the language",
        "Make it more technical",
        "Add a conclusion",
        "Fix grammar and spelling"
    ];

    useEffect(() => {
        loadFiles();
    }, [obsidianPath]);

    return (
        <>
            <Head>
                <title>Writing Studio</title>
            </Head>
            <div style={{ display: 'flex', height: '100vh', fontFamily: 'system-ui, sans-serif' }}>
                {/* Sidebar - File Browser */}
                <div style={{ width: '300px', borderRight: '1px solid #ddd', padding: '20px', overflowY: 'auto', background: '#f9f9f9' }}>
                    <h2 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>File Selection</h2>

                    {/* Direct File Path */}
                    <div style={{ marginBottom: '20px', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                            Direct File Path
                        </label>
                        <input
                            type="text"
                            value={directFilePath}
                            onChange={(e) => setDirectFilePath(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && loadDirectFile()}
                            style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            placeholder="/path/to/your/note.md"
                        />
                        <button
                            onClick={loadDirectFile}
                            style={{ width: '100%', padding: '8px', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                        >
                            Load File
                        </button>
                    </div>

                    {/* Directory Browser */}
                    <div style={{ marginBottom: '10px', padding: '15px', background: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 'bold', color: '#666' }}>
                            Browse Directory
                        </label>
                        <input
                            type="text"
                            value={obsidianPath}
                            onChange={(e) => setObsidianPath(e.target.value)}
                            onBlur={loadFiles}
                            style={{ width: '100%', padding: '8px', marginBottom: '8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '13px' }}
                            placeholder="Directory path"
                        />
                        <button onClick={loadFiles} style={{ width: '100%', padding: '8px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                            Refresh
                        </button>
                    </div>

                    {/* File List */}
                    <div>
                        {files.map((file, idx) => (
                            <div
                                key={idx}
                                onClick={() => {
                                    if (file.isDirectory) {
                                        setObsidianPath(file.path);
                                        loadFiles();
                                    } else {
                                        loadFile(file.path);
                                    }
                                }}
                                style={{
                                    padding: '8px',
                                    marginBottom: '4px',
                                    cursor: 'pointer',
                                    background: selectedFile === file.path ? '#007bff' : 'white',
                                    color: selectedFile === file.path ? 'white' : 'black',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                    fontWeight: file.isDirectory ? 'bold' : 'normal',
                                    border: '1px solid #e0e0e0'
                                }}
                            >
                                {file.isDirectory ? '📁' : '📄'} {file.name}
                            </div>
                        ))}
                    </div>
                </div>
                {/* Main Editor */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #ddd', background: 'white' }}>
                        <h1 style={{ margin: '0 0 10px 0', fontSize: '24px' }}>Writing Studio</h1>
                        {selectedFile && <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>{selectedFile}</p>}
                    </div>

                    <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
                        {/* Editor */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                style={{
                                    flex: 1,
                                    width: '100%',
                                    padding: '16px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    fontSize: '14px',
                                    resize: 'none'
                                }}
                                placeholder="Select a file to edit..."
                            />

                            {/* Save Status */}
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '12px', color: '#666' }}>
                                    {saveStatus === 'saving' && '💾 Saving...'}
                                    {saveStatus === 'saved' && '✓ Saved'}
                                    {saveStatus === 'unsaved' && '⚠ Unsaved changes'}
                                </span>
                                {isDraft && <span style={{ fontSize: '12px', padding: '2px 8px', background: '#fff3cd', color: '#856404', borderRadius: '4px', fontWeight: 'bold' }}>DRAFT</span>}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={saveDraft}
                                    disabled={!selectedFile}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: selectedFile ? '#6c757d' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: selectedFile ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Save Draft
                                </button>
                                <button
                                    onClick={previewPost}
                                    disabled={!selectedFile}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: selectedFile ? '#007bff' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: selectedFile ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={publishPost}
                                    disabled={!selectedFile}
                                    style={{
                                        flex: 1,
                                        padding: '12px',
                                        background: selectedFile ? '#28a745' : '#ccc',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: selectedFile ? 'pointer' : 'not-allowed',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Publish
                                </button>
                            </div>
                        </div>

                        {/* Preview */}
                        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', background: '#f9f9f9', borderLeft: '1px solid #ddd' }}>
                            <h3 style={{ marginTop: 0 }}>Preview</h3>
                            <div
                                dangerouslySetInnerHTML={{ __html: processedContent.replace(/\n/g, '<br/>') }}
                                style={{ lineHeight: '1.6' }}
                            />
                        </div>
                    </div>
                </div>

                {/* AI Chat Panel */}
                <div style={{ width: '400px', borderLeft: '1px solid #ddd', display: 'flex', flexDirection: 'column', background: 'white' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid #ddd' }}>
                        <h2 style={{ margin: 0, fontSize: '18px' }}>AI Assistant</h2>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
                        {/* Quick Prompts */}
                        {chatHistory.length === 0 && (
                            <div style={{ marginBottom: '20px' }}>
                                <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px', fontWeight: 'bold' }}>Quick Prompts:</p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                    {quickPrompts.map((prompt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setUserMessage(prompt);
                                            }}
                                            style={{
                                                padding: '6px 12px',
                                                background: '#e3f2fd',
                                                border: '1px solid #90caf9',
                                                borderRadius: '16px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                color: '#1976d2'
                                            }}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {chatHistory.map((msg, idx) => (
                            <div
                                key={idx}
                                style={{
                                    marginBottom: '16px',
                                    padding: '12px',
                                    background: msg.role === 'user' ? '#e3f2fd' : '#f5f5f5',
                                    borderRadius: '8px',
                                    fontSize: '14px'
                                }}
                            >
                                <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>
                                <div style={{ marginTop: '4px' }}>{msg.content}</div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px', fontSize: '14px' }}>
                                AI is thinking...
                            </div>
                        )}
                    </div>

                    <div style={{ padding: '20px', borderTop: '1px solid #ddd' }}>
                        <textarea
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                            placeholder="Ask AI to help with your post..."
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                fontSize: '14px',
                                resize: 'none',
                                minHeight: '80px'
                            }}
                        />
                        <button
                            onClick={sendMessage}
                            disabled={isLoading || !userMessage.trim()}
                            style={{
                                marginTop: '8px',
                                width: '100%',
                                padding: '12px',
                                background: isLoading || !userMessage.trim() ? '#ccc' : '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: isLoading || !userMessage.trim() ? 'not-allowed' : 'pointer',
                                fontSize: '14px',
                                fontWeight: 'bold'
                            }}
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
