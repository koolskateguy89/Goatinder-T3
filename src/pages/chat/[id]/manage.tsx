import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { MdArrowBack } from "react-icons/md";

import type { GroupChatInfo } from "types/chat";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { createSSGHelpers } from "utils/ssg";
import { prisma } from "server/db";
import { api } from "utils/api";
import EditableName from "components/chat/manage/EditableName";
import AddMemberButton from "components/chat/manage/AddMemberButton";
import DeleteGroupButton from "components/chat/manage/DeleteGroupButton";
import LeaveGroupButton from "components/chat/manage/LeaveGroupButton";
import MembersList from "components/chat/manage/MembersList";
import Member from "components/chat/manage/Member";

// and members and be able to leave the GC
// ^ the creator has to set a new creator before they can leave
// really creator is admin
// maybe not allow creator to leave at all (no change creator)

const ManageGroupChatPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id, iAmCreator }) => {
  // Prefetched in GSSP
  const { data: _groupChat } = api.chat.infoById.useQuery(
    { id },
    { refetchOnWindowFocus: false },
  );
  const groupChat = _groupChat as GroupChatInfo;

  // Prefetched in GSSP
  const { data: _members, refetch: refetchMembers } =
    api.chat.group.getMembers.useQuery({ id }, { refetchOnWindowFocus: false });
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const members = _members!;

  const title = `${groupChat.name} - goaTinder`;

  const ManageGroupButton = iAmCreator ? DeleteGroupButton : LeaveGroupButton;

  const utils = api.useContext();

  const removeMemberMut = api.chat.group.removeMember.useMutation({
    async onSuccess() {
      await refetchMembers();
    },
  });

  const handleRemoveMember = async (memberId: string) => {
    await removeMemberMut.mutateAsync({ id, userId: memberId });
  };

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container mt-2 max-w-lg space-y-4 px-2">
        <div className="flex items-center gap-x-2">
          <Link
            href={`/chat/${id}`}
            className="btn btn-circle btn-primary btn-sm"
          >
            <MdArrowBack />
            <span className="sr-only">Back</span>
          </Link>

          {/* TODO: gc editable image/picture */}

          <EditableName
            canEdit={iAmCreator}
            id={groupChat.id}
            name={groupChat.name}
            beforeNameChange={(newName) => {
              // Optimistically update the name
              utils.chat.infoById.setData({ id }, (oldGroupChatInfo) => {
                if (!oldGroupChatInfo) return;

                return {
                  ...oldGroupChatInfo,
                  name: newName,
                };
              });
            }}
          />
        </div>

        <p>
          Group created by{" "}
          <Link
            href={`/profile/${groupChat.creator.id}`}
            className="link-hover link"
          >
            {groupChat.creator.name}
          </Link>{" "}
          on{" "}
          <time dateTime={groupChat.createdAt.toISOString()}>
            {groupChat.createdAt.toDateString()}
          </time>
        </p>

        {/* TODO: be able to update image */}

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">
            {members.length} member{members.length !== 1 && "s"}
            {iAmCreator && (
              <AddMemberButton
                groupChatId={id}
                onAddMember={() => refetchMembers()}
              />
            )}
          </h2>
          <MembersList>
            {members.length === 0 ? (
              <li>
                <p className="p-4 text-center">
                  {
                    /* it is impossible for group to have no members & user to NOT be the creator */
                    iAmCreator
                      ? "No members yet, add some!"
                      : "You're the only member"
                  }
                </p>
              </li>
            ) : (
              members.map((user) => (
                <li key={user.id}>
                  <Member
                    {...user}
                    canRemove={iAmCreator}
                    onRemove={handleRemoveMember}
                  />
                </li>
              ))
            )}
          </MembersList>
        </section>

        <ManageGroupButton className="btn btn-error mt-8" id={groupChat.id} />
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
    select: {
      creatorId: true,
      members: {
        select: {
          id: true,
        },
        where: {
          id: userId,
        },
      },
    },
  });

  if (!groupChat)
    return {
      notFound: true,
    };

  // Only allow creator & members to access this page
  if (userId !== groupChat.creatorId && groupChat.members.length === 0) {
    // TODO?: maybe show a message saying they don't have access to this page
    return {
      redirect: {
        destination: "/chat",
        permanent: false,
      },
    };
  }

  const ssg = await createSSGHelpers(session);

  // prefetch chat data
  await Promise.allSettled([
    ssg.chat.infoById.prefetch({ id }),
    ssg.chat.group.getMembers.prefetch({ id }),
  ]);

  return {
    props: {
      session,
      id,
      iAmCreator: userId === groupChat.creatorId,
      trpcState: ssg.dehydrate(),
    },
  };
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
