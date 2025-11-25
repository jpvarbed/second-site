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

    // Save post
    const savePost = async () => {
        if (!selectedFile) return;

        const filename = selectedFile.split('/').pop()?.replace('.md', '') || 'untitled';

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
                    filename
                })
            });

            const data = await res.json();
            if (data.success) {
                alert('Post saved successfully!');
            }
        } catch (error) {
            console.error('Error saving post:', error);
            alert('Error saving post');
        }
    };

    // Process content to replace image paths with API URLs
    const processedContent = content.replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        (match, alt, imagePath) => {
            // If it's a local path (not http), serve via our API
            if (!imagePath.startsWith('http')) {
                const fullPath = imagePath.startsWith('/')
                    ? imagePath
                    : `${obsidianPath}/${imagePath}`;
                return `![${alt}](/api/studio/image?path=${encodeURIComponent(fullPath)})`;
            }
            return match;
        }
    );

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
                            <button
                                onClick={savePost}
                                disabled={!selectedFile}
                                style={{
                                    marginTop: '16px',
                                    padding: '12px',
                                    background: selectedFile ? '#28a745' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: selectedFile ? 'pointer' : 'not-allowed',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                Save to Blog
                            </button>
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
