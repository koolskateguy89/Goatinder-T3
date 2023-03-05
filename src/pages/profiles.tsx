import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import Avatar from "components/Avatar";
import Stats from "components/profile/Stats";

const ProfilesPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ users }) => {
  return (
    <>
      <Head>
        <title>Profiles - goaTinder</title>
      </Head>
      <main className="container flex-grow p-4">
        <ul className="grid grid-cols-2 justify-items-center gap-4 lg:grid-cols-3">
          {users.map((user) => (
            <li key={user.id}>
              <Link
                href={`/profile/${user.id}`}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex items-center gap-2">
                  <Avatar
                    image={user.image}
                    name={user.name}
                    className="[&>*]:w-16"
                    imageProps={{
                      quality: 100,
                      sizes: "4rem",
                      // priority: true,
                    }}
                  />
                  <span className="font-medium">{user.name}</span>
                </div>
                <Stats
                  comments={user._count.comments}
                  likes={user._count.liked}
                  dislikes={user._count.disliked}
                />
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </>
  );
};

export default ProfilesPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          liked: true,
          disliked: true,
          comments: true,
        },
      },
    },
  });

  return {
    props: {
      session,
      users,
    },
  };
}) satisfies GetServerSideProps;
