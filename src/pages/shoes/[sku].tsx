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
> = ({ goatShoe }) => {
  const title = `${goatShoe.name} - goaTinder`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex h-screen items-center justify-center">
        <div>
          {/* // using negative margins for image & body to get rid of the spacing */}
          {/* // in the image on smaller screens */}
          <div className="card overflow-hidden ring-2 ring-primary">
            <figure className="relative mx-auto h-60 w-60 max-md:-mt-10 md:h-60 md:w-60">
              <Image
                src={goatShoe.main_picture_url}
                alt={goatShoe.name}
                fill
                sizes="15rem"
              />
            </figure>
            <div className="card-body items-center text-center max-md:-mt-10">
              <h2 className="link-hover link-primary link card-title">
                {goatShoe.name}
              </h2>
              <p className="text-sm">{goatShoe.brand_name}</p>
              <p>Retail: £{goatShoe.retail_price_cents_gbp * 0.01}</p>
              <div className="card-actions">
                {/* <button type="button" className="btn-primary btn">
            Buy Now
          </button> */}
                {/* <button type="button" className="btn-error btn">
            <MdOutlineThumbDown />
          </button>
          <button type="button" className="btn-success btn">
            <MdOutlineThumbUp />
          </button> */}
              </div>
            </div>
          </div>
        </div>
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

  // TODO: comment date serialization
  const dbShoe = await prisma.shoe.findUnique({
    where: {
      goatShoeSKU: sku,
    },
    include: {
      goatShoe: {
        select: {
          json: true,
        },
      },
      comments: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      },
      _count: {
        select: {
          dislikes: true,
          likes: true,
        },
      },
    },
  });

  // TODO: goat search if not found

  if (!dbShoe) {
    return {
      notFound: true,
    };
  }

  const goatShoe = JSON.parse(dbShoe.goatShoe.json) as GoatShoe;

  return {
    props: {
      session,
      goatShoe,
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) satisfies GetServerSideProps<any, { sku: string }>;
