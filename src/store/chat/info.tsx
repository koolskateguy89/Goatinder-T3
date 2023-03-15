import { createContext, useContext } from "react";

import type { ChatInfo as FullChatInfo } from "types/chat";

export type ChatInfo = Pick<
  FullChatInfo,
  "id" | "image" | "name" | "groupChat"
>;

const chatInfoContext = createContext<ChatInfo>(null as unknown as ChatInfo);

export const ChatInfoProvider = chatInfoContext.Provider;

export const useChatInfo = () => useContext(chatInfoContext);
