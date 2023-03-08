import Link from "next/link";
import type { User } from "@prisma/client";

import Avatar from "components/Avatar";

export type ChatPreviewProps = Pick<User, "name" | "image"> & {
  id: string;
  mostRecentMessage: string;
};

export default function ChatPreview({
  id,
  name,
  image,
  mostRecentMessage,
}: ChatPreviewProps) {
  return (
    <Link
      href={`/chat/${id}`}
      className="rounded-box flex items-center gap-x-4 border-2 border-base-300 bg-base-200 px-4 py-2 md:px-6 md:py-4"
    >
      <Avatar
        image={image}
        name={name}
        className="[&>*]:w-12 md:[&>*]:w-14"
        imageProps={{
          sizes: "(min-width: 768px): 3.5rem, 3rem",
        }}
      />
      <div>
        <div className="text-base font-semibold md:text-xl">{name}</div>
        {/* TODO: limit length and add ellipsis */}
        <div className="opacity-70">{mostRecentMessage}</div>
      </div>
    </Link>
  );
}
