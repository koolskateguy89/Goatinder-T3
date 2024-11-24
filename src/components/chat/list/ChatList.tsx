import { useEffect } from "react";
import type { User } from "@prisma/client";
import { useDebouncedState } from "@mantine/hooks";
import { type ImmerReducer, useImmerReducer } from "use-immer";

import type { ChatInfo } from "types/chat";
import { api } from "utils/api";
import clsx from "clsx";

const DEFAULT_FILTER_DEBOUNCE_MS = 400;

type ChatListState = {
  filteredChats: ChatInfo[];
};

type ChatListAction =
  | { type: "reset"; payload: ChatInfo[] }
  | { type: "filter"; payload: { all: ChatInfo[]; filter: string } };

const reducer: ImmerReducer<ChatListState, ChatListAction> = (
  draft,
  action,
) => {
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

export type ChatListComponentProps = Pick<User, "name" | "image"> & {
  id: string;
  mostRecentMessage: React.ReactNode;
};

export interface ChatListProps {
  /**
   * Will display loading state if `undefined`, as described by `loadingMessage`.
   */
  chats: ChatInfo[] | undefined;
  component: React.ComponentType<ChatListComponentProps>;

  /**
   * Default 400ms
   */
  debounceMs?: number;

  loadingMessage?: React.ReactNode;
  noChatsMessage?: React.ReactNode;
  noMessageInChatMessage?: React.ReactNode;

  listClassName?: string;

  /**
   * Whether the list should not grow in height, and instead scroll.
   *
   * If `true`, the parent needs to be a flex container.
   */
  scroll?: boolean;
}

/**
 * Displays a list of the user's chats.
 *
 * Also contains a search bar that filters the chats by name (debounced).
 *
 * @param chats Should be sorted by most recent message first
 * @param scroll If `true`, the parent needs to be a flex container
 */
export default function ChatList({
  chats,
  component: ChatListComponent,
  debounceMs = DEFAULT_FILTER_DEBOUNCE_MS,
  loadingMessage = "Loading...",
  noChatsMessage = "No chats, make some friends",
  noMessageInChatMessage,
  listClassName,
  scroll = false,
}: ChatListProps) {
  // // should be prefetched in getServerSideProps
  // // is already sorted by most recent message
  // const allChatInfoQuery = api.chat.getAllInfo.useQuery();
  // // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  // const chatInfos = allChatInfoQuery.data!;

  const [{ filteredChats }, dispatch] = useImmerReducer<
    ChatListState,
    ChatListAction
  >(reducer, {
    filteredChats: chats ?? [],
  });

  const [debouncedFilter, setDebouncedFilter] = useDebouncedState(
    "",
    debounceMs,
  );

  // Initialise the filtered chats when the chats are loaded
  useEffect(() => {
    if (chats) {
      dispatch({ type: "reset", payload: chats });
    }
  }, [dispatch, chats]);

  // Update the filtered chats when the filter changes
  useEffect(() => {
    if (!chats) return;

    if (debouncedFilter) {
      // if there is a filter, filter the chats
      dispatch({
        type: "filter",
        payload: { all: chats, filter: debouncedFilter },
      });
    } else {
      // on empty filter, reset to all chats
      dispatch({ type: "reset", payload: chats });
    }
  }, [dispatch, chats, debouncedFilter]);

  return (
    <>
      <input
        type="text"
        placeholder="Search chats"
        onChange={(e) => setDebouncedFilter(e.currentTarget.value)}
        className="input input-bordered w-full"
        disabled={!chats}
      />

      <div className="relative flex-grow">
        <ol
          className={clsx(
            "absolute inset-0 space-y-4",
            scroll && "overflow-y-auto",
            listClassName,
          )}
        >
          {chats ? (
            filteredChats.length ? (
              filteredChats.map((chatInfo) => (
                <li key={chatInfo.id}>
                  <ChatListComponent
                    id={chatInfo.id}
                    name={chatInfo.name}
                    image={chatInfo.image}
                    mostRecentMessage={
                      chatInfo.mostRecentMessage?.content ??
                      noMessageInChatMessage
                    }
                  />
                </li>
              ))
            ) : (
              <li>{noChatsMessage}</li>
            )
          ) : (
            <li className="flex content-center justify-center">
              {loadingMessage}
            </li>
          )}
        </ol>
      </div>
    </>
  );
}
