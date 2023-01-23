import { useId, useState } from "react";
import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import toast from "react-hot-toast";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import { api } from "utils/api";
import Brand from "components/Brand";
import SessionData from "components/welcome/SessionData";

const WelcomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ profileExists }) => {
  const bioId = useId();

  const [canAddBio, setCanAddBio] = useState(!profileExists);

  const createProfile = api.user.createProfile.useMutation();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const bioElem = e.currentTarget.elements.namedItem(
      bioId
    ) as HTMLTextAreaElement;

    const bio = bioElem.value.trim();

    if (!bio) {
      toast.error("Bio cannot be empty");
      return;
    }

    setCanAddBio(false);

    toast
      .promise(
        createProfile.mutateAsync({
          bio,
        }),
        {
          loading: "Creating profile...",
          success: "Profile created!",
          error: "Failed to create profile",
        }
      )
      .catch(() => setCanAddBio(true));
  };

  return (
    <>
      <Head>
        <title>Welcome - goaTinder</title>
      </Head>
      <main className="container space-y-4 p-4">
        <h1 className="text-center text-4xl font-semibold">
          Welcome to <Brand />!
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mx-auto flex w-full flex-col items-stretch"
        >
          <div className="form-control">
            <label htmlFor={bioId} className="label">
              <span className="label-text">Create your bio</span>
            </label>
            <textarea
              id={bioId}
              className="textarea-bordered textarea h-32 w-full placeholder:text-base-content/90 md:h-52"
              placeholder={
                profileExists
                  ? "You already have a bio, check your profile ;)"
                  : "Be creative!"
              }
              readOnly={!canAddBio}
              disabled={profileExists}
            />
          </div>
          <button
            type="submit"
            className="btn-primary btn mt-3"
            disabled={!canAddBio}
          >
            Create Profile
          </button>
        </form>

        <SessionData />
      </main>
    </>
  );
};

export default WelcomePage;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session || !session.user)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const callbackUrl = context.query.callbackUrl as string | undefined;

  // should be 0 or 1
  const numberOfProfiles = await prisma.profile.count({
    where: {
      userId: session.user.id,
    },
  });

  const profileExists = numberOfProfiles > 0;

  // If user has already made a profile and a callbackUrl is provided, redirect to the callbackUrl
  if (profileExists && callbackUrl) {
    return {
      redirect: {
        destination: callbackUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      profileExists,
    },
  };
}) satisfies GetServerSideProps;
