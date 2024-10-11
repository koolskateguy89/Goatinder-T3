import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  groupChatCreatorProcedure,
  groupChatProcedure,
} from "server/api/trpc";
import { commonMessageSelect } from "types/chat";

export const groupChatRouter = createTRPCRouter({
  getMembers: groupChatProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      console.log("ge member");

      return await ctx.prisma.groupChat
        .findUniqueOrThrow({
          where: {
            id,
          },
          select: {
            members: true,
          },
        })
        .members();
    }),

  createNew: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1),
        image: z.string().url().or(z.literal("")),
      }),
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

  sendMessage: groupChatProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        content: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, content } = input;

      const senderId = ctx.session.user.id;

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
              id,
            },
          },
        },
        select: commonMessageSelect,
      });

      return message;
    }),

  update: groupChatCreatorProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        name: z.string().trim().min(1).optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, name, image } = input;

      await ctx.prisma.groupChat.update({
        where: {
          id,
        },
        data: {
          name,
          image,
        },
      });
    }),

  addMember: groupChatCreatorProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        userId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;

      await ctx.prisma.groupChat.update({
        where: {
          id,
        },
        data: {
          members: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }),

  removeMember: groupChatCreatorProcedure
    .input(
      z.object({
        id: z.string().cuid(),
        userId: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, userId } = input;

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

  leave: protectedProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
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

  delete: groupChatCreatorProcedure
    .input(
      z.object({
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      await ctx.prisma.groupChat.delete({
        where: {
          id,
        },
      });
    }),
});
