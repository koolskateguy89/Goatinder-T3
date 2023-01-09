import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";

const ProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user, isMyProfile }) => {
  const title = `${user.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-5xl font-extrabold underline underline-offset-4">
          Profile
        </h1>
        <h2 className="text-2xl font-semibold">{user.name}</h2>
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
      </div>
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

  const userId = context.params?.id;

  const isMyProfile = session?.user?.id === userId;

  // TODO: query db

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      name: true,
      image: true,
      profile: true,
    },
  });

  if (!user)
    return {
      notFound: true,
    };

  return {
    props: {
      user,
      isMyProfile,
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) satisfies GetServerSideProps<any, { id: string }>;
