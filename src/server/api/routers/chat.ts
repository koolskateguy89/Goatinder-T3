/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

// TODO: delete gc (on manage page, only creator can delete)

const privateMessageSelect = {
  id: true,
  content: true,
  sentAt: true,
  sender: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.PrivateMessageSelect;

const groupChatMessageSelect = {
  id: true,
  content: true,
  sentAt: true,
  sender: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
} satisfies Prisma.GroupChatMessageSelect;

const basicUserInfoSelect = {
  id: true,
  name: true,
  image: true,
} satisfies Prisma.UserSelect;

const groupChatInfoSelect = {
  id: true,
  name: true,
  image: true,
  createdAt: true,
  creator: {
    select: basicUserInfoSelect,
  },
} satisfies Prisma.GroupChatSelect;

type BasicUserInfo = Prisma.UserGetPayload<{
  select: typeof basicUserInfoSelect;
}>;

type GroupChatInfo = {
  groupChat: true;
  mostRecentMessage:
    | Prisma.GroupChatMessageGetPayload<{
        select: typeof groupChatMessageSelect;
      }>
    | undefined;
} & Prisma.GroupChatGetPayload<{
  select: typeof groupChatInfoSelect;
}>;

type PrivateChatInfo = {
  groupChat: false;
  mostRecentMessage: Prisma.PrivateMessageGetPayload<{
    select: typeof privateMessageSelect;
  }>;
} & BasicUserInfo;

type ChatInfo = GroupChatInfo | PrivateChatInfo;

// TODO: functions to transform the data into the format we want
// i.e. User to PrivateChatInfo, GroupChat to PrivateChatInfo

export const chatRouter = createTRPCRouter({
  getAllInfo: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    // TODO: also need users that have sent a message to the user

    const _receivers = await ctx.prisma.user.findMany({
      select: {
        ...basicUserInfoSelect,
        receivedMessages: {
          where: {
            senderId: userId,
          },
          select: privateMessageSelect,
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

    const receivers: PrivateChatInfo[] = _receivers.map((receiver) => ({
      groupChat: false,
      id: receiver.id,
      name: receiver.name,
      image: receiver.image,
      mostRecentMessage: receiver.receivedMessages[0]!,
    }));

    const _groupChats = await ctx.prisma.groupChat.findMany({
      select: {
        ...groupChatInfoSelect,
        messages: {
          select: groupChatMessageSelect,
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

    const groupChats: GroupChatInfo[] = _groupChats.map((groupChat) => ({
      groupChat: true,
      id: groupChat.id,
      name: groupChat.name,
      image: groupChat.image,
      createdAt: groupChat.createdAt,
      creator: groupChat.creator,
      mostRecentMessage: groupChat.messages[0],
    }));

    // sort by most recent message first
    const all: ChatInfo[] = [...receivers, ...groupChats].sort((a, b) => {
      // fallback to the date the group chat was created, if there are no messages
      // (private messages cannot have no messages)
      // not sure why TS is complaining about this
      const aMostRecent =
        a.mostRecentMessage?.sentAt ?? (a as GroupChatInfo).createdAt;
      const bMostRecent =
        b.mostRecentMessage?.sentAt ?? (b as GroupChatInfo).createdAt;

      return bMostRecent.getTime() - aMostRecent.getTime();
    });

    console.log("receivers =", receivers);
    console.log("groupChats =", groupChats);
    console.log("all =", all);

    return all;
  }),

  infoById: protectedProcedure
    .input(z.object({ id: z.string() }))
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
            select: privateMessageSelect,
            orderBy: {
              // most recent first
              sentAt: "desc",
            },
            take: 1,
          },
        },
      });

      if (receiver)
        return {
          groupChat: false,
          id: receiver.id,
          name: receiver.name,
          image: receiver.image,
          mostRecentMessage: receiver.receivedMessages[0]!,
        } satisfies PrivateChatInfo;

      // TODO: only return this if they are part of the gc, otherwise null
      const groupChat = await ctx.prisma.groupChat.findUnique({
        where: {
          id: receiverOrGroupChatId,
        },
        select: {
          ...groupChatInfoSelect,
          messages: {
            select: groupChatMessageSelect,
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

      return {
        groupChat: true,
        id: groupChat.id,
        name: groupChat.name,
        image: groupChat.image,
        createdAt: groupChat.createdAt,
        creator: groupChat.creator,
        mostRecentMessage: groupChat.messages[0],
      } satisfies GroupChatInfo;
    }),

  messagesById: protectedProcedure
    .input(z.object({ id: z.string() }))
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
            select: privateMessageSelect,
          },
          receivedMessages: {
            where: {
              // only messages sent by the signed in user
              senderId: userId,
            },
            select: privateMessageSelect,
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

      // TODO: only return this if they are part of the gc, otherwise throw
      const groupChat = await ctx.prisma.groupChat.findUnique({
        where: {
          id: receiverOrGroupChatId,
        },
        select: {
          messages: {
            select: groupChatMessageSelect,
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
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      // TODO
      // 1. ensure message exists
      // 2. ensure message belongs to user

      // 0. need to find out what type of message it is

      const deletedMessage = await ctx.prisma.privateMessage.delete({
        where: {
          id,
        },
      });

      return "lol";
    }),
});
