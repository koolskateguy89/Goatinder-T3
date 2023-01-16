import { useId, useState } from "react";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";
import clsx from "clsx";
import toast from "react-hot-toast";

import type { CommentAreaComment } from "types/comment";
import { api } from "utils/api";

export type NewCommentFormProps = {
  shoeId: string;
  onCommentAdded: (comment: CommentAreaComment) => void;
};

export default function NewCommentForm({
  shoeId,
  onCommentAdded,
}: NewCommentFormProps) {
  const { data: session } = useSession();
  const signedIn = session?.user != null;

  const textAreaId = useId();

  const [content, setContent] = useState("");

  const [addingComment, setAddingComment] = useState(false);

  const addComment = api.comments.addComment.useMutation();

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setAddingComment(true);

    // TODO: strip whitespace from content

    try {
      const newComment = await toast.promise(
        addComment.mutateAsync({
          shoeId,
          content,
        }),
        {
          loading: "Adding comment...",
          success: "Comment added",
          error: "Failed to add comment",
        },
        {
          position: "bottom-center",
          style: {
            // seems to not work
            minWidth: "200px",
          },
        }
      );

      setContent("");
      onCommentAdded(newComment);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        console.log("TRPCClientError: ", error);
      } else if (error instanceof Error) {
        console.log("Error: ", error);
      } else {
        // not sure of the type
        console.log("unknown error =", error);
      }
    }

    setAddingComment(false);
  };

  return (
    <form onSubmit={handleAddComment} className="card-body px-0">
      <div className="group/fc form-control">
        <label className="label" htmlFor={textAreaId}>
          <span className="label-text">Voice your opinion</span>
          {!signedIn && (
            <span className="label-text-alt">
              You need to be signed in to comment
            </span>
          )}
        </label>
        {/* TODO: markdown? mdx? */}
        <textarea
          id={textAreaId}
          className="textarea-bordered textarea h-24 dark:placeholder:opacity-60"
          placeholder="An opinion is like a nose, everyone has one."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          title={signedIn ? undefined : "You need to be signed in to comment"}
          disabled={!signedIn || addingComment}
        />
      </div>

      <div className="card-actions justify-end">
        <button
          type="submit"
          className={clsx("btn-primary btn", addingComment && "loading")}
          disabled={
            !signedIn || // not signed in
            content.replaceAll("\n", "").replaceAll(" ", "").length === 0 || // only entered whitespace
            addingComment // already loading
          }
        >
          {addingComment ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
}
