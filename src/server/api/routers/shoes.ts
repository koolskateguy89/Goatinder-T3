import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const shoesRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        // TODO: remove like
        objectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { objectId } = input;
      const userId = ctx.session.user.id;

      // TODO
    }),

  dislike: protectedProcedure
    .input(
      z.object({
        // TODO: remove dislike
        objectId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { objectId } = input;
      const userId = ctx.session.user.id;

      // TODO
    }),
});
