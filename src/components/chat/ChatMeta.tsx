import Link from "next/link";
import type { User } from "@prisma/client";
import { MdOutlineArrowBack } from "react-icons/md";

import { useChatInfo } from "store/chat/info";
import Avatar from "components/Avatar";

export type ChatMetaProps = Pick<User, "name" | "image"> & {
  nameHref: React.ComponentProps<typeof Link>["href"];
};

export default function ChatMeta() {
  const { name, image, groupChat, id } = useChatInfo();

  const href = groupChat ? `/chat/${id}/manage` : `/profile/${id}`;

  return (
    <div className="flex items-center gap-x-2">
      <Link
        href="/chat"
        className="text-2xl md:hidden"
        aria-label="See all chats"
      >
        <MdOutlineArrowBack />
      </Link>

      <Avatar
        image={image}
        name={name}
        className="[&>*]:w-12"
        imageProps={{
          sizes: "3rem",
        }}
      />

      <Link href={href} className="ml-2 text-2xl font-semibold">
        <h1 className="max-w-xs truncate md:max-w-md lg:max-w-prose">{name}</h1>
      </Link>
    </div>
  );
}
