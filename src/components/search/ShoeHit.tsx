import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
// not sure if gonna use Snippet
import { Highlight, Snippet } from "react-instantsearch-hooks-web";

import type { GoatShoe } from "types/goat-shoe";
import type { AlgoliaHit } from "types/algolia";
import type { attributesToRetrieve } from "pages/shoes/search";

type HitShoe = AlgoliaHit<
  Pick<GoatShoe, (typeof attributesToRetrieve)[number]>
>;

export default function ShoeHit({ hit }: { hit: HitShoe }) {
  return (
    // using negative margins for image & body to get rid of the spacing in
    // the image on smaller screens
    <article className="card h-full overflow-hidden ring-2 ring-primary">
      <figure className="relative mx-auto h-60 w-60 max-md:-mt-10 md:h-60 md:w-60">
        <Image src={hit.grid_picture_url} alt={hit.name} fill sizes="15rem" />
      </figure>
      <div className="card-body items-center text-center max-md:-mt-10">
        <h2 className="link-hover link-primary link card-title">
          <Link href={`/shoes/${hit.objectID}`}>
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
            <Link href={`/shoes/${hit.objectID}`}>
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

        <p>objectID: {hit.objectID}</p>

        <p>
          Retail price:{" "}
          <span className="text-accent">
            £{hit.retail_price_cents_gbp * 0.01}
          </span>
        </p>
        {/* <div className="card-actions [&>*]:text-lg">
          <button type="button" className="btn-error btn">
            <MdClose />
          </button>
          <button type="button" className="btn-success btn">
            <MdFavorite />
          </button>
        </div> */}
      </div>
    </article>
  );
}
