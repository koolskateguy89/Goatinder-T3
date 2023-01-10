import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

// TODO: use actual 404.tsx
const Page404: NextPage = () => {
  return <div>404</div>;
};

export default Page404;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
