import { CgSpinner } from "react-icons/cg";
import {
  useInfiniteHits,
  type UseInfiniteHitsProps,
} from "react-instantsearch-hooks-web";

import ExploreShoeHit from "components/search/ShoeHit";

type THit = React.ComponentProps<typeof ExploreShoeHit>["hit"];

export default function CustomInfiniteHits(props: UseInfiniteHitsProps<THit>) {
  const { hits, isLastPage, showMore } = useInfiniteHits(props);

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hits.map((hit) => (
          <li key={hit.objectID}>
            <ExploreShoeHit hit={hit} />
          </li>
        ))}
      </ul>

      {!isLastPage && (
        // TODO: basically once this spinner is visible, load more
        // NOTE: is only clickable for debugging purposes
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions
        <span className="flex cursor-pointer justify-center" onClick={showMore}>
          {/* isLastPage */}
          <CgSpinner className="hidden text-2xl motion-safe:inline motion-safe:animate-spin" />
          <span className="hidden text-lg motion-reduce:inline">
            Loading...
          </span>
        </span>
      )}
    </div>
  );
}
