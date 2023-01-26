import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { useWindowScroll } from "@mantine/hooks";
import clsx from "clsx";
import { BiArrowToTop } from "react-icons/bi";
import { Configure, useInstantSearch } from "react-instantsearch-hooks-web";

import { authOptions } from "pages/api/auth/[...nextauth]";
import InstantSearchProvider from "components/algolia/InstantSearchProvider";
import NoResultsBoundary from "components/algolia/NoResultsBoundary";
import CustomInstantSearchBox from "components/algolia/CustomInstantSearchBox";
import CustomInfiniteHits from "components/explore/CustomInfiniteHits";
import Refinements from "components/explore/Refinements";

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

function BackToTop() {
  const [scroll] = useWindowScroll();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(scroll.y > 250);
  }, [scroll.y]);

  return (
    <>
      <span id="top" className="absolute top-0" />
      {/* FIXME: moves to the right upon click on <lg screens, it seems the translation is getting undone */}
      <a
        href="#top"
        className={clsx(
          "btn-primary btn fixed bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:btn-circle lg:right-4",
          !visible && "hidden"
        )}
      >
        <BiArrowToTop className="text-2xl lg:hidden" />
        <span className="max-lg:sr-only">Back to top</span>
      </a>
    </>
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

          <CustomInstantSearchBox placeholder="Refine your exploration" />

          <NoResultsBoundary fallback={<NoResults />}>
            <div className="flex flex-col gap-4 max-lg:items-center lg:flex-row">
              <Refinements />

              <CustomInfiniteHits />
            </div>
          </NoResultsBoundary>

          <BackToTop />
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
