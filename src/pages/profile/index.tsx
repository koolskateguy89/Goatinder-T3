import type { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

export default function UnusedPage() {
  return null;
}

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // if signed in, redirect to their profile page
  if (session?.user) {
    return {
      redirect: {
        destination: `/profile/${session.user.id}`,
        permanent: false,
      },
    };
  }

  // if not signed in, redirect to signin?
  return {
    redirect: {
      destination: `/signin`,
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;
