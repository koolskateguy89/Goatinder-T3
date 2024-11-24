import type { Prisma } from "@prisma/client";

import type { toScoreStateComment } from "utils/comments";
import DateDisplay from "components/comment/DateDisplay";
import ScoreDisplay from "components/comment/ScoreDisplay";

type BaseCommentType = ReturnType<typeof toScoreStateComment> &
  Prisma.ShoeCommentGetPayload<{
    select: {
      id: true;
      content: true;
      datePosted: true;
    };
  }>;

export type BaseCommentProps = {
  comment: BaseCommentType;
  image: React.ReactNode;
  title: React.ReactNode;
  onVote?: (id: string, vote: "up" | "down") => void;
};

export default function BaseComment({
  comment,
  image,
  title,
  onVote,
}: BaseCommentProps) {
  const {
    id,
    content,
    datePosted,
    // dateUpdated,
  } = comment;

  const handleUpvote = () => onVote?.(id, "up");

  const handleDownvote = () => onVote?.(id, "down");

  return (
    <article className="grid min-h-[theme(spacing.40)] grid-cols-[auto,1fr,auto] p-2">
      <div>{image}</div>

      <div className="flex flex-col">
        {title}

        <DateDisplay date={datePosted} />

        <p
          // preserve line breaks and break lines on words
          className="whitespace-pre-wrap break-all"
        >
          {content}
        </p>
      </div>

      <ScoreDisplay
        score={comment.score}
        userUpvoted={comment.upvoted}
        userDownvoted={comment.downvoted}
        onUpvote={onVote && handleUpvote}
        onDownvote={onVote && handleDownvote}
      />
    </article>
  );
}
