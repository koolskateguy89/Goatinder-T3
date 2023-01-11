import { useState } from "react";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { unstable_getServerSession } from "next-auth";
import { MdOutlineThumbDown, MdOutlineThumbUp } from "react-icons/md";

import { authOptions } from "pages/api/auth/[...nextauth]";
import { api } from "utils/api";
import type { GoatShoe } from "types/goat-shoe";

const Shoe = ({ shoe }: { shoe: GoatShoe }) => {
  return (
    // using negative margins for image & body to get rid of the spacing in
    // the image on smaller screens
    <div className="card overflow-hidden ring-2 ring-primary">
      <figure className="relative mx-auto h-60 w-60 max-md:-mt-10 md:h-60 md:w-60">
        <Image src={shoe.grid_picture_url} alt={shoe.name} fill sizes="15rem" />
      </figure>
      <div className="card-body items-center text-center max-md:-mt-10">
        <h2 className="link-hover link-primary link card-title">
          <Link href={`/shoes/${shoe.search_sku}`}>{shoe.name}</Link>
        </h2>
        <p className="text-sm">{shoe.brand_name}</p>
        <p>Retail: £{shoe.retail_price_cents_gbp * 0.01}</p>
        <div className="card-actions">
          {/* <button type="button" className="btn-primary btn">
            Buy Now
          </button> */}
          <button type="button" className="btn-error btn">
            <MdOutlineThumbDown />
          </button>
          <button type="button" className="btn-success btn">
            <MdOutlineThumbUp />
          </button>
        </div>
      </div>
    </div>
  );
};

const ShoesDisplay = ({ shoes }: { shoes: GoatShoe[] }) => {
  return (
    <div
      className="mx-auto grid max-w-5xl grid-cols-1 grid-rows-[auto] gap-4
    sm:grid-cols-2 lg:grid-cols-3"
    >
      {shoes.map((shoe) => (
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
  // TODO: set query & filters, use debounced input for query
  // not sure about implementing filters, maybe a dropdown? or switches?
  const [query, setQuery] = useState("yeezy");
  const [filters, setFilters] = useState(null);
  // page will be automatically set by infiinte scrolling thingy?
  const [page, setPage] = useState(0);

  const shoes = api.goat.search.useQuery(
    {
      query,
      page,
      filters,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get("query") as string;

    setQuery(newQuery);
  };

  return (
    <>
      <Head>
        <title>Shoes - goaTinder</title>
      </Head>
      <main className="mx-6 mt-4 flex flex-col items-center gap-4">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <div className="input-group">
              <input
                type="text"
                name="query"
                defaultValue="yeezyyy"
                placeholder="Search..."
                className="input-bordered input"
              />
              <button
                type="submit"
                className="btn-primary btn-square btn"
                disabled={shoes.isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </form>

        {shoes.data ? <ShoesDisplay shoes={shoes.data} /> : <div>loading</div>}
      </main>
    </>
  );
};

export default ShoesPage;

// TODO: getserversideprops with initialData
export const getServerSideProps = (async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  // TODO: request db for users likes and disikeS?
  // so can show that user has already liked/disliked shoe

  return {
    props: {
      session,
    },
  };
}) satisfies GetServerSideProps;
