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
  // or maybe use similar functionality to `Link`'s `as` prop
  // but how? `as` prop is only for client-side navigation
  // maybe import `ProfilePage`?
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
      destination: `/signin/?callbackUrl=/profile`,
      permanent: false,
    },
  };
}) satisfies GetServerSideProps;
