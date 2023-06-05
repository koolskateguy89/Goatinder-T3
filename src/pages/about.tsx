import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { getServerSession } from "next-auth";
import { FaGithub } from "react-icons/fa";

import { authOptions } from "pages/api/auth/[...nextauth]";

const AboutPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>About - goaTinder</title>
      </Head>
      <main className="container prose p-4">
        <h1 className="flex flex-row space-x-2">
          <span>About</span>
          <a
            href="https://github.com/koolskateguy89/goatinder-T3/"
            target="_blank"
          >
            <FaGithub />
          </a>
        </h1>

        <p>
          Bootstrapped using the{" "}
          <a href="https://create.t3.gg/" rel="noreferrer" target="_blank">
            T3 stack
          </a>
        </p>

        <article>
          <h2>
            <u>Tech Stack</u>
          </h2>
          <ul>
            <li>TypeScript</li>
            <li>Next.Js</li>
            <li>React</li>
            <li>Prisma</li>
            <li>PostgreSQL</li>
            <li>NextAuth</li>
            <li>Tailwind</li>
            <li>tRPC</li>
            <li>HeadlessUI</li>
            <li>Algolia</li>
            <li>pnpm</li>
          </ul>
        </article>
      </main>
    </>
  );
};

export default AboutPage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
