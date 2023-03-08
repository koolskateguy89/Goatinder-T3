import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { createSSGHelpers } from "utils/ssg";
import { api } from "utils/api";
import ChatPreview from "components/chat/ChatPreview";

export default function ChatsPage() {
  // TODO: a new chat buttton, maybe just display a dialog in which they pick who to chat with & redirect to /chat/[id]

  // prefetched in getServerSideProps
  // is already sorted by most recent message
  const { data: chatInfos } = api.chat.getAllInfo.useQuery();

  // TODO: new chat button, should be able to use same component as in Sidebar

  return (
    <>
      <Head>
        <title>Chat - goaTinder</title>
      </Head>
      <main className="container mt-4 flex flex-col items-center px-4">
        <ol className="space-y-4">
          {chatInfos ? (
            chatInfos.length ? (
              chatInfos.map((chatInfo) => (
                <li key={chatInfo.id}>
                  <ChatPreview
                    id={chatInfo.id}
                    name={chatInfo.name}
                    image={chatInfo.image}
                    mostRecentMessage={
                      chatInfo.mostRecentMessage?.content ?? "-"
                    }
                  />
                </li>
              ))
            ) : (
              <li>No chats, make some friends</li>
            )
          ) : (
            <li>Loading...</li>
          )}
        </ol>
      </main>
    </>
  );
}

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // TODO: prefetch

  const ssg = await createSSGHelpers(session);

  await ssg.chat.getAllInfo.prefetch();

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
