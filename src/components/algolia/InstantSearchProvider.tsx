import algoliasearch from "algoliasearch/lite";
import { InstantSearch } from "react-instantsearch-hooks-web";

import { env } from "env/client.mjs";

// TODO: routing thingy to change URL
// algolia instant search: https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/react-hooks/
const searchClient = algoliasearch(
  env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  env.NEXT_PUBLIC_ALGOLIA_API_KEY
);

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
