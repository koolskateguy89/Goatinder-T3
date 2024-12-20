import Link from "next/link";
import { useSession } from "next-auth/react";
import { MdDeleteForever } from "react-icons/md";

import type { RouterOutputs } from "utils/api";
import BaseComment from "components/BaseComment";
import Avatar from "components/Avatar";

type CommentType = RouterOutputs["comments"]["getComments"][number];

export type CommentProps = {
  comment: CommentType;
  onDelete: (id: string) => void;
  onVote: (id: string, vote: "up" | "down") => void;
};

export default function Comment({ comment, onDelete, onVote }: CommentProps) {
  const { author } = comment;

  const { data: session } = useSession();

  const isMyComment = session?.user?.id === author.id;

  const handleDelete = () => onDelete(comment.id);

  return (
    // TODO?: make collapsible - can use DaisyUI's collapse https://daisyui.com/components/collapse/
    // or HeadlessUI's Disclosure https://headlessui.dev/react/disclosure
    <BaseComment
      comment={comment}
      onVote={onVote}
      image={
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
      }
      title={
        <div className="flex items-center gap-x-2 font-semibold">
          <Link href={`/profile/${author.id}`} className="link">
            {author.name}
          </Link>
          {isMyComment && (
            <span className="badge badge-primary badge-sm">you</span>
          )}
        </div>
      }
    />
  );
}
