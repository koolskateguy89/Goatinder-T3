import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

export const shoesRouter = createTRPCRouter({
  like: protectedProcedure
    .input(
      z.object({
        shoe: z.object({
          objectID: z.string().min(1),
          name: z.string().min(1),
          main_picture_url: z.string().url(),
        }),
        remove: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { shoe, remove } = input;
      const userId = ctx.session.user.id;

      let upsertArgs: Omit<Prisma.ShoeUpsertArgs, "where">;
      if (remove) {
        upsertArgs = {
          // shouldn't need to create a new shoe
          create: {
            objectId: shoe.objectID,
            name: shoe.name,
            main_picture_url: shoe.main_picture_url,
          },
          update: {
            likes: {
              disconnect: {
                id: userId,
              },
            },
          },
        };
      } else {
        upsertArgs = {
          create: {
            objectId: shoe.objectID,
            name: shoe.name,
            main_picture_url: shoe.main_picture_url,
            likes: {
              connect: {
                id: userId,
              },
            },
          },
          update: {
            likes: {
              connect: {
                id: userId,
              },
            },
            dislikes: {
              disconnect: {
                id: userId,
              },
            },
          },
        };
      }

      await ctx.prisma.shoe.upsert({
        where: {
          objectId: shoe.objectID,
        },
        ...upsertArgs,
      });
    }),

  dislike: protectedProcedure
    .input(
      z.object({
        shoe: z.object({
          objectID: z.string().min(1),
          name: z.string().min(1),
          main_picture_url: z.string().url(),
        }),
        remove: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { shoe, remove } = input;
      const userId = ctx.session.user.id;

      let upsertArgs: Omit<Prisma.ShoeUpsertArgs, "where">;
      if (remove) {
        upsertArgs = {
          // shouldn't need to create a new shoe
          create: {
            objectId: shoe.objectID,
            name: shoe.name,
            main_picture_url: shoe.main_picture_url,
          },
          update: {
            dislikes: {
              disconnect: {
                id: userId,
              },
            },
          },
        };
      } else {
        upsertArgs = {
          create: {
            objectId: shoe.objectID,
            name: shoe.name,
            main_picture_url: shoe.main_picture_url,
            dislikes: {
              connect: {
                id: userId,
              },
            },
          },
          update: {
            dislikes: {
              connect: {
                id: userId,
              },
            },
            likes: {
              disconnect: {
                id: userId,
              },
            },
          },
        };
      }

      await ctx.prisma.shoe.upsert({
        where: {
          objectId: shoe.objectID,
        },
        ...upsertArgs,
      });
    }),
});
