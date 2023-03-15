import type { Profile } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const userRouter = createTRPCRouter({
  /**
   * Can also be used to update the profile
   */
  createProfile: protectedProcedure
    .input(
      z.object({
        bio: z.string().trim().min(1),
      }) satisfies z.ZodType<Omit<Profile, "userId">>
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

  getAllOtherUsers: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return await ctx.prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }),
});
