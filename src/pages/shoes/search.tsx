import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "pages/api/auth/[...nextauth]";

import {
  // basics
  Configure,
  // SearchBox,
  // refinements
  RefinementList,
  ClearRefinements,
  // Menu, // for only picking 1 option, don't think will use
  // results
  Hits,
  // InfiniteHits, // infinite scroll
  // Highlight,
  // Snippet, // not sure if gonna use
  // pagination
  Pagination,
  HitsPerPage, // lets use choose no of hits per page
  // metadata
  // PoweredBy,
  // sorting
  SortBy, // FIXME?: isn't working, not sure if can fix
  // hooks
  useInstantSearch,
} from "react-instantsearch-hooks-web";

import InstantSearchProvider from "components/algolia/InstantSearchProvider";
import EmptyQueryBoundary from "components/algolia/EmptyQueryBoundary";
import NoResultsBoundary from "components/algolia/NoResultsBoundary";
import CustomSearchBox from "components/algolia/CustomSearchBox";
import ThemedPoweredBy from "components/search/ThemedPoweredBy";
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

const attributesToHighlight = ["name"];

const attributesToSnippet = ["designer"];

function NoQuery() {
  return <div className="flex-grow">Type something</div>;
}

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

/*
would like to have like an infinite scolling functionality, where
the page will be increased by 1 when the user scrolls to the bottom
and make a new request for next page of results
*/

/**
 * Need to make like a shoes showcase page.
 * Maybe show the most liked shoes?
 * Or recommended?
 *
 * Need to make a shoes expore page.
 * Very similar to this but with infinite scroll.
 *
 * Need to make an actual tinder page that shows a random shoe they haven't liked/disliked
 *
 * TODO: look at using AutoComplete in navbar (lg screens only)
 * https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/autocomplete/react-hooks/
 *
 * This page will be like a search page where they can find any shoe they want basically.
 *
 * TODO?: tbh this could just be /search not /shoes/search
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
            attributesToHighlight={attributesToHighlight}
            attributesToSnippet={attributesToSnippet}
          />

          <ThemedPoweredBy />

          <CustomSearchBox placeholder="Start typing to search" />

          <div className="flex w-full flex-col gap-y-4">
            <Pagination
              classNames={{
                root: "flex justify-center",
                list: "btn-group",
                item: "btn active:btn-secondary [&>a]:active:btn-secondary p-0 border-0", // active:btn-secondary p-0
                // workaround to essentially make the link the button
                link: "btn bg-transparent border-transparent",
                disabledItem: "btn-disabled",
                selectedItem: "btn-secondary [&>a]:btn-secondary",
                noRefinementRoot:
                  "[&_.btn-secondary]:!bg-neutral [&_.btn-secondary>a]:btn",
              }}
            />

            {/* it still makes the request :/
            have a look at https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/react-hooks/
             */}
            <EmptyQueryBoundary fallback={<NoQuery />}>
              <NoResultsBoundary fallback={<NoResults />}>
                <div className="flex flex-row gap-x-4">
                  {/*
                TODO:
                aside hidden on mobile
                make it a drawer?
                */}
                  <aside className="w-1/4 space-y-4">
                    <HitsPerPage
                      items={[
                        { label: "1 shoe per page", value: 1 },
                        { label: "12 shoes per page", value: 12 },
                        {
                          label: "24 shoes per page",
                          value: 24,
                          default: true,
                        },
                        { label: "48 shoes per page", value: 48 },
                        { label: "96 shoes per page", value: 96 },
                      ]}
                      classNames={{
                        select:
                          "select select-bordered select-secondary w-full",
                      }}
                    />

                    {/* isn't working :( */}
                    <SortBy
                      items={[
                        {
                          // don't think this is actually doing anything rn
                          label: "Sort by retail price",
                          value: "retail_price_cents_gbp",
                        },
                        // { // gives error brand_name isn't an index
                        //   label: "Sort by brand name,
                        //   value: "brand_name",
                        // },
                      ]}
                      classNames={{
                        select:
                          "select select-bordered select-secondary w-full",
                      }}
                    />

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
                        label: "flex flex-row items-center",
                        labelText: "ml-1 label",
                        count: "badge badge-secondary ml-auto",
                        checkbox: "checkbox checkbox-secondary checkbox-sm",
                      }}
                    />
                  </aside>
                  <Hits
                    hitComponent={ShoeHit}
                    classNames={{
                      list: "grid grid-cols-1 grid-rows-[auto] gap-4 sm:grid-cols-2 lg:grid-cols-3",
                      // TODO: use component instead of classes for empty
                      emptyRoot:
                        "relative h-80 w-80 bg-gradient-to-br from-primary to-secondary before:absolute before:text-white before:content-['empty_results!']",
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
