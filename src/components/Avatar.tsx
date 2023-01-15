import Image, { type ImageProps } from "next/image";
import clsx from "clsx";

export type AvatarProps = {
  image: string | null | undefined;
  name: string | null | undefined;
  className: string;
  imageProps?: Partial<Omit<ImageProps, "src" | "className" | "fill">> &
    Required<Pick<ImageProps, "sizes">>;
};

/**
 * Avatar component with placeholder fallback.
 * Uses daisyUI's avatar.
 *
 * Need to specify width of inner div so the `Image` fills it.
 * And also `sizes` attribute for the `Image` component.
 * e.g.
 * ```tsx
 * <Avatar
 *   image="..."
 *   name="..."
 *   className="[&>*]:w-10"
 *   imageProps={{ sizes: "2.5rem" }}
 * />
 * ```
 *
 * @param image URL of image
 * @param name Name of user
 * @param className Additional class names
 * @param imageProps Props to pass to Image component
 *
 * @see https://daisyui.com/components/avatar/
 */
export default function Avatar({
  image,
  name,
  className,
  imageProps,
}: AvatarProps) {
  return (
    // <img src="https://placeimg.com/192/192/people" /> (could use for seeding)
    // TODO: image fallback https://vercel.com/templates/next.js/image-fallback (customise component so that fallback is reactnode)
    <div className={clsx("avatar", !image && "placeholder", className)}>
      {image ? (
        <div className="relative">
          {/* TODO: actual Image with fallback */}
          <Image
            alt={name ?? "Profile picture"}
            src={image}
            fill
            className="mask mask-circle"
            {...imageProps}
          />
        </div>
      ) : (
        <div className="rounded-full bg-neutral-focus text-neutral-content">
          <span className="uppercase">{name?.[0] ?? "?"}</span>
        </div>
      )}
    </div>
  );
}
