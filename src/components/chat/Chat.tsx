import { useEffect } from "react";
import Head from "next/head";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import { api, type RouterOutputs } from "utils/api";
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
  const { data: chatData } = api.chat.infoById.useQuery({ id });
  const { data: messagesData } = api.chat.messagesById.useQuery({ id });

  const title = chatData ? `${chatData.name} - goaTinder` : "goaTinder";

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
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="border-b-4 border-base-300 p-2 dark:border-white/5">
        {chatData ? (
          <ChatMeta
            name={chatData.name}
            image={chatData.image}
            nameHref={
              chatData.groupChat ? `/chat/${id}/manage` : `/profile/${id}`
            }
          />
        ) : (
          <div>
            <h1>loading...</h1>
          </div>
        )}
      </div>

      {chatData ? (
        <>
          <div className="relative flex-grow p-1 md:p-4">
            <Messages
              groupChat={chatData.groupChat}
              messages={messageState.messages}
              onDelete={onMessageDelete}
            />
          </div>
          <div className="p-1 md:p-4">
            <NewMessageForm
              id={chatData.id}
              groupChat={chatData.groupChat}
              onMessageSent={onMessageSent}
            />
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}
