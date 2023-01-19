import { useReducer } from "react";
import type { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { MdClose, MdFavorite } from "react-icons/md";

import { api } from "utils/api";
import type { getServerSideProps } from "pages/shoes/[objectID]";

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

// TODO: use Immer
function likeReducer(state: LikeState, action: LikeAction): LikeState {
  switch (action.type) {
    case "like":
      return {
        ...state,
        numLikes: state.numLikes + 1,
        // TODO: if userDisliked, then numDislikes should be decremented
        userLiked: true,
        userDisliked: false,
      };
    case "dislike":
      return {
        ...state,
        numDislikes: state.numDislikes + 1,
        userDisliked: true,
      };
    case "unlike":
      return {
        ...state,
        numLikes: state.numLikes - 1,
        userLiked: false,
      };
    case "undislike":
      return {
        ...state,
        numDislikes: state.numDislikes - 1,
        userDisliked: false,
      };
    default:
      return state;
  }
}

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

  const [likeState, dispatchLikeAction] = useReducer(likeReducer, {
    numLikes,
    numDislikes,
    userLiked,
    userDisliked,
  });

  const like = api.shoes.like.useMutation();
  const dislike = api.shoes.dislike.useMutation();

  const handleLike = async () => {
    if (likeState.userLiked) {
      // unlike
      // await dislike.mutateAsync({ objectId: goatShoe.objectID });
      dispatchLikeAction({ type: "unlike" });
    } else {
      // like
      // await like.mutateAsync({ objectId: goatShoe.objectID });
      dispatchLikeAction({ type: "like" });
    }
  };

  const handleDislike = async () => {
    if (likeState.userDisliked) {
      // undislike
      // await dislike.mutateAsync({ objectId: goatShoe.objectID });
      dispatchLikeAction({ type: "undislike" });
    } else {
      // dislike
      // await dislike.mutateAsync({ objectId: goatShoe.objectID });
      dispatchLikeAction({ type: "dislike" });
    }
  };

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
          {/* TODO: disable if not signed in */}
          <button
            type="button"
            onClick={handleDislike}
            className="btn-error btn"
          >
            {likeState.numDislikes}
            <MdClose />
            userDisliked: {JSON.stringify(likeState.userDisliked)}
          </button>
          <button
            type="button"
            onClick={handleLike}
            className="btn-success btn"
          >
            {likeState.numLikes}
            <MdFavorite />
            userLiked: {JSON.stringify(likeState.userLiked)}
          </button>
        </div>
      </div>
    </article>
  );
}
