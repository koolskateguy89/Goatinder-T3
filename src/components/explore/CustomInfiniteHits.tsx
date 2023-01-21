import { CgSpinner } from "react-icons/cg";
import {
  useInfiniteHits,
  type UseInfiniteHitsProps,
} from "react-instantsearch-hooks-web";

import ShoeHit from "components/search/ShoeHit";
import OnVisible from "components/OnVisible";

type THit = React.ComponentProps<typeof ShoeHit>["hit"];

export default function CustomInfiniteHits(props: UseInfiniteHitsProps<THit>) {
  const { hits, isLastPage, showMore } = useInfiniteHits(props);

  return (
    <div className="space-y-4">
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hits.map((hit) => (
          <li key={hit.objectID}>
            <ShoeHit hit={hit} />
          </li>
        ))}
      </ul>

      {!isLastPage && (
        <OnVisible callback={showMore}>
          <span className="flex justify-center">
            <CgSpinner className="text-4xl motion-safe:animate-spin motion-reduce:hidden" />
            <span className="text-lg motion-safe:sr-only">Loading...</span>
          </span>
        </OnVisible>
      )}
    </div>
  );
}
