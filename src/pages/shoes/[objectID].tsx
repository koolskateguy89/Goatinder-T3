import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { fullClient } from "utils/algolia";
import type { GoatShoe } from "types/goat-shoe";
import { prisma } from "server/db";
import CommentSection from "components/shoe/CommentSection";
import Shoe from "components/shoe/Shoe";

const ShoePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ goatShoe, dbShoe }) => {
  const title = `${goatShoe.name} - goaTinder`;

  return (
    // TODO?: maybe show recommended/related shoes in a column on the right
    // https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/w
    // if not, then show comments on the right instead of below (currently doing this on lg screens)
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="container flex flex-col items-center gap-4 py-4 max-lg:px-4 lg:flex-row lg:items-start lg:justify-center">
        <div className="top-20 lg:sticky">
          <Shoe
            goatShoe={goatShoe}
            numLikes={dbShoe._count.likes}
            numDislikes={dbShoe._count.dislikes}
            userLiked={dbShoe.likes.length > 0}
            userDisliked={dbShoe.dislikes.length > 0}
          />
        </div>

        <CommentSection shoeId={goatShoe.objectID} />
      </main>
    </>
  );
};

export default ShoePage;

export const getServerSideProps = (async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);

  const objectID = context.params?.objectID;

  if (!objectID)
    return {
      notFound: true,
    };

  const index = fullClient.initIndex("product_variants_v2");

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

  // using upsert to create if it doesn't exist
  const dbShoe = await prisma.shoe.upsert({
    where: {
      objectId: goatShoe.objectID,
    },
    update: {}, // don't need to update anything
    create: {
      objectId: goatShoe.objectID,
      name: goatShoe.name,
      main_picture_url: goatShoe.main_picture_url,
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
