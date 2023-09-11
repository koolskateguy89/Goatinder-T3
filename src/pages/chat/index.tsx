import type { GetServerSideProps } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { createSSGHelpers } from "utils/ssg";
import { api } from "utils/api";
import ChatPreview from "components/chat/ChatPreview";
import NewChatButton from "components/chat/NewChatButton";

export default function ChatsPage() {
  // prefetched in getServerSideProps
  // is already sorted by most recent message
  const { data: chatInfos } = api.chat.getAllInfo.useQuery();

  return (
    <>
      <Head>
        <title>Chat - goaTinder</title>
      </Head>
      <main className="container mt-4 flex flex-col items-center px-4">
        <ol className="space-y-4">
          <li>
            <NewChatButton className="btn-primary btn-block btn" />
          </li>
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

  if (!session || !session.user)
    // if not signed in, redirect to signin
    return {
      redirect: {
        destination: `/signin?callbackUrl=/chat`,
        permanent: false,
      },
    };

  const ssg = await createSSGHelpers(session);

  await ssg.chat.getAllInfo.prefetch();

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
    },
  };
}) satisfies GetServerSideProps;
