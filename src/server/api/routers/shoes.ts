import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "server/api/trpc";

export const shoesRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  like: protectedProcedure
    .input(z.object({ shoeSKU: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { shoeSKU } = input;
      const userId = ctx.session.user.id;

      // TODO
    }),

  dislike: protectedProcedure
    .input(z.object({ shoeSKU: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { shoeSKU } = input;
      const userId = ctx.session.user.id;

      // TODO
    }),
});
