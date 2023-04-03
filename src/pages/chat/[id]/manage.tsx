import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import DeleteGroupButton from "components/chat/manage/DeleteGroupButton";
import LeaveGroupButton from "components/chat/manage/LeaveGroupButton";

// TODO: only allow gc creator to add & remove members
// TODO: allow creator to change gc name & image

// and members and be able to leave the GC
// ^ the creator has to set a new creator before they can leave
// really creator is admin
// maybe not allow creator to leave at all (no change creator)

const ManageGroupChatPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ groupChat, iAmCreator }) => {
  const title = `${groupChat.name} - goaTinder`;

  const ManageButton = iAmCreator ? DeleteGroupButton : LeaveGroupButton;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container mt-2 space-y-4 px-2">
        <pre>groupChat = {JSON.stringify(groupChat, null, 2)}</pre>

        <h1 className="text-2xl font-semibold text-red-400 underline">
          {/* TODO: name editable */}
          {groupChat.name}
        </h1>

        <p>
          Group created by {groupChat.creator.name} on{" "}
          {groupChat.createdAt.toDateString()}
        </p>

        {/* TODO: be able to update image */}

        <section>
          <h2 className="text-xl font-semibold">
            {groupChat.members.length} members
            {/* TODO: maybe maybe add button a component cos need a modal */}
            {iAmCreator && (
              <button type="button" className="btn-success btn ml-4">
                Add
              </button>
            )}
          </h2>
          <ul>
            {groupChat.members.map((user) => (
              <li key={user.id}>
                {user.name}
                {/* TODO: button to remove if creator */}
              </li>
            ))}
          </ul>
        </section>

        <ManageButton className="btn-error btn mt-8" id={groupChat.id} />
      </main>
    </>
  );
};

export default ManageGroupChatPage;

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
        destination: `/signin?callbackUrl=/chat/${id}/manage`,
        permanent: false,
      },
    };

  const userId = session.user.id;

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
      iAmCreator: userId === groupChat.creatorId,
    },
  };
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
