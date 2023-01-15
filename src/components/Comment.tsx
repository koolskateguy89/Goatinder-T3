import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdDeleteForever } from "react-icons/md";

import type { Comment as CommentType } from "types/comment";
import { api } from "utils/api";
import Avatar from "components/Avatar";
import DateDisplay from "components/comment/DateDisplay";
import ScoreDisplay from "components/comment/ScoreDisplay";

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

  const [score, setScore] = useState(_count.upvoters - _count.downvoters);

  const [userUpvoted, setUserUpvoted] = useState(_userUpvoted);

  const [userDownvoted, setUserDownvoted] = useState(_userDownvoted);

  const deleteComment = api.comments.deleteComment.useMutation();

  const upvote = api.comments.upvote.useMutation();
  const downvote = api.comments.downvote.useMutation();

  const handleDelete = () => {
    // TODO: error handling
    deleteComment.mutate({ id });
    onCommentDeleted(id);
  };

  // could use useReducer instead of useState for upvote/downvote (?) explore this
  // how do i do this
  // copilot generated this:
  // const [upvoteState, dispatchUpvote] = useReducer(upvoteReducer, {
  //   userUpvoted: false,
  //   userDownvoted: false,
  //   score: 0,
  // });
  // type UpvoteState = {
  //   userUpvoted: boolean;
  //   userDownvoted: boolean;
  //   score: number;
  // };
  // type UpvoteAction =
  //   | { type: "upvote" }
  //   | { type: "downvote" }
  //   | { type: "removeUpvote" }
  //   | { type: "removeDownvote" };
  // function upvoteReducer(state: UpvoteState, action: UpvoteAction) {
  //   switch (action.type) {
  //     case "upvote":
  //       return {
  //         userUpvoted: true,
  //         userDownvoted: false,
  //         score: state.score + 1, //! not sure if this is correct, it depends on whether the user was downvoted or not (+1/2)
  //       };
  //     case "downvote":
  //       return {
  //         userUpvoted: false,
  //         userDownvoted: true,
  //         score: state.score - 1, //! not sure if this is correct, it depends on whether the user was upvoted or not (-1/2)
  //       };
  //     case "removeUpvote":
  //       return {
  //         userUpvoted: false,
  //         userDownvoted: false,
  //         score: state.score - 1,
  //       };
  //     case "removeDownvote":
  //       return {
  //         userUpvoted: false,
  //         userDownvoted: false,
  //         score: state.score + 1,
  //       };
  //     default:
  //       return state;
  //   }
  // }

  // could use useEffect to update score when userUpvoted or userDownvoted changes
  // but useReducer might be better and will let me learn something new

  // TODO: try and simplify logic in handleUpvote and handleDownvote
  const handleUpvote = () => {
    console.log("upvote");
    if (userUpvoted) {
      console.log("remove upvote");
      // remove upvote
      setUserUpvoted(false);
      setScore((prevScore) => prevScore - 1);
    } else {
      console.log("add upvote");
      // add upvote
      setUserUpvoted(true);
      const wasDownvoted = userDownvoted;
      setUserDownvoted(false);
      setScore((prevScore) => prevScore + (wasDownvoted ? 2 : 1));
    }

    console.log("upvote.mutate({ id })");
    // TODO: handle removing upvote
    upvote.mutate({ id });
  };

  const handleDownvote = () => {
    console.log("downvote");
    if (userDownvoted) {
      console.log("remove downvote");
      // remove downvote
      setUserDownvoted(false);
      setScore((prevScore) => prevScore + 1);
    } else {
      console.log("add downvote");
      // add downvote
      setUserDownvoted(true);
      const wasUpvoted = userUpvoted;
      setUserUpvoted(false);
      setScore((prevScore) => prevScore - (wasUpvoted ? 2 : 1));
    }

    console.log("downvote.mutate({ id })");
    downvote.mutate({ id });
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

        {/* TODO: clamp to line 4 lines and let user expand if they want */}
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
