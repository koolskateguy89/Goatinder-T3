import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
// TODO: import client from utils/algolia
import algoliasearch from "algoliasearch";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { env } from "env/server.mjs";
import type { GoatShoe } from "types/goat-shoe";
import { prisma } from "server/db";
import CommentSection from "components/shoe/CommentSection";
import Shoe from "components/shoe/Shoe";

// TODO: use https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/
const ShoePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ goatShoe, dbShoe }) => {
  const title = `${goatShoe.name} - goaTinder`;

  return (
    // TODO: maybe show recommended/related shoes in a column on the right
    // if not, then show comments on the right instead of below (currently doing this on lg screens)
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex flex-col items-center gap-4 py-4 lg:flex-row lg:items-start lg:justify-center lg:px-4">
        <div className="top-20 lg:sticky">
          <Shoe
            goatShoe={goatShoe}
            numLikes={dbShoe?._count.likes ?? 0}
            numDislikes={dbShoe?._count.dislikes ?? 0}
            userLiked={(dbShoe?.likes?.length ?? 0) > 0}
            userDisliked={(dbShoe?.dislikes?.length ?? 0) > 0}
          />
        </div>

        <CommentSection shoeId={goatShoe.objectID} />
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

  const objectID = context.params?.objectID;

  if (!objectID)
    return {
      notFound: true,
    };

  const client = algoliasearch(
    env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    env.NEXT_PUBLIC_ALGOLIA_API_KEY
  );

  const index = client.initIndex("product_variants_v2");

  const attributesToRetrieve = [
    "name",
    "brand_name",
    "slug",
    "retail_price_cents_gbp",
    "main_picture_url",
    "designer",
    "story_html",
    "objectID",
  ] as const;

  type GoatShoeSubset = Pick<GoatShoe, (typeof attributesToRetrieve)[number]>;

  const goatShoe = await index
    .getObject<GoatShoeSubset>(objectID, {
      attributesToRetrieve,
    })
    // doesn't exist
    .catch(() => null);

  if (!goatShoe)
    return {
      notFound: true,
    };

  const dbShoe = await prisma.shoe.findUnique({
    where: {
      objectId: goatShoe.objectID,
    },
    select: {
      // to check if user has liked
      likes: {
        where: {
          id: session?.user?.id ?? "",
        },
        select: {
          id: true,
        },
      },
      // to check if user has disliked
      dislikes: {
        where: {
          id: session?.user?.id ?? "",
        },
        select: {
          id: true,
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

  return {
    props: {
      session,
      goatShoe,
      dbShoe,
    },
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) satisfies GetServerSideProps<any, { objectID: string }>;
