import { createContext, useContext } from "react";

import type { ChatInfo } from "types/chat";

const chatInfoContext = createContext<ChatInfo>(null as unknown as ChatInfo);

export const ChatInfoProvider = chatInfoContext.Provider;

export const useChatInfo = () => useContext(chatInfoContext);
