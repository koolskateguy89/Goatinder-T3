import axios from "axios";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "server/api/trpc";
import { FiltersSchema, type GoatShoe } from "types/goat-shoe";
import { env } from "env/server.mjs";

interface AlgoliaResult<T> {
  results: { hits: T[] }[];
}

function getAlgoliaUrl(appId: string, apiKey: string) {
  return `https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20JS%20Helper%20(3.2.2)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.8.2)&x-algolia-application-id=${appId}&x-algolia-api-key=${apiKey}`;
}

export const goatRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().int().nonnegative(),
        filters: FiltersSchema.nullish(),
        hitsPerPage: z.number().int().nonnegative().default(24),
      })
    )
    .query(async ({ input }) => {
      const { query, page, filters, hitsPerPage } = input;

      const url = getAlgoliaUrl(
        env.NEXT_PUBLIC_ALGOLIA_APP_ID,
        env.NEXT_PUBLIC_ALGOLIA_API_KEY
      );

      // TODO: try at most 5 times to get at least 15 shoes matching filters
      //   while (results.size < 15 && count < 5) {
      //     results += filters.perform(goatRepository.get20Shoes(query).asIterable())
      //     results = results.distinctBy { shoe -> shoe.objectID.raw }.toMutableList()

      //     count++
      // }

      const { data: algoliaResult } = await axios.post<AlgoliaResult<GoatShoe>>(
        url,
        {
          requests: [
            {
              indexName: "product_variants_v2",
              params: `distinct=true&query=${query}&hitsPerPage=${hitsPerPage}&page=${page}&facetFilters=product_category%3Ashoes&facets=brand_name`,
              // params: `highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&distinct=true&query=${query}&maxValuesPerFacet=30&page=${page}&facets=%5B%22product_category%22%2C%22instant_ship_lowest_price_cents%22%2C%22single_gender%22%2C%22presentation_size%22%2C%22shoe_condition%22%2C%22brand_name%22%2C%22color%22%2C%22silhouette%22%2C%22designer%22%2C%22upper_material%22%2C%22midsole%22%2C%22category%22%2C%22release_date_name%22%5D&tagFilters=&facetFilters=%5B%5B%22product_category%3Ashoes%22%5D%5D`,
            },
          ],
        }
      );

      const { hits } = algoliaResult.results[0];

      if (!filters) return hits;

      const shoes: GoatShoe[] = hits.filter((shoe) => {
        if (filters.condition && shoe.shoe_condition !== filters.condition) {
          return false;
        }

        if (filters.gender && !shoe.gender.includes(filters.gender)) {
          return false;
        }

        return true;
      });

      return shoes;
    }),
});
