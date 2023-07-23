// src/utils/trpc.ts
import type { AppRouter } from "../server/api/root";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
import type { Comment } from "@prisma/client";
export const commentQuery = trpc.comment.all_comments;

export type CommentWithChildren = Comment & {
  children: CommentWithChildren[];
};
