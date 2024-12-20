import Link from "next/link";
import clsx from "clsx";

import type { GoatShoe } from "types/goat-shoe";
import type { attributesToRetrieve } from "pages/shoes/search";
import type { AlgoliaHit } from "types/algolia";
import ShoeCard from "components/ShoeCard";

type HitShoe = AlgoliaHit<
  Pick<GoatShoe, (typeof attributesToRetrieve)[number]>
>;

export default function ShoeHit({ hit }: { hit: HitShoe }) {
  return (
    <ShoeCard shoe={hit}>
      <div className="group/name relative">
        <h2 className="link-hover link-secondary link card-title">
          <Link href={`/shoes/${hit.objectID}`}>{hit.name}</Link>
        </h2>
        {hit.story_html && (
          <div
            role="tooltip"
            // using clsx to logically group classnames because prettier basically scrambles them
            className={clsx(
              "absolute left-1/2 top-full z-10 -translate-x-1/2",
              "rounded-box mx-2 w-72",
              "border-4 border-base-200 bg-base-100 p-2 text-base dark:border-base-100 dark:bg-neutral",
              // need pointer-events-none to stop the hover from triggering
              // hovering over the title will keep it open
              "pointer-events-none group-hover/name:pointer-events-auto",
              // https://tailwindcss.com/blog/multi-line-truncation-with-tailwindcss-line-clamp
              "line-clamp-4",
              "opacity-0 transition-opacity delay-100 group-hover/name:opacity-100 group-hover/name:delay-700",
            )}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: hit.story_html }}
          />
        )}
      </div>

      {hit.designer && <p>Designer: {hit.designer}</p>}

      {hit.brand_name && (
        <p className="text-sm text-base-content/60">{hit.brand_name}</p>
      )}

      {process.env.NODE_ENV === "development" && (
        <p>objectID: {hit.objectID}</p>
      )}

      {hit.retail_price_cents_gbp !== 0 && (
        <p>
          Retail price:{" "}
          <span className="text-accent">
            £{(hit.retail_price_cents_gbp * 0.01).toFixed(2)}
          </span>
        </p>
      )}
    </ShoeCard>
  );
}
