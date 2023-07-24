import type { CommentQuery, CommentWithChildren } from "~/utils/trpc";

/**
 * Format comments into a tree structure
 */
function formatComments(comments: CommentQuery[]): CommentWithChildren[] {
  const map = new Map<string, CommentWithChildren>();

  for (const comment of comments) {
    map.set(comment.id, { ...comment, children: [] });
  }

  const roots: CommentWithChildren[] = [];

  for (const comment of map.values()) {
    const parentComment = map.get(comment?.parentId ?? "");
    if (parentComment !== undefined) {
      parentComment.children.push(comment);
    } else {
      roots.push(comment);
    }
  }
  console.log("roots", roots);
  return roots;
}

export default formatComments;
