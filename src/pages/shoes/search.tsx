import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import {
  Configure,
  Hits,
  Pagination,
  useInstantSearch,
} from "react-instantsearch-hooks-web";

import { authOptions } from "pages/api/auth/[...nextauth]";
import InstantSearchProvider from "components/algolia/InstantSearchProvider";
import EmptyQueryBoundary from "components/algolia/EmptyQueryBoundary";
import NoResultsBoundary from "components/algolia/NoResultsBoundary";
import CustomSearchBox from "components/algolia/CustomSearchBox";
import Refinements from "components/search/Refinements";
import ShoeHit from "components/search/ShoeHit";

export const attributesToRetrieve = [
  "name",
  "brand_name",
  "objectID",
  "retail_price_cents_gbp",
  "grid_picture_url",
  "designer",
  "story_html",
] as const;

const attributesToSnippet = ["designer"];

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <p className="self-center">
      No results for <q>{indexUiState.query}</q>.
    </p>
  );
}

/**
 * Need to make like a shoes showcase page.
 * Maybe show the most liked shoes?
 * Or recommended?
 *
 * TODO?: Because there are going to be quite a few search/explore-like shoes pages, in NavTabs make a dropdown
 *
 * Need to make an actual tinder page that shows a random shoe they haven't liked/disliked
 *
 * This page will be like a search page where they can find any shoe they want basically.
 */
const ShoesSearchPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search - goaTinder</title>
        <meta name="description" content="Search for shoes" />
      </Head>
      <InstantSearchProvider>
        <main className="container flex flex-col items-center gap-y-4 px-12 py-4">
          <Configure
            analytics={false}
            filters="product_category:shoes" // only return shoes
            distinct
            attributesToRetrieve={attributesToRetrieve}
            attributesToSnippet={attributesToSnippet}
          />

          <CustomSearchBox placeholder="Start typing to search" />

          <div className="flex w-full flex-col items-center gap-y-4">
            <Pagination
              classNames={{
                list: "btn-group",
                item: "btn active:btn-secondary [&>a]:active:btn-secondary p-0 border-0",
                // workaround to essentially make the link the button
                link: "btn bg-transparent border-transparent",
                disabledItem: "btn-disabled",
                selectedItem: "btn-secondary [&>a]:btn-secondary",
                noRefinementRoot:
                  "[&_.btn-secondary]:!bg-neutral [&_.btn-secondary>a]:btn",
              }}
            />

            {/* it still makes the request :/ but ntd
            TODO: have a look at https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/react-hooks/
             */}
            <EmptyQueryBoundary fallback={undefined}>
              <NoResultsBoundary fallback={<NoResults />}>
                <div className="flex flex-col gap-4 max-lg:items-center lg:flex-row">
                  <Refinements />

                  <Hits
                    hitComponent={ShoeHit}
                    classNames={{
                      list: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
                    }}
                  />
                </div>
              </NoResultsBoundary>
            </EmptyQueryBoundary>
          </div>
        </main>
      </InstantSearchProvider>
    </>
  );
};

export default ShoesSearchPage;

// TODO: getServerSideProps with initialData if query in url
// look at https://www.algolia.com/doc/guides/building-search-ui/widgets/customize-an-existing-widget/react-hooks/#providing-an-initial-state
export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // TODO: request db for users likes and disikes
  // so can show that user has already liked/disliked shoe

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
