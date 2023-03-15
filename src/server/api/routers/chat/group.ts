import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { commonMessageSelect } from "types/chat";

export const groupChatRouter = createTRPCRouter({
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
});
