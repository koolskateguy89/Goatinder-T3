import Link from "next/link";
import type { User } from "@prisma/client";

import Avatar from "components/Avatar";

export type ChatMetaProps = Pick<User, "name" | "image"> & {
  nameHref: React.ComponentProps<typeof Link>["href"];
};

export default function ChatMeta({ name, image, nameHref }: ChatMetaProps) {
  return (
    <div className="flex items-center">
      <Avatar
        image={image}
        name={name}
        className="chat-image [&>*]:w-12"
        imageProps={{
          sizes: "3rem",
        }}
      />

      <Link href={nameHref} className="ml-4 text-2xl font-semibold">
        {name}
      </Link>
    </div>
  );
}
