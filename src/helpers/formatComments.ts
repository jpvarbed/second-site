import type { Comment } from "@prisma/client";
import type { CommentWithChildren } from "~/utils/trpc";

/**
 * Format comments into a tree structure
 */
function formatComments(comments: Comment[]) {
  const map = new Map();

  const roots: CommentWithChildren[] = [];

  for (let i = 0; i < comments.length; i++) {
    const commentId = comments[i]?.id;

    map.set(commentId, i);

    if (typeof comments[i]?.parentId === "string") {
      // we check for string
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const parentCommentIndex: number = map.get(comments[i]?.parentId);

      (comments[parentCommentIndex] as CommentWithChildren).children.push(
        comments[i] as CommentWithChildren
      );

      continue;
    }

    roots.push(comments[i] as CommentWithChildren);
  }

  return roots;
}

export default formatComments;
