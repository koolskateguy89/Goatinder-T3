import { useEffect, useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { unstable_getServerSession } from "next-auth";
import { useWindowScroll } from "@mantine/hooks";
import clsx from "clsx";
import { BiArrowToTop } from "react-icons/bi";
import { Configure, useInstantSearch } from "react-instantsearch-hooks-web";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { attributesToRetrieve } from "pages/shoes/search";
import InstantSearchProvider from "components/algolia/InstantSearchProvider";
import NoResultsBoundary from "components/algolia/NoResultsBoundary";
import CustomInstantSearchBox from "components/algolia/CustomInstantSearchBox";
import CustomInfiniteHits from "components/explore/CustomInfiniteHits";
import Refinements from "components/explore/Refinements";

const attributesToSnippet = ["designer"];

function NoResults() {
  const { indexUiState } = useInstantSearch();

  return (
    <p>
      No results for <q>{indexUiState.query}</q>.
    </p>
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
      <div
        className={clsx(
          "fixed bottom-4 max-lg:left-1/2 max-lg:-translate-x-1/2 lg:right-4",
          "transition-all ease-in-out",
          !visible && "invisible opacity-0"
        )}
      >
        <a href="#top" className="btn btn-primary max-lg:btn-circle">
          <BiArrowToTop className="text-2xl lg:hidden" />
          <span className="max-lg:sr-only">Back to top</span>
        </a>
      </div>
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
        <main className="container flex flex-col items-center gap-y-4 py-4 px-2 lg:px-12">
          <Configure
            analytics={false}
            filters="product_category:shoes" // only return shoes
            hitsPerPage={12}
            distinct
            attributesToRetrieve={attributesToRetrieve}
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
