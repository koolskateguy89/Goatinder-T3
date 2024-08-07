import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import Brand from "components/Brand";

const LandingPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>goaTinder</title>
      </Head>
      <main className="container flex flex-grow flex-col items-center justify-center gap-y-4 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-center text-4xl font-semibold text-base-100 dark:text-base-content">
          Welcome to <Brand />!
        </h1>
        <span className="text-base-100 dark:text-base-content">
          Find your dream shoe...
        </span>
        <div className="flex gap-4">
          <Link href="/shoes/explore" className="btn btn-primary">
            Explore
          </Link>
          <Link href="/shoes/search" className="btn btn-primary">
            Search
          </Link>
        </div>
      </main>
    </>
  );
};

export default LandingPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
