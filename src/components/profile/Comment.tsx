import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Image from "next/image";

import type { getServerSideProps } from "pages/profile/[id]";
import DateDisplay from "components/comment/DateDisplay";
import ScoreDisplay from "components/comment/ScoreDisplay";

type CommentType = InferGetServerSidePropsType<
  typeof getServerSideProps
>["comments"][number];

export type CommentProps = {
  comment: CommentType;
};

// TODO: make a base comment component that can be used for both shoe and profile comments
export default function Comment({ comment }: CommentProps) {
  const {
    content,
    datePosted,
    shoe,
    // dateUpdated,
  } = comment;

  return (
    <div className="grid min-h-[theme(spacing.40)] grid-cols-[auto,1fr,auto] border-2 border-gray-500 p-2">
      <div className="mr-2 flex flex-col items-center gap-2">
        <Link href={`/shoes/${shoe.objectId}`}>
          {/* TODO: image of shoe */}
          <figure className="relative h-20 w-20">
            <Image
              src={shoe.main_picture_url}
              alt={shoe.name}
              fill
              sizes="5rem"
            />
          </figure>
        </Link>
      </div>

      <div className="flex flex-col">
        <Link
          href={`/shoes/${shoe.objectId}`}
          className="link w-fit font-semibold"
        >
          {shoe.name}
        </Link>

        <DateDisplay date={datePosted} />

        {/* TODO: clamp to like 4 lines and let user expand if they want */}
        <p className="whitespace-pre-wrap break-all">{content}</p>
      </div>

      <ScoreDisplay
        score={comment.score}
        userUpvoted={comment.upvoted}
        userDownvoted={comment.downvoted}
      />
    </div>
  );
}
