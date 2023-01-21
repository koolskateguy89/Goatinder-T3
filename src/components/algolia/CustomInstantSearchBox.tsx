import { useEffect } from "react";
import { useDebouncedState } from "@mantine/hooks";
import clsx from "clsx";
import { MdClose } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import {
  type UseSearchBoxProps,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

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
    debounceDelay
  );

  useEffect(() => {
    refine(debouncedQuery);
  }, [debouncedQuery, refine]);

  const loadingOrStalled = status === "loading" || status === "stalled";

  return (
    <form onSubmit={(e) => e.preventDefault()} onReset={clear}>
      <div className="input-group [&>.btn]:text-2xl">
        <input
          type="search"
          placeholder={placeholder}
          defaultValue={query}
          onChange={(event) => setDebouncedQuery(event.currentTarget.value)}
          className="input-bordered input dark:placeholder:opacity-60"
          aria-label="Search"
        />

        {/* can't use before/after on input so using additional markup */}
        <div
          className={clsx(
            "relative opacity-0 transition-opacity",
            loadingOrStalled && "motion-safe:opacity-100"
          )}
          aria-hidden
        >
          <div className="absolute -left-4.5 translate-y-full">
            <CgSpinner className="motion-safe:animate-spin" />
          </div>
        </div>

        <button
          type="reset"
          title="Reset refinement"
          className="btn-secondary btn-square btn"
        >
          <MdClose />
        </button>
      </div>
    </form>
  );
}
