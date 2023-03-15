/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { Prisma } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "server/api/trpc";

// TODO: delete gc (on manage page, only creator can delete)

const commonMessageSelect = {
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
} satisfies Prisma.PrivateMessageSelect satisfies Prisma.GroupChatMessageSelect;

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

type CommonMessage = Prisma.PrivateMessageGetPayload<{
  select: typeof commonMessageSelect;
}>;

type BasicUserInfo = Prisma.UserGetPayload<{
  select: typeof basicUserInfoSelect;
}>;

type GroupChatInfo = {
  groupChat: true;
  mostRecentMessage: CommonMessage | undefined;
} & Prisma.GroupChatGetPayload<{
  select: typeof groupChatInfoSelect;
}>;

type PrivateChatInfo = {
  groupChat: false;
  mostRecentMessage: CommonMessage;
} & BasicUserInfo;

export type ChatInfo = GroupChatInfo | PrivateChatInfo;

function toPrivateChatInfo(
  user: BasicUserInfo,
  mostRecentMessage: CommonMessage
): PrivateChatInfo {
  return {
    groupChat: false,
    id: user.id,
    name: user.name,
    image: user.image,
    mostRecentMessage,
  };
}

function toGroupChatInfo(
  groupChat: Prisma.GroupChatGetPayload<{
    select: typeof groupChatInfoSelect & {
      messages: {
        select: typeof commonMessageSelect;
      };
    };
  }>
): GroupChatInfo {
  return {
    groupChat: true,
    id: groupChat.id,
    name: groupChat.name,
    image: groupChat.image,
    createdAt: groupChat.createdAt,
    creator: groupChat.creator,
    mostRecentMessage: groupChat.messages[0],
  };
}

export const chatRouter = createTRPCRouter({
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
      toPrivateChatInfo(sender, sender.sentMessages[0]!)
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
      toPrivateChatInfo(receiver, receiver.receivedMessages[0]!)
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

      // TODO: only return this if they are part of the gc, otherwise null
      const groupChat = await ctx.prisma.groupChat.findUnique({
        where: {
          id: receiverOrGroupChatId,
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

      // TODO: only return this if they are part of the gc, otherwise throw
      const groupChat = await ctx.prisma.groupChat.findUnique({
        where: {
          id: receiverOrGroupChatId,
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

  sendPrivateMessage: protectedProcedure
    .input(
      z.object({
        receiverId: z.string(),
        content: z.string().trim().min(1),
      })
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

  sendGroupChatMessage: protectedProcedure
    .input(
      z.object({
        groupChatId: z.string(),
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

  deleteMessage: protectedProcedure
    .input(
      z.object({
        groupChat: z.boolean(),
        id: z.string(),
      })
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
