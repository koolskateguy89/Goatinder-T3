import type { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "server/api/trpc";
import { scoreStateInclude, toScoreStateComment } from "utils/comments";

export const commentsRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(
      z.object({
        shoeId: z.string().min(1),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { shoeId } = input;

      const userId = ctx.session?.user?.id;

      const comments = await ctx.prisma.shoeComment.findMany({
        where: {
          shoeId,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          ...scoreStateInclude(userId),
        },
        orderBy: {
          // newest comments first
          datePosted: "desc",
        },
      });

      return comments.map(toScoreStateComment);
    }),

  addComment: protectedProcedure
    .input(
      z.object({
        shoeId: z.string().min(1),
        content: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { shoeId, content } = input;

      const authorId = ctx.session.user.id;

      return ctx.prisma.shoeComment
        .create({
          data: {
            content,
            shoe: {
              connect: {
                objectId: shoeId,
              },
            },
            author: {
              connect: {
                id: authorId,
              },
            },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
            // There is no point in including these since they will be empty
            upvoters: {
              select: {
                id: true,
              },
            },
            downvoters: {
              select: {
                id: true,
              },
            },
            _count: {
              select: {
                upvoters: true,
                downvoters: true,
              },
            },
          },
        })
        .then(toScoreStateComment);
    }),

  deleteComment: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      await ctx.prisma.shoeComment.delete({
        where: {
          id,
        },
      });
    }),

  vote: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        vote: z.enum(["up", "down"]),
        remove: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, vote, remove } = input;

      const userId = ctx.session.user.id;

      const votersToConnect: keyof Prisma.ShoeCommentUpdateInput =
        vote === "up" ? "upvoters" : "downvoters";
      const votersToDisconnect: keyof Prisma.ShoeCommentUpdateInput =
        vote === "up" ? "downvoters" : "upvoters";

      let updateData: Prisma.ShoeCommentUpdateInput;
      if (remove) {
        updateData = {
          [votersToConnect]: {
            disconnect: {
              id: userId,
            },
          },
        };
      } else {
        updateData = {
          [votersToConnect]: {
            connect: {
              id: userId,
            },
          },
          [votersToDisconnect]: {
            disconnect: {
              id: userId,
            },
          },
        };
      }

      await ctx.prisma.shoeComment.update({
        where: {
          id,
        },
        data: updateData,
      });
    }),
});
