import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import {
  Configure,
  RefinementList,
  ClearRefinements,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

import { authOptions } from "pages/api/auth/[...nextauth]";
import InstantSearchProvider from "components/algolia/InstantSearchProvider";
import NoResultsBoundary from "components/algolia/NoResultsBoundary";
import ThemedPoweredBy from "components/search/ThemedPoweredBy";
import CustomInstantSearchBox from "components/algolia/CustomInstantSearchBox";
import CustomInfiniteHits from "components/explore/CustomInfiniteHits";

export const attributesToRetrieve = [
  "name",
  "brand_name",
  "objectID",
  "retail_price_cents_gbp",
  "grid_picture_url",
  "designer",
  "story_html",
] as const;

const attributesToHighlight = ["name"];

const attributesToSnippet = ["designer"];

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <div>
      <p>
        No results for <q>{indexUiState.query}</q>.
      </p>
    </div>
  );
}

/**
 * Very similar to search page but with infinite scroll and shows shoes even
 * with no search query.
 */
const ExplorePage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Explore - goaTinder</title>
        <meta name="description" content="llo" />
      </Head>
      <InstantSearchProvider>
        <main className="container flex flex-col items-center gap-y-4 px-12 py-4">
          <Configure
            analytics={false}
            filters="product_category:shoes" // only return shoes
            hitsPerPage={12}
            distinct
            attributesToRetrieve={attributesToRetrieve}
            attributesToHighlight={attributesToHighlight}
            attributesToSnippet={attributesToSnippet}
          />

          <ThemedPoweredBy />

          {/* TODO?: make search box sticky to top/scroll only in infiniteHits */}
          <CustomInstantSearchBox placeholder="Refine your exploration" />

          <NoResultsBoundary fallback={<NoResults />}>
            <div className="flex gap-x-4">
              {/* TODO: aside hidden on mobile, make it a drawer? */}
              <aside className="w-1/4 space-y-4">
                <ClearRefinements
                  classNames={{
                    button: "btn btn-secondary btn-block normal-case",
                    disabledButton: "btn-disabled",
                  }}
                  translations={{
                    resetButtonText: "Clear all filters",
                  }}
                />

                {/* TODO: make own UI that each RefinementList is collapsible, if possible */}
                <RefinementList
                  attribute="brand_name"
                  classNames={{
                    item: "form-control",
                    label: "flex items-center",
                    labelText: "ml-1 label",
                    count: "badge badge-secondary ml-auto",
                    checkbox: "checkbox checkbox-secondary checkbox-sm",
                  }}
                />
              </aside>

              <CustomInfiniteHits />
            </div>
          </NoResultsBoundary>
        </main>
      </InstantSearchProvider>
    </>
  );
};

export default ExplorePage;

export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
