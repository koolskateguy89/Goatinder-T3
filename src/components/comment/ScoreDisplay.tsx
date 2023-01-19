import { useSession } from "next-auth/react";
import clsx from "clsx";
import { BiDownvote, BiUpvote } from "react-icons/bi";

export type ScoreDisplayProps = {
  score: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
  handleUpvote?: () => void;
  handleDownvote?: () => void;
};

export default function ScoreDisplay({
  score,
  userUpvoted,
  userDownvoted,
  handleUpvote,
  handleDownvote,
}: ScoreDisplayProps) {
  const { data: session } = useSession();

  const signedIn = session?.user != null;

  return (
    // TODO: icons that are filled
    <div className="-mr-2 flex w-12 flex-col items-center gap-y-0.5 text-lg">
      <button
        type="button"
        onClick={handleUpvote}
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
        disabled={!signedIn || handleDownvote === undefined}
      >
        <BiUpvote />
      </button>

      <span className="font-semibold">{score}</span>

      <button
        type="button"
        onClick={handleDownvote}
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
        disabled={!signedIn || handleDownvote === undefined}
      >
        <BiDownvote />
      </button>
    </div>
  );
}
