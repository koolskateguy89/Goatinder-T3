import { useEffect } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { createSSGHelpers } from "utils/ssg";
import { api, type RouterOutputs } from "utils/api";
import ChatMeta from "components/chat/ChatMeta";
import Messages from "components/chat/Messages";

// gc1: cleyua3uq000hw26kqttq4o5x

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

// This will show the chat for both a PM and GC, with a like sidebar/side content of all their chats (PMs & GCs)
const ChatPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  // TODO: use id for showing active in side thingy, probably not in this component

  // prefetched in getServerSideProps
  const { data: chatData } = api.chat.infoById.useQuery({ id });
  const { data: messagesData } = api.chat.messagesById.useQuery({ id });

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
    console.log("ChatPage.onMessageDelete()");
    messagesDispatch({ type: "delete", payload: { id: messageId } });
  };

  const title = chatData ? `${chatData.name} - goaTinder` : "goaTinder";

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container flex">
        <div className="basis-1/5 overflow-auto border-r-4 border-base-300 dark:border-white/5">
          side stuff here... aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
          ccccccccccccccccccccccccccccccc
        </div>
        <div className="flex-grow">
          <div className="border-b-4 border-base-300 p-2 dark:border-white/5">
            {/* TODO: remove pre */}
            <pre>chatData = {JSON.stringify(chatData, null, 2)}</pre>
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
                <h1>loading</h1>
              </div>
            )}
          </div>

          <div className="p-2">
            <Messages
              messages={messageState.messages}
              onDelete={onMessageDelete}
            />
            {/* TODO: input so can send messages */}
          </div>
        </div>
      </main>
    </>
  );
};

export default ChatPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  // TODO: handle if they're trying to message themself

  const id = context.params?.id;

  if (!id)
    return {
      notFound: true,
    };

  const ssg = await createSSGHelpers(session);

  // prefetch chat data
  try {
    const chatData = await ssg.chat.infoById.fetch({ id });
    console.log(chatData);
  } catch (error) {
    // invalid ID
    return {
      notFound: true,
    };
  }

  await ssg.chat.messagesById.prefetch({ id });

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
