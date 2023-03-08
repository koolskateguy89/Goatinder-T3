import type { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

export default function UnusedPage() {
  return null;
}

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  // if signed in, redirect to their profile page
  if (session?.user) {
    return {
      redirect: {
        destination: `/profile/${session.user.id}`,
        permanent: false,
      },
    };
  }

  // if not signed in, redirect to signin
  return {
    redirect: {
      destination: "/signin?callbackUrl=/profile",
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;
