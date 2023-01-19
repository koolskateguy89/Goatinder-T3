import type { Prisma } from "@prisma/client";

export type ScoreStateCommentBase = Prisma.ShoeCommentGetPayload<{
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

export function scoreStateInclude(userId?: string) {
  return {
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
  } satisfies Prisma.ShoeCommentInclude;
}

/**
 * Adds the score and upvoted/downvoted properties to a comment.
 *
 * @param comment The comment to add the properties to.
 * @returns
 */
export function toScoreStateComment<TComment extends ScoreStateCommentBase>(
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
