import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

// TODO: get them to create a profile?

const WelcomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ session }) => {
  return (
    <>
      <Head>
        <title>Welcome - goaTinder</title>
      </Head>
      <div>
        <span>Welcome to Next.js!</span>
        {JSON.stringify(session)}
      </div>
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

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
