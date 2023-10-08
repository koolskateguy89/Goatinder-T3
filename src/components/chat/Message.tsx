import { Fragment } from "react";
import { useSession } from "next-auth/react";
import type { GroupChatMessage, PrivateMessage, User } from "@prisma/client";
import { Menu, Transition } from "@headlessui/react";
import clsx from "clsx";

import { api } from "utils/api";
import { useChatInfo } from "store/chat/info";
import Avatar from "components/Avatar";

type CommonMessage = GroupChatMessage | PrivateMessage;

// /images/stock/photo-1534528741775-53994a69daeb.jpg

const ONE_DAY_MS = 1000 * 60 * 60 * 24;

function formatDate(date: Date): string {
  const now = Date.now();

  if (now - date.getTime() > ONE_DAY_MS)
    return date.toLocaleDateString(undefined, {
      minute: "numeric",
      hour: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });

  return date.toLocaleTimeString(undefined, {
    minute: "numeric",
    hour: "numeric",
  });
}

interface MessageContentProps extends Pick<CommonMessage, "content"> {
  canDelete: boolean;
  onDelete(): void;
}

function MessageContent({ content, canDelete, onDelete }: MessageContentProps) {
  return !canDelete ? (
    <div className="chat-bubble">{content}</div>
  ) : (
    <Menu as="div" className="relative flex">
      <Menu.Button className="chat-bubble">{content}</Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="menu rounded-box absolute right-0 top-full z-10 mt-1 w-52 origin-top-right bg-base-200 p-2 shadow"
        >
          {canDelete && (
            <Menu.Item as="li">
              {({ close }) => (
                <button
                  type="button"
                  onClick={() => {
                    onDelete();
                    close();
                  }}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
          )}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export interface MessageProps
  extends Pick<CommonMessage, "id" | "content" | "sentAt"> {
  sender: Pick<User, "id" | "name" | "image">;
  onDelete: (messageId: string) => void;
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

  // TODO: check if user is gc creator
  const canDelete = isMyMessage || false;

  const deleteMut = api.chat.deleteMessage.useMutation();

  const deleteMessage = () => {
    deleteMut.mutate({ groupChat, id });
    onDelete(id);
  };

  return (
    <article className={clsx("chat", isMyMessage ? "chat-end" : "chat-start")}>
      {/* TODO?: right click avatar -> menu -> open profile, other options - maybe not */}
      <Avatar
        image={sender.image}
        name={sender.name}
        className="chat-image [&>*]:w-10"
        imageProps={{
          sizes: "2.5rem",
        }}
      />
      <div className="chat-header space-x-1">
        <span>{sender.name}</span>
        <time dateTime={sentAt.toISOString()} className="text-xs opacity-50">
          {formatDate(sentAt)}
        </time>
      </div>
      <MessageContent
        content={content}
        canDelete={canDelete}
        onDelete={deleteMessage}
      />
      {/* TODO: not sure about if we want to show status (seen etc.) */}
      <div className="chat-footer opacity-50">Delivered</div>
    </article>
  );
}
