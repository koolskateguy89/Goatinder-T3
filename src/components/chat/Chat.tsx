import { useEffect } from "react";
import Head from "next/head";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import { api, type RouterOutputs } from "utils/api";
import { ChatInfoProvider } from "store/chat/info";
import ChatMeta from "components/chat/ChatMeta";
import Messages from "components/chat/Messages";
import NewMessageForm from "components/chat/NewMessageForm";

type MessageType = RouterOutputs["chat"]["messagesById"]["messages"][number];

type MessageState = {
  messages: MessageType[];
};

type MessageAction =
  | { type: "set"; payload: MessageType[] }
  | { type: "add"; payload: MessageType }
  | { type: "delete"; payload: { id: string } };

// This _may_ get complicated if using websockets for real-time updates
const messageReducer: ImmerReducer<MessageState, MessageAction> = (
  draft,
  action
) => {
  switch (action.type) {
    case "set":
      draft.messages = action.payload;
      break;
    case "add":
      draft.messages.push(action.payload);
      break;
    case "delete":
      draft.messages = draft.messages.filter(
        (message) => message.id !== action.payload.id
      );
      break;
    default:
      break;
  }
};

export default function Chat({ id }: { id: string }) {
  // prefetched in getServerSideProps
  const chatInfoQuery = api.chat.infoById.useQuery({ id });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const chatData = chatInfoQuery.data!;
  const { data: messagesData } = api.chat.messagesById.useQuery({ id });

  const title = `${chatData.name} - goaTinder`;

  const [messageState, messagesDispatch] = useImmerReducer(messageReducer, {
    messages: messagesData?.messages ?? [],
  });

  useEffect(() => {
    if (messagesData) {
      messagesDispatch({
        type: "set",
        payload: messagesData.messages,
      });
    }
  }, [messagesDispatch, messagesData]);

  const onMessageDelete = (messageId: string) => {
    messagesDispatch({ type: "delete", payload: { id: messageId } });
  };

  const onMessageSent = (message: MessageType) => {
    messagesDispatch({ type: "add", payload: message });
  };

  return (
    <ChatInfoProvider value={chatData}>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="border-b-4 border-base-300 p-2 dark:border-white/5">
        <ChatMeta />
      </div>

      <div className="relative flex-grow p-1 md:p-4">
        <Messages messages={messageState.messages} onDelete={onMessageDelete} />
      </div>
      <div className="p-1 md:p-4">
        <NewMessageForm onMessageSent={onMessageSent} />
      </div>
    </ChatInfoProvider>
  );
}
