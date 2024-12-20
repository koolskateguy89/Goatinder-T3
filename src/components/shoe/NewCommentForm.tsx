import { useId, useState } from "react";
import { useSession } from "next-auth/react";
import { TRPCClientError } from "@trpc/client";
import toast from "react-hot-toast";

import { api, type RouterOutputs } from "utils/api";

type CommentType = RouterOutputs["comments"]["getComments"][number];

export type NewCommentFormProps = {
  shoeId: string;
  onCommentAdded: (comment: CommentType) => void;
  loading: boolean;
};

export default function NewCommentForm({
  shoeId,
  onCommentAdded,
  loading,
}: NewCommentFormProps) {
  const { data: session } = useSession();
  const signedIn = session?.user != null;

  const textAreaId = useId();

  const [content, setContent] = useState("");

  const [addingComment, setAddingComment] = useState(false);

  const addComment = api.comments.addComment.useMutation();

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    setAddingComment(true);

    try {
      const newComment = await toast.promise(
        addComment.mutateAsync({
          shoeId,
          content: trimmedContent,
        }),
        {
          loading: "Adding comment...",
          success: "Comment added",
          error: "Failed to add comment",
        },
        {
          style: {
            minWidth: "200px",
          },
        },
      );

      setContent("");
      onCommentAdded(newComment);
    } catch (error) {
      if (error instanceof TRPCClientError) {
        console.log("TRPCClientError:", error);
      } else if (error instanceof Error) {
        console.log("Error:", error);
      } else {
        // not sure of the type
        console.log("unknown error =", error);
      }
    }

    setAddingComment(false);
  };

  return (
    <form onSubmit={handleAddComment} className="space-y-2">
      <div className="form-control">
        <label className="label" htmlFor={textAreaId}>
          <span className="label-text">Voice your opinion</span>
          {!signedIn && (
            <span className="label-text-alt">
              You need to be signed in to comment
            </span>
          )}
        </label>
        <textarea
          id={textAreaId}
          className="textarea textarea-bordered h-24 dark:placeholder:opacity-60"
          placeholder="An opinion is like a nose, everyone has one."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          title={signedIn ? undefined : "You need to be signed in to comment"}
          disabled={!signedIn || addingComment || loading}
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            !signedIn || // not signed in
            loading || // comments haven't loaded yet, so don't allow adding comment
            addingComment || // already adding comment
            content.trim().length === 0 // only entered whitespace
          }
        >
          {addingComment && <span className="loading" />}
          Post
        </button>
      </div>
    </form>
  );
}
