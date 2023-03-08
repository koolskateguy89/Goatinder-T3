import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";

// TODO: get id from url

// TODO: only allow gc creator to add & remove members
// TODO: allow creator to change gc name & image
// TODO: allow creator to delete gc

// anyone in the gc can access this page, they can see the creator
// and members and be able to leave the GC

// tbh could use SSR for this instead of tRPC

const ManageGroupChatPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ groupChat }) => {
  const title = `${groupChat.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container">
        <div>Manage Group Chat {groupChat.name}</div>
        <pre>groupChat = {JSON.stringify(groupChat, null, 2)}</pre>
      </main>
    </>
  );
};

export default ManageGroupChatPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || !session.user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const userId = session.user.id;

  const id = context.params?.id;

  if (!id)
    return {
      notFound: true,
    };

  const groupChat = await prisma.groupChat.findUnique({
    where: {
      id,
    },
    include: {
      creator: true,
      members: true,
    },
  });

  if (!groupChat)
    return {
      notFound: true,
    };

  // Only allow creator & members to access this page
  if (
    userId !== groupChat.creatorId &&
    !groupChat.members.some((member) => member.id === userId)
  ) {
    // TODO?: maybe show a message saying they don't have access to this page
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      groupChat,
    },
  };
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
