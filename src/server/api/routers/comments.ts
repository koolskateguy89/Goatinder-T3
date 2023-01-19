import type { Prisma } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "server/api/trpc";

type ScoreStateCommentBase = Prisma.ShoeCommentGetPayload<{
  select: {
    // to check if user has upvoted
    upvoters: {
      select: {
        id: true;
      };
    };
    // to check if user has downvoted
    downvoters: {
      select: {
        id: true;
      };
    };
    _count: {
      select: {
        upvoters: true;
        downvoters: true;
      };
    };
  };
}>;

/**
 * Adds the score and upvoted/downvoted properties to a comment.
 *
 * @param comment The comment to add the properties to.
 * @returns
 */
function toScoreStateComment<TComment extends ScoreStateCommentBase>(
  comment: TComment
) {
  const { upvoters, downvoters, _count, ...rest } = comment;

  return {
    ...rest,
    upvoted: upvoters.length > 0,
    downvoted: downvoters.length > 0,
    score: _count.upvoters - _count.downvoters,
  };
}

export const commentsRouter = createTRPCRouter({
  getComments: publicProcedure
    .input(
      z.object({
        shoeId: z.string(),
      })
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
          // to check if user has upvoted
          upvoters: {
            where: {
              id: userId ?? "",
            },
            select: {
              id: true,
            },
          },
          // to check if user has downvoted
          downvoters: {
            where: {
              id: userId ?? "",
            },
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
        shoeId: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { shoeId, content } = input;

      const authorId = ctx.session.user.id;

      return ctx.prisma.shoeComment
        .create({
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
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      return ctx.prisma.shoeComment.delete({
        where: {
          id,
        },
      });
    }),

  vote: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        vote: z.enum(["up", "down"]),
        remove: z.boolean(),
      })
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

      return ctx.prisma.shoeComment.update({
        where: {
          id,
        },
        data: updateData,
      });
    }),
});
