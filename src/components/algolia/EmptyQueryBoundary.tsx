/* eslint-disable react/jsx-no-useless-fragment */
import { useInstantSearch } from "react-instantsearch-hooks-web";

export type EmptyQueryBoundaryProps = {
  fallback: React.ReactNode;
  children: React.ReactNode;
};

/**
 * @see https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-display/react-hooks/#handling-empty-queries
 */
export default function EmptyQueryBoundary({
  fallback,
  children,
}: EmptyQueryBoundaryProps) {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
