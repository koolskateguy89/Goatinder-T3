import { useSession } from "next-auth/react";
import clsx from "clsx";
import { BiDownvote, BiUpvote } from "react-icons/bi";
import { ImArrowUp, ImArrowDown } from "react-icons/im";

const formatter = new Intl.NumberFormat("en", {
  notation: "compact",
});

export type ScoreDisplayProps = {
  score: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
  onUpvote?: () => void;
  onDownvote?: () => void;
};

export default function ScoreDisplay({
  score,
  userUpvoted,
  userDownvoted,
  onUpvote,
  onDownvote,
}: ScoreDisplayProps) {
  const { data: session } = useSession();

  const signedIn = session?.user != null;

  // If upvote and downvote callbacks are provided, the score is interactive
  // and the user must be signed in to vote
  const interactive = onUpvote !== undefined && onDownvote !== undefined;

  const upvoteButtonTitle = interactive
    ? signedIn
      ? userUpvoted
        ? "Remove upvote"
        : "Upvote"
      : "You must be signed in to vote"
    : userUpvoted
      ? "Upvoted by you"
      : undefined;

  const downvoteButtonTitle = interactive
    ? signedIn
      ? userDownvoted
        ? "Remove downvote"
        : "Downvote"
      : "You must be signed in to vote"
    : userDownvoted
      ? "Downvoted by you"
      : undefined;

  return (
    <div className="-mr-2 flex w-12 flex-col items-center gap-y-0.5 text-lg">
      <button
        type="button"
        onClick={interactive ? onUpvote : undefined}
        className={clsx(interactive && !signedIn && "cursor-not-allowed")}
        title={upvoteButtonTitle}
        aria-label={upvoteButtonTitle}
        disabled={!signedIn || !interactive}
        aria-hidden={!interactive}
      >
        {userUpvoted ? (
          <ImArrowUp className="text-green-500" />
        ) : (
          <BiUpvote
            className={clsx(
              "text-gray-500",
              interactive && signedIn && "hover:text-green-500",
            )}
          />
        )}
      </button>

      <span className="font-semibold text-base-content/70 dark:text-base-content">
        {formatter.format(score)}
      </span>

      <button
        type="button"
        onClick={interactive ? onDownvote : undefined}
        className={clsx(interactive && !signedIn && "cursor-not-allowed")}
        title={downvoteButtonTitle}
        aria-label={downvoteButtonTitle}
        disabled={!signedIn || !interactive}
        aria-hidden={!interactive}
      >
        {userDownvoted ? (
          <ImArrowDown className="text-red-500" />
        ) : (
          <BiDownvote
            className={clsx(
              "text-gray-500",
              interactive && signedIn && "hover:text-red-500",
            )}
          />
        )}
      </button>
    </div>
  );
}
