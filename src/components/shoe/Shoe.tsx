import type { InferGetServerSidePropsType } from "next";
import { useSession } from "next-auth/react";
import { MdClose, MdFavorite } from "react-icons/md";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import { api } from "utils/api";
import type { getServerSideProps } from "pages/shoes/[objectID]";
import ShoeCard from "components/ShoeCard";

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
});

type LikeState = {
  numLikes: number;
  numDislikes: number;
  userLiked: boolean;
  userDisliked: boolean;
};
type LikeAction =
  | { type: "like" }
  | { type: "dislike" }
  | { type: "unlike" }
  | { type: "undislike" };

const likeReducer: ImmerReducer<LikeState, LikeAction> = (draft, action) => {
  switch (action.type) {
    case "like":
      draft.numLikes += 1;
      draft.userLiked = true;
      if (draft.userDisliked) {
        // if was disliked, then undislike
        draft.numDislikes -= 1;
        draft.userDisliked = false;
      }
      break;
    case "dislike":
      draft.numDislikes += 1;
      draft.userDisliked = true;
      if (draft.userLiked) {
        // if was liked, then unlike
        draft.numLikes -= 1;
        draft.userLiked = false;
      }
      break;
    case "unlike":
      draft.numLikes -= 1;
      draft.userLiked = false;
      break;
    case "undislike":
      draft.numDislikes -= 1;
      draft.userDisliked = false;
      break;
    default:
      break;
  }
};

export type ShoeProps = {
  goatShoe: InferGetServerSidePropsType<typeof getServerSideProps>["goatShoe"];
  numLikes: number;
  numDislikes: number;
  userLiked: boolean;
  userDisliked: boolean;
};

export default function Shoe({
  goatShoe,
  numLikes,
  numDislikes,
  userLiked,
  userDisliked,
}: ShoeProps) {
  const { data: session } = useSession();
  const isSignedIn = session?.user !== undefined;

  const [likeState, dispatchLikeAction] = useImmerReducer(likeReducer, {
    numLikes,
    numDislikes,
    userLiked,
    userDisliked,
  });

  const like = api.shoes.like.useMutation();
  const dislike = api.shoes.dislike.useMutation();

  const handleLike = async () => {
    const unlike = likeState.userLiked;

    if (unlike) {
      dispatchLikeAction({ type: "unlike" });
    } else {
      dispatchLikeAction({ type: "like" });
    }

    like.mutate({
      shoe: {
        objectID: goatShoe.objectID,
        name: goatShoe.name,
        main_picture_url: goatShoe.main_picture_url,
      },
      remove: unlike,
    });
  };

  const handleDislike = async () => {
    const undislike = likeState.userDisliked;

    if (undislike) {
      dispatchLikeAction({ type: "undislike" });
    } else {
      dispatchLikeAction({ type: "dislike" });
    }

    dislike.mutate({
      shoe: {
        objectID: goatShoe.objectID,
        name: goatShoe.name,
        main_picture_url: goatShoe.main_picture_url,
      },
      remove: undislike,
    });
  };

  return (
    <ShoeCard
      shoe={goatShoe}
      imageProps={{
        priority: true,
      }}
    >
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

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 [&>*>svg]:text-lg">
        <button
          type="button"
          onClick={handleDislike}
          title={isSignedIn ? undefined : "Sign in to dislike"}
          className="btn-error btn w-24 gap-1 disabled:btn-error"
          disabled={!isSignedIn}
        >
          <span>
            <span className="sr-only">Number of dislikes:</span>
            {formatter.format(likeState.numDislikes)}
          </span>
          <MdClose />
        </button>
        <button
          type="button"
          onClick={handleLike}
          title={isSignedIn ? undefined : "Sign in to like"}
          className="btn-success btn w-24 gap-1 disabled:btn-success"
          disabled={!isSignedIn}
        >
          <span>
            <span className="sr-only">Number of likes:</span>
            {formatter.format(likeState.numLikes)}
          </span>
          <MdFavorite />
        </button>

        {(likeState.userDisliked || likeState.userLiked) && (
          <p className="col-span-2 text-center text-sm opacity-60">
            You
            {likeState.userDisliked ? " disliked " : " liked "}
            this shoe
          </p>
        )}
      </div>
    </ShoeCard>
  );
}
