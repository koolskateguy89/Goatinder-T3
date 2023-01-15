import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const commentsRouter = createTRPCRouter({
  addComment: protectedProcedure
    .input(
      z.object({
        shoeSKU: z.string(),
        content: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { shoeSKU, content } = input;

      const authorId = ctx.session.user.id;

      return ctx.prisma.shoeComment.create({
        data: {
          content,
          shoe: {
            connectOrCreate: {
              where: {
                searchSKU: shoeSKU,
              },
              create: {
                searchSKU: shoeSKU,
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const userId = ctx.session.user.id;

      return ctx.prisma.shoeComment.update({
        where: {
          id,
        },
        data: {
          upvoters: {
            connect: {
              id: userId,
            },
          },
          downvoters: {
            // deleteMany acts like deleteIfExists
            deleteMany: {
              id: userId,
            },
          },
        },
      });
    }),

  downvote: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const userId = ctx.session.user.id;

      return ctx.prisma.shoeComment.update({
        where: {
          id,
        },
        data: {
          downvoters: {
            connect: {
              id: userId,
            },
          },
          upvoters: {
            deleteMany: {
              id: userId,
            },
          },
        },
      });
    }),
});
