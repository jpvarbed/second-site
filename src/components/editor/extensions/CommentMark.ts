import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentMarkOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        comment: {
            /**
             * Set a comment mark
             */
            setComment: (commentId: string) => ReturnType;
            /**
             * Unset a comment mark
             */
            unsetComment: (commentId: string) => ReturnType;
        };
    }
}

export const CommentMark = Mark.create<CommentMarkOptions>({
    name: 'comment',

    addOptions() {
        return {
            HTMLAttributes: {
                class: 'comment-mark',
            },
        };
    },

    addAttributes() {
        return {
            commentId: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-comment-id'),
                renderHTML: (attributes) => {
                    if (!attributes.commentId) {
                        return {};
                    }

                    return {
                        'data-comment-id': attributes.commentId,
                        style: 'background-color: #fff3cd; border-bottom: 2px solid #ffc107; cursor: pointer;',
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-comment-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setComment:
                (commentId) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { commentId });
                    },
            unsetComment:
                (commentId) =>
                    ({ commands }) => {
                        return commands.unsetMark(this.name);
                    },
        };
    },
});
