import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { prisma } from "server/db";
import type { GoatShoe } from "types/goat-shoe";

const ShoePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ session, shoe }) => {
  const title = `${shoe.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main>
        <div>lol</div>
        <div>lol</div>
      </main>
    </>
  );
};

export default ShoePage;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const sku = context.params?.sku;

  const dbShoe = await prisma.shoe.findUnique({
    where: {
      searchSKU: sku,
    },
  });

  // TODO: goat search if not found

  if (!dbShoe)
    return {
      notFound: true,
    };

  const shoe = JSON.parse(dbShoe.json) as GoatShoe;

  return {
    props: {
      session,
      shoe,
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) satisfies GetServerSideProps<any, { sku: string }>;
