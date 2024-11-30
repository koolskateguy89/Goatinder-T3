import { useEffect } from "react";
import { useDebouncedState } from "@mantine/hooks";
import { MdClose } from "react-icons/md";
import {
  type UseSearchBoxProps,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

import InputLoadingSpinner from "components/common/InputLoadingSpinner";

export type CustomSearchBoxProps = UseSearchBoxProps & {
  placeholder: string;
  debounceDelay?: number;
};

export default function CustomInstantSearchBox({
  placeholder,
  debounceDelay = 200,
  ...searchBoxProps
}: CustomSearchBoxProps) {
  const { status } = useInstantSearch();
  const { query, refine, clear } = useSearchBox(searchBoxProps);

  const [debouncedQuery, setDebouncedQuery] = useDebouncedState(
    query,
    debounceDelay,
  );

  useEffect(() => {
    refine(debouncedQuery);
  }, [debouncedQuery, refine]);

  const loadingOrStalled = status === "loading" || status === "stalled";

  return (
    <form onSubmit={(e) => e.preventDefault()} onReset={clear}>
      <div className="join [&>.btn]:text-2xl">
        <input
          type="search"
          placeholder={placeholder}
          defaultValue={query}
          onChange={(event) => setDebouncedQuery(event.currentTarget.value)}
          className="input join-item input-bordered dark:placeholder:opacity-60"
          aria-label="Search"
        />

        <InputLoadingSpinner loading={loadingOrStalled} className="-left-4.5" />

        <button
          type="reset"
          title="Reset refinement"
          className="btn btn-square btn-secondary join-item"
        >
          <MdClose />
        </button>
      </div>
    </form>
  );
}
