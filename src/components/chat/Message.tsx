import { useSession } from "next-auth/react";
import type { GroupChatMessage, PrivateMessage, User } from "@prisma/client";
import clsx from "clsx";

import { api } from "utils/api";
import { useChatInfo } from "store/chat/info";
import Avatar from "components/Avatar";

type CommonMessage = GroupChatMessage | PrivateMessage;

// /images/stock/photo-1534528741775-53994a69daeb.jpg

export type MessageProps = Pick<CommonMessage, "id" | "content" | "sentAt"> & {
  sender: Pick<User, "id" | "name" | "image">;
  onDelete: (messageId: string) => void;
};

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

function formatDate(date: Date): string {
  const now = Date.now();

  // TODO: hour, time, short date
  if (now - date.getTime() > ONE_DAY_MS) return date.toISOString();

  // TODO: shorter, just hour & time
  return date.toLocaleTimeString();
}

export default function Message({
  id,
  sender,
  content,
  sentAt,
  onDelete,
}: MessageProps) {
  const { data: session } = useSession();

  const isMyMessage = session?.user?.id === sender.id;

  const { groupChat } = useChatInfo();

  // TODO: rightclick -> menu -> delete [if isMyMessage or iAmAdmin(only for gc

  const deleteMut = api.chat.deleteMessage.useMutation();

  const deleteMessage = () => {
    deleteMut.mutate({ groupChat, id });
    onDelete(id);
  };

  return (
    <article className={clsx("chat", isMyMessage ? "chat-end" : "chat-start")}>
      {/* TODO?: right click avatar -> menu -> open profile, other options */}
      <Avatar
        image={sender.image}
        name={sender.name}
        className="chat-image [&>*]:w-10"
        imageProps={{
          sizes: "2.5rem",
        }}
      />
      <div className="chat-header">
        {sender.name}
        <time className="text-xs opacity-50">{formatDate(sentAt)}</time>
      </div>
      <div className="chat-bubble">{content}</div>
      {/* TODO: not sure about if we want to show status (seen etc.) */}
      <div className="chat-footer opacity-50">Delivered</div>
      {isMyMessage && (
        <button
          type="button"
          onClick={deleteMessage}
          aria-label="Delete message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </article>
  );
}
