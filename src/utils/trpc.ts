import { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../server/api/root";
import { createTRPCReact } from "@trpc/react-query";

export const trpc = createTRPCReact<AppRouter>();
type RouterOutput = inferRouterOutputs<AppRouter>;
/**
 * Comments returned by all_comments query
 */
export type CommentQuery = RouterOutput["comment"]["all_comments"][number];
export type CommentWithChildren = CommentQuery & {
  children: CommentWithChildren[];
};
