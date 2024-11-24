import { useEffect } from "react";
import { useDebouncedState } from "@mantine/hooks";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import type { ChatInfo } from "types/chat";
import { api } from "utils/api";
import SidebarChatPreview from "components/chat/SidebarChatPreview";
import NewChatButton from "components/chat/NewChatButton";

const FILTER_DEBOUNCE_MS = 400;

type SidebarState = {
  filteredChats: ChatInfo[];
};

type SidebarAction =
  | { type: "reset"; payload: ChatInfo[] }
  | { type: "filter"; payload: { all: ChatInfo[]; filter: string } };

// TODO: make this common between sidebar and chats page so page is also filterable
const reducer: ImmerReducer<SidebarState, SidebarAction> = (draft, action) => {
  switch (action.type) {
    case "reset":
      draft.filteredChats = action.payload;
      break;
    case "filter":
      draft.filteredChats = action.payload.all.filter(
        (chat) =>
          chat.name &&
          chat.name.toLowerCase().includes(action.payload.filter.toLowerCase()),
      );
      break;
    default:
      break;
  }
};

/**
 * Displays a list of the user's chats.
 *
 * Also contains a search bar that filters the chats by name (debounced by 400ms).
 */
export default function Sidebar() {
  // prefetched in getServerSideProps
  // is already sorted by most recent message
  const allChatInfoQuery = api.chat.getAllInfo.useQuery();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const chatInfos = allChatInfoQuery.data!;

  const [{ filteredChats }, dispatch] = useImmerReducer<
    SidebarState,
    SidebarAction
  >(reducer, {
    filteredChats: chatInfos,
  });

  const [debouncedFilter, setDebouncedFilter] = useDebouncedState(
    "",
    FILTER_DEBOUNCE_MS,
  );

  // Update the filtered chats when the filter changes
  useEffect(() => {
    if (debouncedFilter) {
      // if there is a filter, filter the chats
      dispatch({
        type: "filter",
        payload: { all: chatInfos, filter: debouncedFilter },
      });
    } else {
      // on empty filter, reset to all chats
      dispatch({ type: "reset", payload: chatInfos });
    }
  }, [dispatch, chatInfos, debouncedFilter]);

  return (
    <aside className="flex h-full flex-col gap-y-4 px-4">
      <input
        type="text"
        placeholder="Search chats"
        onChange={(e) => setDebouncedFilter(e.currentTarget.value)}
        className="input input-bordered"
      />

      <NewChatButton className="btn btn-primary" />

      <div className="relative flex-grow">
        <ol className="absolute inset-0 max-h-full space-y-4 overflow-y-auto pb-4">
          {filteredChats.length ? (
            filteredChats.map((chatInfo) => (
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
          )}
        </ol>
      </div>
    </aside>
  );
}
