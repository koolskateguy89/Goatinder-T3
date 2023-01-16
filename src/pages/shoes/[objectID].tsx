import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { unstable_getServerSession } from "next-auth";
import Head from "next/head";
import Image from "next/image";
import algoliasearch from "algoliasearch";
import { MdClose, MdFavorite } from "react-icons/md";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { env } from "env/server.mjs";
import type { GoatShoe } from "types/goat-shoe";
import { prisma } from "server/db";
import { api } from "utils/api";
import CommentArea from "components/CommentArea";

type ShoeComponentProps = {
  goatShoe: InferGetServerSidePropsType<typeof getServerSideProps>["goatShoe"];
  numLikes: number;
  numDislikes: number;
  userLiked: boolean;
  userDisliked: boolean;
};

const Shoe = ({
  goatShoe,
  numLikes,
  numDislikes,
  userLiked,
  userDisliked,
}: ShoeComponentProps) => {
  const like = api.shoes.like.useMutation();
  const dislike = api.shoes.dislike.useMutation();

  // could use useReducer here to handle userLiked and userDisliked changes
  // e.g.
  // const [state, dispatch] = useReducer(reducer, {
  //   numLikes,
  //   numDislikes,
  //   userLiked,
  //   userDisliked,
  // });
  // and then in the reducer you could handle all the state changes
  // e.g. (with types)
  // type State = {
  //   numLikes: number;
  //   numDislikes: number;
  //   userLiked: boolean;
  //   userDisliked: boolean;
  // };
  // type Action =
  //   | { type: "like" }
  //   | { type: "dislike" }
  //   | { type: "unlike" }
  //   | { type: "undislike" };
  // const reducer = (state: State, action: Action) => {
  //   switch (action.type) {
  //     case "like":
  //       return {
  //         ...state,
  //         numLikes: state.numLikes + 1,
  //         userLiked: true,
  //         userDisliked: false,
  //         // numDislikes: state.numDislikes - 1, //! need to check if userDisliked, here and in dislike
  //       };
  //     case "dislike":
  //       return {
  //         ...state,
  //         numDislikes: state.numDislikes + 1,
  //         userDisliked: true,
  //       };
  //     case "unlike":
  //       return {
  //         ...state,
  //         numLikes: state.numLikes - 1,
  //         userLiked: false,
  //       };
  //     case "undislike":
  //       return {
  //         ...state,
  //         numDislikes: state.numDislikes - 1,
  //         userDisliked: false,
  //       };
  //     default:
  //       throw new Error();
  //   }
  // };

  return (
    // using negative margins for image & body to get rid of the spacing in
    // the image on smaller screens
    <article className="card overflow-hidden ring-2 ring-primary">
      <figure className="relative mx-auto h-60 w-60 max-md:-mt-10 md:h-60 md:w-60">
        <Image
          src={goatShoe.main_picture_url}
          alt={goatShoe.name}
          fill
          sizes="15rem"
          priority
        />
      </figure>
      <div className="card-body items-center pt-0 text-center">
        <h1 className="link-hover link-primary link card-title">
          <a
            href={`https://www.goat.com/sneakers/${goatShoe.slug}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {goatShoe.name}
          </a>
        </h1>

        {/* TODO: decide what to do about story_html */}

        {goatShoe.designer && <p>Designer: {goatShoe.designer}</p>}

        <p className="text-sm text-base-content/60">{goatShoe.brand_name}</p>

        <p>objectID: {goatShoe.objectID}</p>

        <p>
          Retail price:{" "}
          <span className="text-accent">
            £{goatShoe.retail_price_cents_gbp * 0.01}
          </span>
        </p>
        <div className="card-actions [&>*]:gap-1 [&>*>svg]:text-lg">
          {/* TODO: how to signal the user has liked/disliked already */}
          <button type="button" className="btn-error btn">
            {numDislikes}
            <MdClose />
            userDisliked: {JSON.stringify(userDisliked)}
          </button>
          <button type="button" className="btn-success btn">
            {numLikes}
            <MdFavorite />
            userLiked: {JSON.stringify(userLiked)}
          </button>
        </div>
      </div>
    </article>
  );
};

// TODO: use https://www.algolia.com/doc/ui-libraries/recommend/introduction/what-is-recommend/
const ShoePage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ goatShoe, dbShoe }) => {
  const title = `${goatShoe.name} - goaTinder`;

  return (
    // TODO: maybe show recommended/related shoes in a column on the right
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className="flex flex-grow flex-col items-center justify-center py-4">
        <Shoe
          goatShoe={goatShoe}
          numLikes={dbShoe?._count.likes ?? 0}
          numDislikes={dbShoe?._count.dislikes ?? 0}
          userLiked={(dbShoe?.likes?.length ?? 0) > 0}
          userDisliked={(dbShoe?.dislikes?.length ?? 0) > 0}
        />

        <CommentArea
          shoeId={goatShoe.objectID}
          comments={dbShoe?.comments ?? []}
        />
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
      // searchSKU: goatShoe.search_sku,
      objectId: goatShoe.objectID,
    },
    select: {
      comments: {
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          // to check if user has upvoted
          upvoters: {
            where: {
              id: session?.user?.id ?? "",
            },
            select: {
              id: true,
            },
          },
          // to check if user has downvoted
          downvoters: {
            where: {
              id: session?.user?.id ?? "",
            },
            select: {
              id: true,
            },
          },
          _count: {
            select: {
              upvoters: true,
              downvoters: true,
            },
          },
        },
      },
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
