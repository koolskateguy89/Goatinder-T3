import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { createSSGHelpers } from "utils/ssg";
import Sidebar from "components/chat/Sidebar";
import Chat from "components/chat/Chat";
import Link from "next/link";

// gc1: cm3osg5to000711i7jg889xb2

const ChatPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  return (
    <>
      <Head>
        <title>Chat - goaTinder</title>
      </Head>
      <main className="container flex flex-grow">
        <div className="basis-1/4 border-r-4 border-base-300 pt-4 dark:border-white/5 max-md:hidden">
          <Sidebar />
        </div>
        <div className="flex flex-grow flex-col">
          {id ? (
            <Chat id={id} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 pt-4">
              You cannot message yourself!
              <Link href="/chat" className="btn btn-primary">
                Chats
              </Link>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default ChatPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const id = context.params?.id;

  if (!id)
    return {
      notFound: true,
    };

  if (!session || !session.user)
    // if not signed in, redirect to signin
    return {
      redirect: {
        destination: `/signin?callbackUrl=/chat/${id}`,
        permanent: false,
      },
    };

  // Trying to message yourself
  if (id === session.user.id)
    return {
      props: {
        session,
      },
    };

  const ssg = await createSSGHelpers(session);

  // prefetch chat data
  try {
    await ssg.chat.infoById.fetch({ id });
  } catch (error) {
    // invalid ID
    return {
      notFound: true,
    };
  }

  await Promise.allSettled([
    ssg.chat.messagesById.prefetch({ id }),
    ssg.chat.getAllInfo.prefetch(),
  ]);

  return {
    props: {
      session,
      trpcState: ssg.dehydrate(),
      id,
    },
  };
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
