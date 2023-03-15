import type { Prisma } from "@prisma/client";

export const commonMessageSelect = {
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

export const basicUserInfoSelect = {
  id: true,
  name: true,
  image: true,
} satisfies Prisma.UserSelect;

export const groupChatInfoSelect = {
  id: true,
  name: true,
  image: true,
  createdAt: true,
  creator: {
    select: basicUserInfoSelect,
  },
} satisfies Prisma.GroupChatSelect;

export type CommonMessage = Prisma.PrivateMessageGetPayload<{
  select: typeof commonMessageSelect;
}>;

export type BasicUserInfo = Prisma.UserGetPayload<{
  select: typeof basicUserInfoSelect;
}>;

export type GroupChatInfo = {
  groupChat: true;
  mostRecentMessage: CommonMessage | undefined;
} & Prisma.GroupChatGetPayload<{
  select: typeof groupChatInfoSelect;
}>;

export type PrivateChatInfo = {
  groupChat: false;
  mostRecentMessage: CommonMessage;
} & BasicUserInfo;

export type ChatInfo = GroupChatInfo | PrivateChatInfo;

export function toPrivateChatInfo(
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

export function toGroupChatInfo(
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
