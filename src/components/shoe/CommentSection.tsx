import { useEffect } from "react";
import clsx from "clsx";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import { api, type RouterOutputs } from "utils/api";
import NewCommentForm from "components/shoe/NewCommentForm";
import CommentsList from "components/comment/CommentsList";
import Comment from "components/shoe/Comment";

type CommentType = RouterOutputs["comments"]["getComments"][number];

type CommentsState = {
  comments: CommentType[];
  sort: "newest" | "oldest" | "best";
};

type CommentsAction =
  | { type: "set"; payload: CommentType[] }
  | { type: "add"; payload: CommentType }
  | { type: "delete"; payload: string }
  | { type: "vote"; payload: { id: string; vote: "up" | "down" } }
  | { type: "sort"; payload: CommentsState["sort"] };

const commentsReducer: ImmerReducer<CommentsState, CommentsAction> = (
  draft,
  action
) => {
  switch (action.type) {
    case "set":
      draft.comments = action.payload;
      break;
    case "add":
      // this should actually depend on the sort order
      // but for now, just add to the beginning
      draft.comments.unshift(action.payload);
      break;
    case "delete":
      draft.comments = draft.comments.filter(
        (comment) => comment.id !== action.payload
      );
      break;
    case "vote": {
      const comment = draft.comments.find(
        (comm) => comm.id === action.payload.id
      );

      // should never happen
      if (!comment) break;

      if (action.payload.vote === "up") {
        const remove = comment.upvoted;

        if (remove) {
          // remove upvote
          comment.upvoted = false;
          comment.score -= 1;
        } else {
          // add upvote
          comment.upvoted = true;
          comment.score += comment.downvoted ? 2 : 1;
          comment.downvoted = false;
        }
      } else {
        const remove = comment.downvoted;

        if (remove) {
          // remove downvote
          comment.downvoted = false;
          comment.score += 1;
        } else {
          // add downvote
          comment.downvoted = true;
          comment.score -= comment.upvoted ? 2 : 1;
          comment.upvoted = false;
        }
      }

      break;
    }
    case "sort":
      draft.sort = action.payload;

      draft.comments.sort((a, b) => {
        if (action.payload === "best") {
          // sort by score, then date (newest first)
          return (
            b.score - a.score || b.datePosted.getTime() - a.datePosted.getTime()
          );
        }
        if (action.payload === "newest") {
          // sort by date, then score (best first)
          return (
            b.datePosted.getTime() - a.datePosted.getTime() || b.score - a.score
          );
        }
        // sort by date, then score (best first)
        return (
          a.datePosted.getTime() - b.datePosted.getTime() || b.score - a.score
        );
      });
      break;
    default:
      break;
  }
};

export type CommentSectionProps = {
  shoeId: string;
};

export default function CommentSection({ shoeId }: CommentSectionProps) {
  const commentsQuery = api.comments.getComments.useQuery(
    { shoeId },
    {
      refetchOnWindowFocus: false,
      // want to implement optimistic updates, but idrk how to with react-query
      // _optimisticResults: "optimistic",
      // but tbh I've kinda already implemented optimistic updates in the reducer
    }
  );

  const [commentsState, dispatchComments] = useImmerReducer(commentsReducer, {
    comments: [],
    sort: "newest",
  });

  useEffect(() => {
    dispatchComments({ type: "set", payload: commentsQuery.data ?? [] });
  }, [dispatchComments, commentsQuery.data]);

  const deleteComment = api.comments.deleteComment.useMutation();

  const voteMutation = api.comments.vote.useMutation();

  // NewCommentForm handles api mutation
  const onCommentAdded = (comment: CommentType) =>
    dispatchComments({ type: "add", payload: comment });

  const onCommentDeleted = (id: string) => {
    dispatchComments({ type: "delete", payload: id });

    // TODO?: error handling
    deleteComment.mutate({ id });
  };

  const onVote = (id: string, vote: "up" | "down") => {
    const comment = commentsState.comments.find((comm) => comm.id === id);

    // should never happen
    if (!comment) return;

    dispatchComments({
      type: "vote",
      payload: { id, vote },
    });

    const remove = vote === "up" ? comment.upvoted : comment.downvoted;

    voteMutation.mutate({ id, vote, remove });
  };

  const handleSortOrderChange = (sort: CommentsState["sort"]) =>
    dispatchComments({ type: "sort", payload: sort });

  return (
    <section className="w-full space-y-4 lg:w-1/2">
      <h2 className="text-2xl font-semibold">Comments</h2>

      <NewCommentForm
        shoeId={shoeId}
        onCommentAdded={onCommentAdded}
        loading={commentsQuery.isInitialLoading}
      />

      <div className="flex justify-end">
        <div className="tabs [&>:disabled]:cursor-default">
          <button
            type="button"
            onClick={() => handleSortOrderChange("best")}
            className={clsx(
              "tab tab-bordered",
              commentsState.sort === "best" && "tab-active"
            )}
            disabled={commentsState.comments.length === 0}
          >
            Best
          </button>
          <button
            type="button"
            onClick={() => handleSortOrderChange("newest")}
            className={clsx(
              "tab tab-bordered",
              commentsState.sort === "newest" && "tab-active"
            )}
            disabled={commentsState.comments.length === 0}
          >
            Newest
          </button>
          <button
            type="button"
            onClick={() => handleSortOrderChange("oldest")}
            className={clsx(
              "tab tab-bordered",
              commentsState.sort === "oldest" && "tab-active"
            )}
            disabled={commentsState.comments.length === 0}
          >
            Oldest
          </button>
        </div>
      </div>

      {commentsQuery.isInitialLoading ? (
        <div className="mt-8 text-center">LOADING</div>
      ) : commentsState.comments.length === 0 ? (
        <div className="mt-8 text-center text-lg">
          No comments yet
          <div className="mt-0.5 text-sm opacity-50 motion-safe:animate-bounce">{`It's quite empty in here`}</div>
        </div>
      ) : (
        <CommentsList ordered>
          {commentsState.comments.map((comment) => (
            <li key={comment.id}>
              <Comment
                comment={comment}
                onDelete={onCommentDeleted}
                onVote={onVote}
              />
            </li>
          ))}
        </CommentsList>
      )}
    </section>
  );
}
