import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import Avatar from "components/Avatar";

const EditProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const title = `Editing ${user.name} - goaTinder`;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const bio = formData.get("bio") as string;

    // TODO: trpc call
  };

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

        <Link href=".." className="btn btn-primary">
          Back to Profile
        </Link>

        <section className="flex w-full flex-col items-center gap-y-2 lg:max-w-5xl">
          <h2 className="text-xl font-semibold">My bio</h2>
          <form onSubmit={handleSubmit}>
            <textarea
              name="bio"
              value={user.profile?.bio ?? ""}
              className="textarea-bordered textarea h-32 w-full md:h-52"
            />
          </form>
        </section>
      </main>
    </>
  );
};

export default EditProfilePage;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const userId = session?.user?.id;

  const profileId = context.params?.id;

  if (userId !== profileId) {
    return {
      redirect: {
        destination: `/profile/${profileId}`,
        permanent: false,
      },
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: profileId,
    },
    select: {
      id: true,
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
      session,
      user,
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) satisfies GetServerSideProps<any, { id: string }>;
