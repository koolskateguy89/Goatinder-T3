import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

const Page: NextPage = () => {
  return (
    <div>
      <h1 className="text-3xl">Delete this page?</h1>
      <ul>
        <li>Next.JS</li>
        <li>React</li>
        <li>Vercel</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
        <li>TypeScript</li>
      </ul>
    </div>
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
