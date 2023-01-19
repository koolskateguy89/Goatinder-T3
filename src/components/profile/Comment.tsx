import type { InferGetServerSidePropsType } from "next";
import Link from "next/link";
import Image from "next/image";

import type { getServerSideProps } from "pages/profile/[id]";
import BaseComment from "components/BaseComment";

type CommentType = InferGetServerSidePropsType<
  typeof getServerSideProps
>["comments"][number];

export type CommentProps = {
  comment: CommentType;
};

export default function Comment({ comment }: CommentProps) {
  const { shoe } = comment;

  // TODO
  return (
    <BaseComment
      comment={comment}
      image={
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
      }
      title={
        <Link
          href={`/shoes/${shoe.objectId}`}
          className="link w-fit font-semibold"
        >
          {shoe.name}
        </Link>
      }
    />
  );
}
