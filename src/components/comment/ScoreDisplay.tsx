import { useSession } from "next-auth/react";
import clsx from "clsx";
import { BiDownvote, BiUpvote } from "react-icons/bi";

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

  // TODO: handle handleUpvote and handleDownvote being undefined in title & cursor

  return (
    // TODO: icons that are filled
    <div className="-mr-2 flex w-12 flex-col items-center gap-y-0.5 text-lg">
      <button
        type="button"
        onClick={onUpvote}
        title={
          signedIn
            ? userUpvoted
              ? "Remove upvote"
              : "Upvote"
            : "You must be signed in to vote"
        }
        className={clsx(
          userUpvoted ? "text-green-500" : "text-gray-500",
          !signedIn && "cursor-not-allowed"
        )}
        disabled={!signedIn || onUpvote === undefined}
      >
        <BiUpvote />
      </button>

      <span className="font-semibold text-base-content/70 dark:text-base-content">
        {score}
      </span>

      <button
        type="button"
        onClick={onDownvote}
        title={
          signedIn
            ? userDownvoted
              ? "Remove downvote"
              : "Downvote"
            : "You must be signed in to vote"
        }
        className={clsx(
          userDownvoted ? "text-red-500" : "text-gray-500",
          !signedIn && "cursor-not-allowed"
        )}
        disabled={!signedIn || onDownvote === undefined}
      >
        <BiDownvote />
      </button>
    </div>
  );
}
