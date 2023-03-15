import { createContext, useContext } from "react";

import type { ChatInfo as ServerChatInfo } from "server/api/routers/chat";

export type ChatInfo = Pick<
  ServerChatInfo,
  "id" | "image" | "name" | "groupChat"
>;

const chatInfoContext = createContext<ChatInfo>(null as unknown as ChatInfo);

export const ChatInfoProvider = chatInfoContext.Provider;

export const useChatInfo = () => useContext(chatInfoContext);
