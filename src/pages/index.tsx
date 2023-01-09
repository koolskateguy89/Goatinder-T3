import { useState } from "react";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "utils/api";
import type { GoatShoe } from "types/goat-shoe";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        type="button"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

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
        <p className="max-w-full break-all text-lg font-bold">{shoe.name}</p>
        <p className="text-sm font-bold">{shoe.brand_name}</p>
        <p className="text-lg font-bold">{shoe.retail_price_cents_gbp}</p>
      </div>
    </div>
  );
};

// TODO: don't want this on landing page
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

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>goaTinder</title>
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h2 className="text-2xl font-bold">First Steps →</h2>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h2 className="text-2xl font-bold">Documentation →</h2>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <AuthShowcase />
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p>
          </div>

          <ShoesSection />
        </div>
      </main>
    </>
  );
};

export default Home;
