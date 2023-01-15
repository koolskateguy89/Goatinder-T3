import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const commentsRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        shoeId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { shoeId, content } = input;

      const authorId = ctx.session.user.id;

      return ctx.prisma.shoeComment.create({
        data: {
          content,
          shoe: {
            connectOrCreate: {
              where: {
                objectId: shoeId,
              },
              create: {
                objectId: shoeId,
              },
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
      });
    }),

  deleteComment: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.shoeComment.delete({
        where: {
          id,
        },
      });
    }),

  upvote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        remove: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, remove } = input;

      const userId = ctx.session.user.id;

      let updateData: Prisma.ShoeCommentUpdateInput;
      if (remove) {
        updateData = {
          upvoters: {
            disconnect: {
              id: userId,
            },
          },
        };
      } else {
        updateData = {
          upvoters: {
            connect: {
              id: userId,
            },
          },
          downvoters: {
            disconnect: {
              id: userId,
            },
          },
        };
      }

      return ctx.prisma.shoeComment.update({
        where: {
          id,
        },
        data: updateData,
      });
    }),

  downvote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        remove: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, remove } = input;

      const userId = ctx.session.user.id;

      let updateData: Prisma.ShoeCommentUpdateInput;
      if (remove) {
        updateData = {
          downvoters: {
            disconnect: {
              id: userId,
            },
          },
        };
      } else {
        updateData = {
          downvoters: {
            connect: {
              id: userId,
            },
          },
          upvoters: {
            disconnect: {
              id: userId,
            },
          },
        };
      }

      return ctx.prisma.shoeComment.update({
        where: {
          id,
        },
        data: updateData,
      });
    }),
});
