import algoliasearch from "algoliasearch";
import algoliasearchlite from "algoliasearch/lite";

import { env } from "env/client.mjs";

export const searchClient = algoliasearchlite(
  env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  env.NEXT_PUBLIC_ALGOLIA_API_KEY,
);

export const fullClient = algoliasearch(
  env.NEXT_PUBLIC_ALGOLIA_APP_ID,
  env.NEXT_PUBLIC_ALGOLIA_API_KEY,
);
