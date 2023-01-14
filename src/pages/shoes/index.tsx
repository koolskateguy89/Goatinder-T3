import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import clsx from "clsx";
import { MdClose, MdFavorite } from "react-icons/md";

import { authOptions } from "pages/api/auth/[...nextauth]";
import type { GoatShoe } from "types/goat-shoe";

import {
  // basics
  Configure,
  SearchBox,
  // refinements
  RefinementList,
  ClearRefinements,
  Menu, // for only picking 1 option, don't think will use
  // results
  Hits,
  InfiniteHits, // TODO: make another version of this page that uses this instead of pagination
  Highlight,
  Snippet, // not sure if gonna use
  // pagination
  Pagination,
  HitsPerPage, // lets use choose no of hits per page
  // metadata
  PoweredBy,
  // sorting
  SortBy, // FIXME?: isn't working, not sure if can fix
  // hooks
  useInstantSearch,
} from "react-instantsearch-hooks-web";

import type { AlgoliaHit } from "types/algolia";
import EmptyQueryBoundary from "components/algolia/EmptyQueryBoundary";
import NoResultsBoundary from "components/algolia/NoResultsBoundary";
import CustomSearchBox from "components/search/CustomSearchBox";
import ThemedPoweredBy from "components/search/ThemedPoweredBy";

const attributesToRetrieve = [
  "name",
  "brand_name",
  "search_sku",
  "retail_price_cents_gbp",
  "grid_picture_url",
  "designer",
  "story_html",
] as const;

const attributesToHighlight = ["name"];

const attributesToSnippet = ["designer"];

type HitShoe = AlgoliaHit<
  Pick<GoatShoe, (typeof attributesToRetrieve)[number]>
>;

const ShoeHit = ({ hit }: { hit: HitShoe }) => {
  return (
    // using negative margins for image & body to get rid of the spacing in
    // the image on smaller screens
    <article className="card h-full overflow-hidden ring-2 ring-primary">
      <figure className="relative mx-auto h-60 w-60 max-md:-mt-10 md:h-60 md:w-60">
        <Image src={hit.grid_picture_url} alt={hit.name} fill sizes="15rem" />
      </figure>
      <div className="card-body items-center text-center max-md:-mt-10">
        <h2 className="link-hover link-primary link card-title">
          <Link href={`/shoes/${hit.search_sku}`}>
            {/* {hit.name} */}
            {/* TODO: not sure if actually want Highlight */}
            <Highlight
              hit={hit}
              attribute="name"
              classNames={{
                root: "",
                // highlighted: "bg-secondary text-secondary-content",
              }}
            />
          </Link>
        </h2>
        {/* TODO: toolip on hover displaying the story */}
        {/* TODO: change link color back to primary */}
        <div className="group/name relative">
          <h2 className="link-hover link-secondary link card-title">
            <Link href={`/shoes/${hit.search_sku}`}>
              {/* TODO: not sure if actually want Highlight */}
              <Highlight
                hit={hit}
                attribute="name"
                classNames={{
                  root: "",
                  // highlighted: "bg-secondary text-secondary-content",
                }}
              />
            </Link>
          </h2>
          {hit.story_html && (
            <div
              role="tooltip"
              // using clsx to logically group classnames because prettier basically scrambles them
              className={clsx(
                "absolute left-1/2 top-full z-10 -translate-x-1/2",
                // max-h-[calc(1.5rem*4.25)]
                "rounded-box mx-2 w-[theme(spacing.72)]",
                "border-4 border-base-100 bg-neutral p-2 text-base",
                // need pointer-events-none to stop the hover from triggering
                // hovering over the title will keep it open
                "pointer-events-none group-hover/name:pointer-events-auto",
                // https://tailwindcss.com/blog/multi-line-truncation-with-tailwindcss-line-clamp
                "line-clamp-4",
                "opacity-0 transition-opacity delay-100 group-hover/name:opacity-100 group-hover/name:delay-700"
              )}
            >
              {/* <Snippet hit={hit} attribute="story_html" /> */}
              {hit.story_html.replace("<p>", "").replace("</p>", "")}
            </div>
          )}
        </div>

        {hit.designer && (
          <p>
            Designer: <Snippet hit={hit} attribute="designer" />
          </p>
        )}

        <p className="text-sm text-base-content/60">{hit.brand_name}</p>

        <p>search_sku: {hit.search_sku}</p>

        <p>
          Retail price:{" "}
          <span className="text-accent">
            £{hit.retail_price_cents_gbp * 0.01}
          </span>
        </p>
        <div className="card-actions [&>*]:text-lg">
          <button type="button" className="btn-error btn">
            <MdClose />
          </button>
          <button type="button" className="btn-success btn">
            <MdFavorite />
          </button>
        </div>
      </div>
    </article>
  );
};

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
 * TODO: change nav links to Search
 * TODO: change names from Shoes* to Search*
 */
const ShoesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Search - goaTinder</title>
        <meta name="description" content="llo" />
      </Head>
      <main className="mx-12 mt-3 flex flex-col items-center gap-y-4">
        <Configure
          analytics={false}
          filters="product_category:shoes" // only return shoes
          distinct
          attributesToRetrieve={attributesToRetrieve}
          attributesToHighlight={attributesToHighlight}
          attributesToSnippet={attributesToSnippet}
        />

        <ThemedPoweredBy />

        <CustomSearchBox />

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
                      { label: "24 shoes per page", value: 24, default: true },
                      { label: "48 shoes per page", value: 48 },
                      { label: "96 shoes per page", value: 96 },
                    ]}
                    classNames={{
                      select: "select select-bordered select-secondary w-full",
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
                      select: "select select-bordered select-secondary w-full",
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

                  <RefinementList
                    attribute="search_sku"
                    classNames={{
                      item: "form-control",
                      noRefinementRoot: "w-10 h-10 bg-red-500",
                      label: "flex flex-row items-center",
                      labelText: "ml-1 label",
                      count: "badge badge-secondary ml-auto",
                      checkbox: "checkbox checkbox-secondary checkbox-sm",
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
    </>
  );
};

export default ShoesPage;

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
