import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";

// TODO: get them to create a profile?

const WelcomePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const session = useSession().data!;

  const sessionJsonLines = JSON.stringify(session, null, 2).split("\n");

  return (
    <>
      <Head>
        <title>Welcome - goaTinder</title>
      </Head>
      <main>
        <span>Welcome to goaTinder!</span>
        <div className="mockup-code">
          <pre data-prefix="$">
            <code>console.log(JSON.stringify(session, null, 2));</code>
          </pre>
          {sessionJsonLines.map((line) => (
            <pre key={line} data-prefix=">">
              <code>{line}</code>
            </pre>
          ))}
        </div>
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

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
