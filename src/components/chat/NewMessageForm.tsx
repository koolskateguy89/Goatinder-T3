import clsx from "clsx";
import { useState } from "react";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";
import { MdSend } from "react-icons/md";

import { api, type RouterOutputs } from "utils/api";
import { useChatInfo } from "store/chat/info";

type MessageType = RouterOutputs["chat"]["messagesById"]["messages"][number];

export type NewMessageFormProps = {
  onMessageSent: (message: MessageType) => void;
};

export default function NewMessageForm({ onMessageSent }: NewMessageFormProps) {
  const { groupChat, id } = useChatInfo();

  const [content, setContent] = useState("");

  const sendPrivateMessageMut = api.chat.sendPrivateMessage.useMutation();
  const sendGroupChatMessageMut = api.chat.sendGroupChatMessage.useMutation();

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) return toast.error("Message cannot be empty");

    function send() {
      if (groupChat) {
        return sendGroupChatMessageMut.mutateAsync({
          content: trimmedContent,
          groupChatId: id,
        });
      }
      return sendPrivateMessageMut.mutateAsync({
        content: trimmedContent,
        receiverId: id,
      });
    }

    const message = await send();

    setContent("");
    onMessageSent(message);
  };

  const { isLoading } = groupChat
    ? sendGroupChatMessageMut
    : sendPrivateMessageMut;

  return (
    <form onSubmit={sendMessage} className="mt-2 flex items-center gap-x-2">
      <input
        type="text"
        placeholder="Type here"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input-bordered input w-full dark:placeholder:opacity-70"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="btn-primary btn-circle btn text-lg"
        aria-label="Send message"
        disabled={content.trim().length === 0 || isLoading}
      >
        <CgSpinner
          className={clsx(
            "motion-safe:animate-spin motion-reduce:hidden",
            !isLoading && "hidden"
          )}
        />
        <MdSend className={clsx(isLoading && "motion-safe:hidden")} />
      </button>
    </form>
  );
}
