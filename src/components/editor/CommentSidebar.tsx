import React, { useState } from 'react';

export interface Comment {
    id: string;
    text: string;
    author: string;
    createdAt: string;
    replies?: Comment[];
}

interface CommentSidebarProps {
    comments: Comment[];
    activeCommentId: string | null;
    onCreateComment: (text: string, isAi?: boolean) => Promise<void> | void;
    onResolveComment: (id: string) => void;
    onDeleteComment: (id: string) => void;
}

export const CommentSidebar: React.FC<CommentSidebarProps> = ({
    comments,
    activeCommentId,
    onCreateComment,
    onResolveComment,
    onDeleteComment
}) => {
    const [newCommentText, setNewCommentText] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    const [isAiLoading, setIsAiLoading] = useState(false);

    const handleCreate = () => {
        if (newCommentText.trim()) {
            onCreateComment(newCommentText);
            setNewCommentText('');
            setIsCreating(false);
        }
    };

    const handleAskAi = async () => {
        if (!newCommentText.trim()) return;

        setIsAiLoading(true);
        try {
            // Call the parent's handler which will call the API
            await onCreateComment(`✨ AI Request: ${newCommentText}`, true);
            setNewCommentText('');
            setIsCreating(false);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <div style={{
            width: '300px',
            borderLeft: '1px solid #eee',
            padding: '20px',
            height: '100vh',
            position: 'fixed',
            right: 0,
            top: 0,
            background: 'white',
            overflowY: 'auto',
            zIndex: 100
        }}>
            <h3 style={{ marginTop: 0, marginBottom: '20px', fontSize: '18px' }}>Comments</h3>

            {/* Active Comment Creation */}
            {isCreating ? (
                <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px', border: '1px solid #ddd' }}>
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write a comment or ask AI..."
                        style={{
                            width: '100%',
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ddd',
                            minHeight: '80px',
                            marginBottom: '10px'
                        }}
                        autoFocus
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <button
                            onClick={() => setIsCreating(false)}
                            style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: 'none',
                                color: '#666',
                                cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAskAi}
                            disabled={isAiLoading || !newCommentText.trim()}
                            style={{
                                padding: '6px 12px',
                                background: '#6f42c1',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            {isAiLoading ? 'Thinking...' : '✨ Ask AI'}
                        </button>
                        <button
                            onClick={handleCreate}
                            disabled={isAiLoading || !newCommentText.trim()}
                            style={{
                                padding: '6px 12px',
                                background: '#007bff',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Comment
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setIsCreating(true)}
                    style={{
                        width: '100%',
                        padding: '10px',
                        marginBottom: '20px',
                        background: '#f8f9fa',
                        border: '1px dashed #ccc',
                        borderRadius: '4px',
                        color: '#666',
                        cursor: 'pointer'
                    }}
                >
                    + Add Comment to Selection
                </button>
            )}

            {/* Comments List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {comments.length === 0 && !isCreating && (
                    <p style={{ color: '#999', textAlign: 'center', fontStyle: 'italic' }}>No comments yet</p>
                )}

                {comments.map(comment => (
                    <div
                        key={comment.id}
                        style={{
                            padding: '15px',
                            borderRadius: '8px',
                            border: activeCommentId === comment.id ? '2px solid #ffc107' : '1px solid #eee',
                            background: activeCommentId === comment.id ? '#fff9db' : 'white',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>{comment.author}</span>
                            <span style={{ fontSize: '12px', color: '#999' }}>
                                {new Date(comment.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', lineHeight: '1.5' }}>{comment.text}</p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                                onClick={() => onResolveComment(comment.id)}
                                style={{
                                    fontSize: '12px',
                                    color: '#28a745',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                ✓ Resolve
                            </button>
                            <button
                                onClick={() => onDeleteComment(comment.id)}
                                style={{
                                    fontSize: '12px',
                                    color: '#dc3545',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                🗑 Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


