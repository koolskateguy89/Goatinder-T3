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
      className="rounded-box flex items-center gap-x-4 border-2 border-base-300 bg-base-200 px-6 py-4"
    >
      <Avatar
        image={image}
        name={name}
        className="[&>*]:w-16"
        imageProps={{
          sizes: "4rem",
        }}
      />
      <div>
        <div className="text-2xl font-semibold">{name}</div>
        <div className=" opacity-70">{mostRecentMessage}</div>
      </div>
    </Link>
  );
}
