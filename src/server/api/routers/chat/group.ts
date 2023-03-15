import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { commonMessageSelect } from "types/chat";

export const groupChatRouter = createTRPCRouter({
  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        image: z.string().url().or(z.literal("")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name, image } = input;

      const creatorId = ctx.session.user.id;

      return await ctx.prisma.groupChat.create({
        data: {
          name,
          image,
          creatorId,
          // creator: {
          //   connect: {
          //     id: creatorId,
          //   },
          // },
        },
        select: {
          id: true,
        },
      });
    }),

  sendMessage: protectedProcedure
    .input(
      z.object({
        groupChatId: z.string().cuid(),
        content: z.string().trim().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { groupChatId, content } = input;

      const senderId = ctx.session.user.id;

      const { creatorId, members } =
        await ctx.prisma.groupChat.findUniqueOrThrow({
          where: {
            id: groupChatId,
          },
          select: {
            creatorId: true,
            members: {
              select: {
                id: true,
              },
              where: {
                id: senderId,
              },
            },
          },
        });

      if (creatorId !== senderId && members.length === 0) {
        throw new Error("You are not part of this group chat");
      }

      const message = await ctx.prisma.groupChatMessage.create({
        data: {
          content,
          sender: {
            connect: {
              id: senderId,
            },
          },
          groupChat: {
            connect: {
              id: groupChatId,
            },
          },
        },
        select: commonMessageSelect,
      });

      return message;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().trim().min(1),
        image: z.string().url(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO
    }),

  // TODO: add/remove member (could be inside `update`)
  addMember: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        userId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO
    }),

  leave: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const userId = ctx.session.user.id;

      await ctx.prisma.groupChat.update({
        where: {
          id,
        },
        data: {
          members: {
            disconnect: {
              id: userId,
            },
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const userId = ctx.session.user.id;

      const { creatorId } = await ctx.prisma.groupChat.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          creatorId: true,
        },
      });

      if (creatorId !== userId) {
        throw new Error("You are not the creator of this group chat");
      }

      await new Promise((resolve) => setTimeout(resolve, 5000));

      await ctx.prisma.groupChat.delete({
        where: {
          id,
        },
      });
    }),
});
