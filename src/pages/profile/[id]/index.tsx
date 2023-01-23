import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import clsx from "clsx";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { scoreStateInclude, toScoreStateComment } from "utils/comments";
import Avatar from "components/Avatar";
import ProfilePageTabs from "components/profile/Tabs";

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, isMyProfile, comments }) => {
  const title = `${user.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container flex flex-col items-center gap-y-4 px-4 pt-2 pb-4">
        <h1 className="text-5xl font-extrabold underline underline-offset-4">
          {user.name ?? "An unnamed user"}
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
          <>
            <button type="button" className="btn-primary btn">
              Edit Profile
            </button>
            <Link href="edit" className="btn-primary btn">
              Edit
            </Link>
            <button type="button" className="btn-error btn">
              Delete Account
            </button>
          </>
        )}

        <section className="flex w-full flex-col items-center gap-y-2 lg:max-w-5xl">
          <h2 className="text-xl font-semibold">
            {user.name ? `${user.name}'s b` : "B"}
            io
          </h2>
          <textarea
            value={
              user.profile?.bio ??
              `${
                user.name ? `${user.name} hasn't` : "This user hasn't"
              } written a bio yet.`
            }
            className={clsx(
              "textarea-bordered textarea h-32 w-full md:h-52",
              !user.profile?.bio &&
                "text-base-content/70 dark:text-base-content/50"
            )}
            readOnly
          />
        </section>

        <section className="w-full">
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
