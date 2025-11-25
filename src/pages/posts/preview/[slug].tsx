import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

interface PreviewProps {
    content: string;
    frontmatter: any;
    error?: string;
}

export default function PreviewPost({ content, frontmatter, error }: PreviewProps) {
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

            {/* Preview Banner */}
            <div style={{
                background: '#fff3cd',
                color: '#856404',
                padding: '12px',
                textAlign: 'center',
                fontWeight: 'bold',
                borderBottom: '2px solid #ffc107'
            }}>
                🔍 PREVIEW MODE - This is how your post will look when published
            </div>

            {/* Post Content */}
            <div style={{ maxWidth: '800px', margin: '40px auto', padding: '0 20px' }}>
                <h1>{frontmatter.title || 'Untitled'}</h1>
                {frontmatter.date && (
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        {new Date(frontmatter.date).toLocaleDateString()}
                    </p>
                )}

                <div
                    dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br/>') }}
                    style={{ lineHeight: '1.8', fontSize: '16px' }}
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
                    error: 'Draft not found. Make sure to save your work first.'
                }
            };
        }

        const fileContent = fs.readFileSync(draftsPath, 'utf8');
        const { data, content } = matter(fileContent);

        return {
            props: {
                content,
                frontmatter: data,
            }
        };
    } catch (error: any) {
        return {
            props: {
                content: '',
                frontmatter: {},
                error: error.message
            }
        };
    }
};
