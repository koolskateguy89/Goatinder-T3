import { useChatInfo } from "store/chat/info";
import Message, { type MessageProps } from "./Message";

export type MessagesProps = {
  messages: Omit<MessageProps, "groupChat" | "onDelete">[];
  onDelete: (messageId: string) => void;
};

export default function Messages({ messages, onDelete }: MessagesProps) {
  const { groupChat } = useChatInfo();

  return (
    <ol className="absolute inset-0 max-h-full overflow-y-auto">
      {messages.length ? (
        messages.map((message) => (
          <li key={message.id}>
            <Message {...message} groupChat={groupChat} onDelete={onDelete} />
          </li>
        ))
      ) : (
        <li className="mx-auto w-fit">No messages</li>
      )}
    </ol>
  );
}
