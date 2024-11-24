import Link from "next/link";
import { useRouter } from "next/router";
import type { User } from "@prisma/client";
import clsx from "clsx";

import Avatar from "components/Avatar";

export type SidebarChatPreviewProps = Pick<User, "name" | "image"> & {
  id: string;
  mostRecentMessage: React.ReactNode;
};

export default function SidebarChatPreview({
  id,
  name,
  image,
  mostRecentMessage,
}: SidebarChatPreviewProps) {
  const router = useRouter();
  const isActive = id === router.query.id;

  return (
    <Link
      href={`/chat/${id}`}
      className={clsx(
        "rounded-box flex items-center gap-x-4 border-2 px-6 py-4 transition-colors",
        isActive
          ? "bg-base-content text-base-100"
          : "border-base-300 bg-base-200",
      )}
    >
      <Avatar
        image={image}
        name={name}
        className="[&>*]:w-12"
        imageProps={{
          sizes: "3rem",
        }}
      />
      <div>
        <div className="text-lg font-semibold">{name}</div>
        <div className="line-clamp-2 text-sm opacity-70">
          {mostRecentMessage}
        </div>
      </div>
    </Link>
  );
}
