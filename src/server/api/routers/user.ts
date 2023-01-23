import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const userRouter = createTRPCRouter({
  createProfile: protectedProcedure
    .input(
      z.object({
        // TODO: whatever fields are in the Profile model
        bio: z.string().trim().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bio } = input;
      const userId = ctx.session.user.id;

      await ctx.prisma.profile.upsert({
        where: {
          userId,
        },
        update: {
          bio,
        },
        create: {
          userId,
          bio,
        },
      });
    }),

  deleteAccount: protectedProcedure.mutation(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    await ctx.prisma.user.delete({
      where: {
        id: userId,
      },
    });
  }),
});
