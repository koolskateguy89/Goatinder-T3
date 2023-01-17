import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdDeleteForever } from "react-icons/md";

import { api, type RouterOutputs } from "utils/api";
import Avatar from "components/Avatar";
import DateDisplay from "components/comment/DateDisplay";
import ScoreDisplay from "components/comment/ScoreDisplay";

type CommentType = RouterOutputs["comments"]["getComments"][number];

export type CommentProps = {
  comment: CommentType;
  onCommentDeleted: (id: string) => void;
};

// TODO: MAYBE try to implement edit functionality
// TODO: MAYBE a report feature?
export default function Comment({ comment, onCommentDeleted }: CommentProps) {
  const {
    id,
    content,
    datePosted,
    // dateUpdated,
    author,
  } = comment;

  const { data: session } = useSession();

  const isMyComment = session?.user?.id === author.id;

  const deleteComment = api.comments.deleteComment.useMutation();

  const upvote = api.comments.upvote.useMutation();
  const downvote = api.comments.downvote.useMutation();

  const handleDelete = () => {
    // TODO: error handling
    deleteComment.mutate({ id });
    onCommentDeleted(id);
  };

  const handleUpvote = () => {
    const removeUpvote = comment.upvoted;

    if (removeUpvote) {
      comment.upvoted = false;
      comment.score -= 1;
    } else {
      comment.upvoted = true;
      const wasDownvoted = comment.downvoted;
      comment.downvoted = false;
      comment.score += wasDownvoted ? 2 : 1;
    }

    upvote.mutate({ id, remove: removeUpvote });
  };

  const handleDownvote = () => {
    const removeDownvote = comment.downvoted;

    if (removeDownvote) {
      comment.downvoted = false;
      comment.score += 1;
    } else {
      comment.downvoted = true;
      const wasUpvoted = comment.upvoted;
      comment.upvoted = false;
      comment.score -= wasUpvoted ? 2 : 1;
    }

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
        score={comment.score}
        userUpvoted={comment.upvoted}
        userDownvoted={comment.downvoted}
        handleUpvote={handleUpvote}
        handleDownvote={handleDownvote}
      />
    </div>
  );
}
