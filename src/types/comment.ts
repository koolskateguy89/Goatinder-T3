import type { Prisma } from "@prisma/client";
import type { Simplify } from "type-fest";

export type Comment = Simplify<
  Prisma.ShoeCommentGetPayload<{
    include: {
      author: {
        select: {
          id: true;
          name: true;
          image: true;
        };
      };
      _count: {
        select: {
          upvoters: true;
          downvoters: true;
        };
      };
    };
  }>
>;

export type CommentAreaComment = Simplify<
  Comment &
    Prisma.ShoeCommentGetPayload<{
      select: {
        upvoters: {
          select: {
            id: true;
          };
        };
        downvoters: {
          select: {
            id: true;
          };
        };
      };
    }>
>;
