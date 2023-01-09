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
> = ({ user }) => {
  // maybe use 404 page?
  if (!user)
    return (
      <>
        <Head>
          <title>Not found - goaTinder</title>
        </Head>
        <div>no user with thhis id</div>
      </>
    );

  const title = `${user.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        Profile
        <h1 className="text-2xl font-bold">{user.name}</h1>
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

  // TODO: check it's their profile to enable
  // extra functionality

  const userId = context.params?.id as string | undefined;

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

  return {
    props: {
      user,
    },
  };
}) satisfies GetServerSideProps;
