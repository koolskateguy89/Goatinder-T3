import Message, { type MessageProps } from "components/chat/Message";

export type MessagesProps = {
  messages: Omit<MessageProps, "groupChat" | "onDelete">[];
  onDelete: (messageId: string) => void;
};

export default function Messages({ messages, onDelete }: MessagesProps) {
  return (
    <ol className="absolute inset-0 max-h-full overflow-y-auto">
      {messages.length ? (
        messages.map((message) => (
          <li key={message.id}>
            <Message {...message} onDelete={onDelete} />
          </li>
        ))
      ) : (
        <li className="mx-auto w-fit">No messages</li>
      )}
    </ol>
  );
}
