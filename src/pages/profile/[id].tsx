import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { scoreStateInclude, toScoreStateComment } from "utils/comments";
import Comment from "components/profile/Comment";

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, isMyProfile, comments }) => {
  const title = `${user.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold underline underline-offset-4">
          {user.name}
        </h1>
        {user.image && (
          <div className="avatar">
            <div className="w-24 rounded-full">
              <Image
                alt={user.name ?? "Profile picture"}
                src={user.image}
                width={128}
                height={128}
                quality={100}
                priority
              />
            </div>
          </div>
        )}

        {isMyProfile && (
          <button type="button" className="btn-secondary btn w-fit">
            Edit Profile
          </button>
        )}

        <section className="w-full max-w-5xl space-y-2 px-4">
          <h2 className="text-2xl font-semibold">Comments</h2>
          <ul>
            {comments.map((comment) => (
              <li key={comment.id}>
                <Comment comment={comment} />
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const userId = session?.user?.id;

  const profileId = context.params?.id;

  const isMyProfile = userId === profileId;

  // TODO!: query for "Profile" - if using

  const user = await prisma.user.findUnique({
    where: {
      id: profileId,
    },
    select: {
      name: true,
      image: true,
      profile: true,
      comments: {
        select: {
          id: true,
          // shoeId: true,
          content: true,
          datePosted: true,
          shoe: true,
          ...scoreStateInclude(userId),
        },
        orderBy: {
          // newest comments first
          datePosted: "desc",
        },
      },
    },
  });

  if (!user)
    return {
      notFound: true,
    };

  const { comments, ...restOfUser } = user;

  return {
    props: {
      session,
      user: restOfUser,
      isMyProfile,
      comments: comments.map(toScoreStateComment),
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) satisfies GetServerSideProps<any, { id: string }>;
