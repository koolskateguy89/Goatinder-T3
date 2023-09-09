import { useRef, useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";
import toast from "react-hot-toast";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { api } from "utils/api";
import Avatar from "components/Avatar";

const EditProfilePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ user }) => {
  const editProfile = api.user.createOrUpdateProfile.useMutation();

  const currentBio = useRef(user.profile?.bio ?? "");
  const [newBio, setNewBio] = useState(user.profile?.bio ?? "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const bio = newBio.trim();

    // shouldn't happen anyway
    if (!bio) {
      toast.error("Bio cannot be empty");
      return;
    }

    await toast.promise(editProfile.mutateAsync({ bio }), {
      loading: "Saving...",
      success: "Saved!",
      error: "Failed to save",
    });

    currentBio.current = bio;
  };

  return (
    <>
      <Head>
        <title>Edit profile - goaTinder</title>
      </Head>
      <main className="container flex flex-col items-center gap-y-4 px-4 pb-4 pt-2">
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

        <Link href=".." className="btn-primary btn">
          Back to Profile
        </Link>

        <section className="flex w-full flex-col items-center gap-y-2 lg:max-w-5xl">
          <h2 className="text-xl font-semibold">My bio</h2>
          <form onSubmit={handleSubmit} className="mx-auto w-full space-y-4">
            <textarea
              name="bio"
              value={newBio}
              onChange={(e) => setNewBio(e.target.value)}
              className="textarea-bordered textarea h-32 w-full md:h-52"
            />
            <button
              type="submit"
              className="btn-primary btn-block btn"
              disabled={
                !newBio.trim() ||
                newBio.trim() === currentBio.current ||
                editProfile.isLoading
              }
            >
              Save
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default EditProfilePage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

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
}) satisfies GetServerSideProps<Record<string, unknown>, { id: string }>;
