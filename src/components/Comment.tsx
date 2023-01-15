import { useReducer } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdDeleteForever } from "react-icons/md";

import type { Comment as CommentType } from "types/comment";
import { api } from "utils/api";
import Avatar from "components/Avatar";
import DateDisplay from "components/comment/DateDisplay";
import ScoreDisplay from "components/comment/ScoreDisplay";

type VoteState = {
  userUpvoted: boolean;
  userDownvoted: boolean;
  score: number;
};

type VoteAction =
  | { type: "upvote" }
  | { type: "downvote" }
  | { type: "removeUpvote" }
  | { type: "removeDownvote" };

function voteReducer(state: VoteState, action: VoteAction) {
  switch (action.type) {
    case "upvote":
      return {
        userUpvoted: true,
        userDownvoted: false,
        score: state.score + (state.userDownvoted ? 2 : 1),
      };
    case "downvote":
      return {
        userUpvoted: false,
        userDownvoted: true,
        score: state.score - (state.userUpvoted ? 2 : 1),
      };
    case "removeUpvote":
      return {
        userUpvoted: false,
        userDownvoted: false,
        score: state.score - 1,
      };
    case "removeDownvote":
      return {
        userUpvoted: false,
        userDownvoted: false,
        score: state.score + 1,
      };
    default:
      return state;
  }
}

export type CommentProps = {
  comment: CommentType;
  userUpvoted: boolean;
  userDownvoted: boolean;
  onCommentDeleted: (id: string) => void;
};

// TODO: MAYBE try to implement edit functionality
// TODO: MAYBE a report feature?
export default function Comment({
  comment: {
    id,
    content,
    datePosted,
    // dateUpdated,
    author,
    _count,
  },
  userUpvoted: _userUpvoted,
  userDownvoted: _userDownvoted,
  onCommentDeleted,
}: CommentProps) {
  const { data: session } = useSession();

  const isMyComment = session?.user?.id === author.id;

  const [voteState, dispatchVote] = useReducer(voteReducer, {
    userUpvoted: _userUpvoted,
    userDownvoted: _userDownvoted,
    score: _count.upvoters - _count.downvoters,
  });

  const { score, userUpvoted, userDownvoted } = voteState;

  const deleteComment = api.comments.deleteComment.useMutation();

  const upvote = api.comments.upvote.useMutation();
  const downvote = api.comments.downvote.useMutation();

  const handleDelete = () => {
    // TODO: error handling
    deleteComment.mutate({ id });
    onCommentDeleted(id);
  };

  const handleUpvote = () => {
    const removeUpvote = userUpvoted;

    dispatchVote({ type: removeUpvote ? "removeUpvote" : "upvote" });

    upvote.mutate({ id, remove: removeUpvote });
  };

  const handleDownvote = () => {
    const removeDownvote = userDownvoted;

    dispatchVote({ type: removeDownvote ? "removeDownvote" : "downvote" });

    downvote.mutate({ id, remove: removeDownvote });
  };

  return (
    <div className="flex h-40 items-start gap-2 p-2 outline">
      <div className="flex flex-col items-center gap-2">
        <Link href={`/profile/${author.id}`}>
          <Avatar
            image={author.image}
            name={author.name}
            className="[&>*]:w-12"
            imageProps={{
              sizes: "3rem",
            }}
          />
        </Link>
        {isMyComment && (
          <button
            type="button"
            onClick={handleDelete}
            aria-label="Delete comment"
            className="text-2xl text-red-500"
          >
            <MdDeleteForever />
          </button>
        )}
      </div>

      <div className="flex flex-grow flex-col">
        <Link
          href={`/profile/${author.id}`}
          className="link w-fit font-semibold"
        >
          {author.name}
        </Link>

        <DateDisplay date={datePosted} />

        {/* TODO: clamp to like 4 lines and let user expand if they want */}
        <p>{content}</p>
      </div>

      <ScoreDisplay
        score={score}
        userUpvoted={userUpvoted}
        userDownvoted={userDownvoted}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
      />
    </div>
  );
}
