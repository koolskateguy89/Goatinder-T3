import clsx from "clsx";
import { MdClose, MdSearch } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";
import {
  type UseSearchBoxProps,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

export type CustomSearchBoxProps = UseSearchBoxProps & {
  placeholder: string;
};

export default function CustomSearchBox({
  placeholder,
  ...searchBoxProps
}: CustomSearchBoxProps) {
  const { status } = useInstantSearch();
  // TODO: might have to use algoliaQuery instead of query once routing is set up, idrk
  const { query: algoliaQuery, refine, clear } = useSearchBox(searchBoxProps);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const query = (
      e.currentTarget.elements.namedItem("query") as HTMLInputElement
    ).value;

    refine(query);
  };

  const loadingOrStalled = status === "loading" || status === "stalled";

  return (
    <form onSubmit={handleSubmit} onReset={clear}>
      <div className="join [&_.btn]:text-2xl">
        <input
          type="search"
          name="query"
          placeholder={placeholder}
          defaultValue={algoliaQuery}
          className="input join-item input-bordered dark:placeholder:opacity-60"
          aria-label="Search"
          required
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
          type="submit"
          title="Search"
          className="btn btn-square btn-primary join-item"
          disabled={loadingOrStalled}
        >
          <MdSearch />
        </button>
        <button
          type="reset"
          title="Reset the search"
          className="btn btn-square btn-secondary join-item"
        >
          <MdClose />
        </button>
      </div>
    </form>
  );
}
