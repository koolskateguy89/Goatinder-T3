import { useState } from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";

import { api } from "utils/api";
import type { GoatShoe } from "types/goat-shoe";

const Shoe = ({ shoe }: { shoe: GoatShoe }) => {
  return (
    <div className="flex flex-col rounded-2xl border-4 border-solid border-white/10 p-3 text-gray-500 dark:text-gray-300">
      <Image
        src={shoe.grid_picture_url}
        alt={shoe.name}
        width={300}
        height={300}
      />
      <div className="flex flex-col gap-2">
        {/* TODO: fix wrapping */}
        <Link
          href={`/shoes/${shoe.search_sku}`}
          className="max-w-full break-all text-lg font-bold"
        >
          {shoe.name}
        </Link>
        <p className="max-w-full break-all text-lg font-bold">{shoe.name}</p>
        <p className="text-sm font-bold">{shoe.brand_name}</p>
        <p className="text-lg font-bold">{shoe.retail_price_cents_gbp}</p>
      </div>
    </div>
  );
};

const ShoesSection = () => {
  // TODO: set query & filters, use debounced input for query
  // not sure about filters, maybe a dropdown? or switches?
  const [query, setQuery] = useState("yeezy");
  const [filters, setFilters] = useState(null);
  const [page, setPage] = useState(0); // or 0?

  const shoes = api.goat.search.useQuery({
    query,
    page,
    // filters: null,
  });

  if (shoes.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-2">
      {shoes.data?.map((shoe) => (
        <Shoe key={shoe.objectID} shoe={shoe} />
      ))}
    </div>
  );
};

/*
would like to have like an infinite scolling functionality, where
the page will be increased by 1 when the user scrolls to the bottom
and make a new request for next page of results
*/

const ShoesPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Shoes - goaTinder</title>
      </Head>
      <main>
        <ShoesSection />
      </main>
    </>
  );
};

export default ShoesPage;

// TODO: getserversideprops with initialData
