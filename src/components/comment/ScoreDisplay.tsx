import { useSession } from "next-auth/react";
import clsx from "clsx";
import { BiDownvote, BiUpvote } from "react-icons/bi";

export type ScoreDisplayProps = {
  score: number;
  userUpvoted: boolean;
  userDownvoted: boolean;
  handleUpvote: () => void;
  handleDownvote: () => void;
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
    <div className="flex flex-col items-center text-lg">
      {/* TODO: icons that are filled */}
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
        disabled={!signedIn}
      >
        <BiUpvote />
      </button>
      <span className="font-semibold">sCoRe: {score}</span>
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
        disabled={!signedIn}
      >
        <BiDownvote />
      </button>
    </div>
  );
}
