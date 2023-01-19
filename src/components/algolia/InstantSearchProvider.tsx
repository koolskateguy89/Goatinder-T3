import { InstantSearch } from "react-instantsearch-hooks-web";

import { searchClient } from "utils/algolia";

// TODO: routing thingy to change URL
// algolia instant search: https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react-hooks/
// might have to instantiate client here instead of in utils/algolia

export type InstantSearchProviderProps = {
  children: React.ReactNode;
};

export default function InstantSearchProvider({
  children,
}: InstantSearchProviderProps) {
  return (
    <InstantSearch searchClient={searchClient} indexName="product_variants_v2">
      {children}
    </InstantSearch>
  );
}
