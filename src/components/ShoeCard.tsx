import Image, { type ImageProps } from "next/image";

import type { GoatShoe } from "types/goat-shoe";

export type ShoeCardProps = {
  shoe: Pick<GoatShoe, "name"> &
    (
      | {
          main_picture_url: GoatShoe["main_picture_url"];
          grid_picture_url?: undefined;
        }
      | {
          main_picture_url?: undefined;
          grid_picture_url: GoatShoe["grid_picture_url"];
        }
    );
  imageProps?: Omit<ImageProps, "src" | "alt" | "fill" | "sizes">;
  children: React.ReactNode; // body of the card
};

// TODO?: maybe don't use daisyUI's card, just style it myself
export default function ShoeCard({
  shoe,
  imageProps,
  children,
}: ShoeCardProps) {
  return (
    <article className="card h-full overflow-hidden bg-black/[0.02] ring-2 ring-black/10 dark:bg-white/[0.02] dark:ring-white/10">
      <figure className="relative mx-auto -mt-5 h-40 w-40 md:mt-0 lg:h-60 lg:w-60">
        <Image
          src={shoe.grid_picture_url ?? shoe.main_picture_url}
          alt={shoe.name}
          fill
          sizes="(min-width: 1024px): 15rem, 10rem"
          {...imageProps}
        />
      </figure>

      <div className="card-body items-center pt-0 text-center">{children}</div>
    </article>
  );
}
