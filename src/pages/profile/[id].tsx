import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { scoreStateInclude, toScoreStateComment } from "utils/comments";
import Avatar from "components/Avatar";
import ProfilePageTabs from "components/profile/Tabs";

/**
 * Will want to show their bio? (if they have one)
 * ^ will need to be made on welcome page, and then can be edited on this page
 */
const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, isMyProfile, comments }) => {
  const title = `${user.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container flex flex-col items-center gap-4 pb-4">
        <h1 className="text-5xl font-extrabold underline underline-offset-4">
          {user.name}
        </h1>

        <Avatar
          image={user.image}
          name={user.name}
          className="[&>*]:w-24"
          imageProps={{
            quality: 100,
            sizes: "6rem",
            priority: true,
          }}
        />

        {isMyProfile && (
          <button type="button" className="btn-secondary btn w-fit">
            Edit Profile
          </button>
        )}

        <section className="w-full max-w-6xl px-4">
          <ProfilePageTabs
            comments={comments}
            disliked={user.disliked}
            liked={user.liked}
          />
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
      disliked: {
        include: {
          _count: true,
        },
      },
      liked: {
        include: {
          _count: true,
        },
      },
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
