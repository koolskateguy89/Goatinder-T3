import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import { commonMessageSelect } from "types/chat";

export const privateChatRouter = createTRPCRouter({
  sendMessage: protectedProcedure
    .input(
      z.object({
        receiverId: z.string().cuid(),
        content: z.string().trim().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { receiverId, content } = input;

      const senderId = ctx.session.user.id;

      const message = await ctx.prisma.privateMessage.create({
        data: {
          content,
          sender: {
            connect: {
              id: senderId,
            },
          },
          receiver: {
            connect: {
              id: receiverId,
            },
          },
        },
        select: commonMessageSelect,
      });

      return message;
    }),
});
