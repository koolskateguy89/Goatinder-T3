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

// TODO: debounce the refine function
export default function CustomInstantSearchBox({
  placeholder,
  debounceDelay = 0, // TODO: use this
  ...searchBoxProps
}: CustomSearchBoxProps) {
  // 'idle' | 'loading' | 'stalled' | 'error'
  const { status } = useInstantSearch();
  const { query, refine, clear } = useSearchBox(searchBoxProps);

  // could switch to using an uncontrolled input
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    refine(query);
  };

  const loadingOrStalled = status === "loading" || status === "stalled";

  return (
    <form onSubmit={handleSubmit} onReset={clear}>
      status = {JSON.stringify(status)}
      <div className="input-group [&_.btn]:text-2xl">
        <input
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(event) => refine(event.currentTarget.value)}
          aria-label="Search"
          className="input-bordered input dark:placeholder:opacity-60"
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
          title="Reset the search"
          className="btn-secondary btn-square btn"
        >
          <MdClose />
        </button>
      </div>
    </form>
  );
}
