import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";
import clsx from "clsx";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { scoreStateInclude, toScoreStateComment } from "utils/comments";
import Avatar from "components/Avatar";
import ProfilePageTabs from "components/profile/Tabs";
import DeleteAccountButton from "components/profile/DeleteAccountButton";

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, isMyProfile, signedIn, comments }) => {
  const title = `${user.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="container">
        <main className="flex flex-col items-center gap-y-4 px-4 pt-2 pb-4 lg:mx-auto lg:w-3/4">
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
            <div className="flex gap-x-4">
              <Link
                href={`/profile/${user.id}/edit`}
                className="btn-primary btn w-32 md:w-48"
              >
                Edit Profile
              </Link>
              <DeleteAccountButton />
            </div>
          )}

          {!isMyProfile && signedIn && (
            <Link
              href={`/chat/${user.id}`}
              className="btn-primary btn w-32 md:w-48"
            >
              Send Message
            </Link>
          )}

          <section className="flex w-full flex-col items-center gap-y-2 lg:max-w-5xl">
            <h2 className="text-xl font-semibold">
              {isMyProfile ? "My b" : user.name ? `${user.name}'s b` : "B"}
              io
            </h2>
            <textarea
              value={
                user.profile?.bio ??
                `${
                  isMyProfile
                    ? "You haven't"
                    : user.name
                    ? `${user.name} hasn't`
                    : "This user hasn't"
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
      </div>
    </>
  );
};

export default ProfilePage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const userId = session?.user?.id;

  const profileId = context.params?.id;

  const isMyProfile = userId === profileId;

  const user = await prisma.user.findUnique({
    where: {
      id: profileId,
    },
    select: {
      id: true,
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
      signedIn: Boolean(session?.user),
      comments: comments.map(toScoreStateComment),
    },
  };
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
