import { api } from "utils/api";
import SidebarChatPreview from "components/chat/SidebarChatPreview";
import NewChatButton from "components/chat/NewChatButton";
import ChatList from "./list/ChatList";

export default function Sidebar() {
  // prefetched in getServerSideProps
  // is already sorted by most recent message
  const { data: chatInfos } = api.chat.getAllInfo.useQuery();

  return (
    <aside className="flex h-full flex-col gap-y-4 px-4">
      <NewChatButton className="btn btn-primary" />

      <ChatList
        chats={chatInfos}
        component={SidebarChatPreview}
        noChatsMessage="No messages"
        listClassName="pb-4"
        scroll
      />
    </aside>
  );
}
