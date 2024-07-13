/* eslint-disable react/jsx-no-useless-fragment */
import { useInstantSearch } from "react-instantsearch-hooks-web";

export type NoResultsBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

/**
 * @see https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react-hooks/#handling-no-results
 */
export default function NoResultsBoundary({
  fallback,
  children,
}: NoResultsBoundaryProps) {
  const { results } = useInstantSearch();

  // The `__isArtificial` flag makes sure not to display the No Results message
  // when no hits have been returned yet.
  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
}

export function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <p>
      No results for <q>{indexUiState.query}</q>.
    </p>
  );
}
