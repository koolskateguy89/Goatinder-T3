import { useState } from "react";
import clsx from "clsx";
import { MdClose, MdSearch } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import {
  type UseSearchBoxProps,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

/*
would like it to look pretty much the same
apart from the reset button
reset button needs to be red text, maybe that fades into view?
idk
but don't think want it to visually be an actual button yk
*/

export type CustomSearchBoxProps = UseSearchBoxProps;

export default function CustomSearchBox(props: UseSearchBoxProps) {
  // 'idle' | 'loading' | 'stalled' | 'error'
  const { status } = useInstantSearch();
  // TODO: might have to use algoliaQuery instead of query once routing is set up, idrk
  const { query: algoliaQuery, refine, clear } = useSearchBox(props);

  const [query, setQuery] = useState(algoliaQuery);

  // could switch to using an uncontrolled input
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    refine(query);
  };

  const loadingOrStalled = status === "loading" || status === "stalled";

  return (
    <>
      status = {JSON.stringify(status)}
      <form onSubmit={handleSubmit} onReset={clear}>
        <div className="input-group [&_.btn]:text-2xl">
          <input
            type="search"
            placeholder="Start typing to explore"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            // onChange={(event) => refine(event.currentTarget.value)}
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
            {/* TODO: using spacing 4.5 once done in tailwind config */}
            <div className="absolute left-[calc(-1*(theme(spacing.4)+theme(spacing[0.5])))] translate-y-full">
              <CgSpinner className="motion-safe:animate-spin" />
            </div>
          </div>

          <button
            type="submit"
            title="Search"
            className="btn-primary btn-square btn"
            disabled={loadingOrStalled}
          >
            <MdSearch />
          </button>
          <button
            type="reset"
            title="Reset the search"
            className="btn-secondary btn-square btn"
          >
            <MdClose />
          </button>
        </div>
      </form>
    </>
  );
}
