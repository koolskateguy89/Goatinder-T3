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
      className="rounded-box flex items-center border-2 border-base-300 bg-base-200 px-6 py-4"
    >
      <Avatar
        image={image}
        name={name}
        className="[&>*]:w-16"
        imageProps={{
          sizes: "4rem",
        }}
      />
      <div className="ml-4 space-y-6">
        <div className="text-2xl font-semibold">
          <span>{name}</span>
        </div>
        <div>
          <span className="opacity-70">{mostRecentMessage}</span>
        </div>
      </div>
    </Link>
  );
}
