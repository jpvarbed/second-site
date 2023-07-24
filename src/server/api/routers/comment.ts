import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  all_comments: publicProcedure
    .input(z.object({ permalink: z.string() }))
    .query(async ({ ctx, input }) => {
      const { permalink } = input;

      try {
        const comments = await ctx.prisma.comment.findMany({
          where: {
            Post: {
              permalink,
            },
          },
          include: {
            user: true,
          },
        });

        return comments;
      } catch (e) {
        console.log(e);
        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
  add_comment: protectedProcedure
    .input(
      z.object({
        body: z.string(),
        permalink: z.string(),
        parentId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { body, permalink, parentId } = input;

      const user = ctx.session?.user;

      try {
        const comment = await ctx.prisma.comment.create({
          data: {
            body,
            Post: {
              connect: {
                permalink,
              },
            },
            user: {
              connect: {
                id: user?.id,
              },
            },
            ...(parentId && {
              parent: {
                connect: {
                  id: parentId,
                },
              },
            }),
          },
        });
        return comment;
      } catch (e) {
        console.log(e);

        throw new TRPCError({
          code: "BAD_REQUEST",
        });
      }
    }),
});
