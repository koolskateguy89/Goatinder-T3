import Message, { type MessageProps } from "./Message";

export type MessagesProps = {
  messages: Omit<MessageProps, "onDelete">[];
  onDelete: (messageId: string) => void;
};

// TODO: make scrollable
// TODO: remove example
export default function Messages({ messages, onDelete }: MessagesProps) {
  return (
    <ol>
      <li>
        <Message
          id="aaaaaaaaaaaaaaaaaaaa"
          sender={{
            id: "aa",
            image: "https://avatars.githubusercontent.com/u/61889617?v=4",
            name: "Bob",
          }}
          content="lol"
          sentAt={new Date(2023, 2, 6, 12, 30, 39)}
          onDelete={onDelete}
        />
      </li>
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
