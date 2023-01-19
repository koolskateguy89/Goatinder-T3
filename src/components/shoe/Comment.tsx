import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdDeleteForever } from "react-icons/md";

import type { RouterOutputs } from "utils/api";
import Avatar from "components/Avatar";
import DateDisplay from "components/comment/DateDisplay";
import ScoreDisplay from "components/comment/ScoreDisplay";

type CommentType = RouterOutputs["comments"]["getComments"][number];

export type CommentProps = {
  comment: CommentType;
  onDelete: (id: string) => void;
  onVote: (id: string, vote: "up" | "down") => void;
};

// TODO: MAYBE try to implement edit functionality
// TODO: MAYBE a report feature?
export default function Comment({ comment, onDelete, onVote }: CommentProps) {
  const {
    id,
    content,
    datePosted,
    // dateUpdated,
    author,
  } = comment;

  const { data: session } = useSession();

  const isMyComment = session?.user?.id === author.id;

  const handleDelete = () => onDelete(id);

  const handleUpvote = () => onVote(id, "up");

  const handleDownvote = () => onVote(id, "down");

  return (
    <div className="grid min-h-[theme(spacing.40)] grid-cols-[auto,1fr,auto] border-2 border-gray-500 p-2">
      <div className="mr-2 flex flex-col items-center gap-2">
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

      <div className="flex flex-col">
        <Link
          href={`/profile/${author.id}`}
          className="link w-fit font-semibold"
        >
          {author.name}
        </Link>

        <DateDisplay date={datePosted} />

        {/* TODO: clamp to like 4 lines and let user expand if they want */}
        <p className="whitespace-pre-wrap break-all">{content}</p>
      </div>

      <ScoreDisplay
        score={comment.score}
        userUpvoted={comment.upvoted}
        userDownvoted={comment.downvoted}
        onUpvote={handleUpvote}
        onDownvote={handleDownvote}
      />
    </div>
  );
}
