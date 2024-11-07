/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";
import {
  commonMessageSelect,
  basicUserInfoSelect,
  groupChatInfoSelect,
  // CommonMessage,
  // type BasicUserInfo,
  type GroupChatInfo,
  type PrivateChatInfo,
  type ChatInfo,
  toPrivateChatInfo,
  toGroupChatInfo,
} from "types/chat";
import { groupChatRouter } from "server/api/routers/chat/group";
import { privateChatRouter } from "server/api/routers/chat/private";

export const chatRouter = createTRPCRouter({
  group: groupChatRouter,
  private: privateChatRouter,

  getAllInfo: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const _senders = await ctx.prisma.user.findMany({
      select: {
        ...basicUserInfoSelect,
        sentMessages: {
          where: {
            receiverId: userId,
          },
          select: commonMessageSelect,
          orderBy: {
            // most recent first
            sentAt: "desc",
          },
          // only get the most recent message
          take: 1,
        },
      },
      // only users that have sent a message to the signed in user
      where: {
        sentMessages: {
          some: {
            receiverId: userId,
          },
        },
      },
    });

    const senders: PrivateChatInfo[] = _senders.map((sender) =>
      toPrivateChatInfo(sender, sender.sentMessages[0]!),
    );

    const _receivers = await ctx.prisma.user.findMany({
      select: {
        ...basicUserInfoSelect,
        receivedMessages: {
          where: {
            senderId: userId,
          },
          select: commonMessageSelect,
          orderBy: {
            // most recent first
            sentAt: "desc",
          },
          // only get the most recent message
          take: 1,
        },
      },
      // only users that have received a message from the signed in user
      where: {
        receivedMessages: {
          some: {
            senderId: userId,
          },
        },
      },
    });

    const receivers: PrivateChatInfo[] = _receivers.map((receiver) =>
      toPrivateChatInfo(receiver, receiver.receivedMessages[0]!),
    );

    // Code below here basically combines the senders and receivers,
    // ensuring no duplicates. When there is a duplicate, it keeps the
    // one with the more recent message. This is needed because we can't
    // just use `senders` or `receivers` - some convos will be missing.
    // I honestly cba to explain how/why it works, just look at the code
    // and it'll hopefully make sense. I'm not even sure if it's the best
    // way to do it, but it works.

    // https://stackoverflow.com/a/38622270/17381629
    // id -> obj
    const sendersMap = new Map(senders.map((info) => [info.id, info]));
    const receiversMap = new Map(receivers.map((info) => [info.id, info]));

    const allPrivateChatIds = new Set<string>();
    sendersMap.forEach((value, key) => {
      allPrivateChatIds.add(key);
    });
    receiversMap.forEach((value, key) => {
      allPrivateChatIds.add(key);
    });

    const allPrivateChats: PrivateChatInfo[] = [];

    allPrivateChatIds.forEach((id) => {
      const sender = sendersMap.get(id);
      const receiver = receiversMap.get(id);

      sendersMap.delete(id);
      receiversMap.delete(id);

      if (sender && receiver) {
        // add the one with the more recent message
        const moreRecent =
          sender.mostRecentMessage.sentAt > receiver.mostRecentMessage.sentAt
            ? sender
            : receiver;

        allPrivateChats.push(moreRecent);
      } else if (sender) {
        allPrivateChats.push(sender);
      } else {
        // receiver must exist
        allPrivateChats.push(receiver!);
      }
    });

    // Magic stops here

    const _groupChats = await ctx.prisma.groupChat.findMany({
      select: {
        ...groupChatInfoSelect,
        messages: {
          select: commonMessageSelect,
          orderBy: {
            // most recent first
            sentAt: "desc",
          },
          // only get the most recent message
          take: 1,
        },
      },
      // only group chats that the user is a part of
      where: {
        OR: [
          {
            creatorId: userId,
          },
          {
            members: {
              some: {
                id: userId,
              },
            },
          },
        ],
      },
    });

    const groupChats: GroupChatInfo[] = _groupChats.map(toGroupChatInfo);

    // sort by most recent message first
    const all: ChatInfo[] = [...allPrivateChats, ...groupChats].sort((a, b) => {
      // fallback to the date the group chat was created, if there are no messages
      // (private messages cannot have no messages)
      // not sure why TS is complaining about this
      const aMostRecent =
        a.mostRecentMessage?.sentAt ?? (a as GroupChatInfo).createdAt;
      const bMostRecent =
        b.mostRecentMessage?.sentAt ?? (b as GroupChatInfo).createdAt;

      return bMostRecent.getTime() - aMostRecent.getTime();
    });

    return all;
  }),

  infoById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { id: receiverOrGroupChatId } = input;

      const userId = ctx.session.user.id;

      const receiver = await ctx.prisma.user.findUnique({
        where: {
          id: receiverOrGroupChatId,
        },
        select: {
          ...basicUserInfoSelect,
          receivedMessages: {
            where: {
              senderId: userId,
            },
            select: commonMessageSelect,
            orderBy: {
              // most recent first
              sentAt: "desc",
            },
            take: 1,
          },
        },
      });

      if (receiver)
        return toPrivateChatInfo(receiver, receiver.receivedMessages[0]!);

      const groupChat = await ctx.prisma.groupChat.findUnique({
        where: {
          id: receiverOrGroupChatId,
          // user has to be part of gc
          members: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          ...groupChatInfoSelect,
          messages: {
            select: commonMessageSelect,
            orderBy: {
              // most recent first
              sentAt: "desc",
            },
            take: 1,
          },
        },
      });

      if (!groupChat) {
        throw new Error("Invalid id");
      }

      return toGroupChatInfo(groupChat);
    }),

  messagesById: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ ctx, input }) => {
      const { id: receiverOrGroupChatId } = input;

      const userId = ctx.session.user.id;

      const receiver = await ctx.prisma.user.findUnique({
        where: {
          id: receiverOrGroupChatId,
        },
        select: {
          sentMessages: {
            where: {
              // only messages sent to the signed in user
              receiverId: userId,
            },
            select: commonMessageSelect,
          },
          receivedMessages: {
            where: {
              // only messages sent by the signed in user
              senderId: userId,
            },
            select: commonMessageSelect,
          },
        },
      });

      if (receiver) {
        const messages = receiver.sentMessages
          .concat(receiver.receivedMessages)
          .sort((a, b) => {
            // sort by oldest first
            return a.sentAt.getTime() - b.sentAt.getTime();
          });

        return {
          groupChat: false,
          messages,
        } as const;
      }

      const groupChat = await ctx.prisma.groupChat.findUnique({
        where: {
          id: receiverOrGroupChatId,
          // user has to be part of gc
          members: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          messages: {
            select: commonMessageSelect,
            orderBy: {
              // oldest first
              sentAt: "asc",
            },
          },
        },
      });

      if (!groupChat) throw new Error("Invalid id");

      return {
        groupChat: true,
        messages: groupChat.messages,
      } as const;
    }),

  deleteMessage: protectedProcedure
    .input(
      z.object({
        groupChat: z.boolean(),
        id: z.string().cuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { groupChat, id } = input;

      const userId = ctx.session.user.id;

      const delegate = groupChat
        ? ctx.prisma.groupChatMessage
        : ctx.prisma.privateMessage;

      // @ts-expect-error It works
      const { senderId } = await delegate.findUniqueOrThrow({
        where: {
          id,
        },
        select: {
          senderId: true,
        },
      });

      if (senderId !== userId)
        throw new Error("Unauthorised to delete this message");

      // @ts-expect-error It works
      await delegate.delete({
        where: {
          id,
        },
      });
    }),
});
