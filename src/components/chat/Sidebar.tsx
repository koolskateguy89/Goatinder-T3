import { api } from "utils/api";
import SidebarChatPreview from "components/chat/SidebarChatPreview";
import NewChatButton from "components/chat/NewChatButton";

export default function Sidebar() {
  // prefetched in getServerSideProps
  // is already sorted by most recent message
  const { data: chatInfos } = api.chat.getAllInfo.useQuery();
  // will need to manage state for ^, and probably use a reducer
  // because we'll need to filter

  return (
    <aside className="px-4">
      {/* TODO: search */}

      <NewChatButton className="btn-primary btn-block btn mb-4" />

      <ol className="space-y-4 overflow-y-auto">
        {chatInfos ? (
          chatInfos.length ? (
            chatInfos.map((chatInfo) => (
              <li key={chatInfo.id}>
                <SidebarChatPreview
                  id={chatInfo.id}
                  name={chatInfo.name}
                  image={chatInfo.image}
                  mostRecentMessage={chatInfo.mostRecentMessage?.content ?? "-"}
                />
              </li>
            ))
          ) : (
            <li>No messages</li>
          )
        ) : (
          <li>Loading...</li>
        )}
      </ol>
    </aside>
  );
}
