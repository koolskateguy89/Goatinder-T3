import React, { useId, useState } from "react";
import { useSession } from "next-auth/react";

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

  const addComment = api.comments.addComment.useMutation();

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newComment = await addComment.mutateAsync({
      shoeId,
      content,
    });
    onCommentAdded(newComment);

    setContent("");
  };

  // TODO
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
          disabled={!signedIn}
        />
      </div>

      <div className="card-actions justify-end">
        <button
          type="submit"
          className="btn-primary btn"
          disabled={!signedIn || content.replaceAll("\n", "").length === 0}
        >
          Post
        </button>
      </div>
    </form>
  );
}
