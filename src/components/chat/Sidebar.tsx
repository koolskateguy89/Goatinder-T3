import { api } from "utils/api";
import SidebarChatPreview from "./SidebarChatPreview";

export default function Sidebar() {
  // prefetched in getServerSideProps
  // is already sorted by most recent message
  const { data: chatInfos } = api.chat.getAllInfo.useQuery();
  // will need to manage state for ^, and probably use a reducer
  // because we'll need to filter

  return (
    <aside>
      {/* TODO: search */}
      {/* TODO: new chat button (open dialog) */}
      <ol className="space-y-4 overflow-y-auto px-4">
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
            <li>...</li>
          )
        ) : (
          <li>Loading...</li>
        )}
      </ol>
    </aside>
  );
}
