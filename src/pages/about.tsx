import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

const Page: NextPage = () => {
  return (
    <>
      <div>Delete this page</div>
      <div className="mockup-code md:mx-48">
        <pre data-prefix="$">
          <code>pnpm add daisyui</code>
        </pre>
      </div>
    </>
  );
};

export default Page;

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
