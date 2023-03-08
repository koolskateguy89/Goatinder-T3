import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import clsx from "clsx";

export type AvatarProps = {
  image: string | null | undefined;
  name: string | null | undefined;
  className: string;
  imageProps?: Partial<
    Omit<ImageProps, "src" | "className" | "fill" | "onError">
  > &
    Required<Pick<ImageProps, "sizes">>;
};

/**
 * Avatar component with placeholder fallback.
 * The placeholder is a circle with the first letter of the name.
 * Shows the image if it exists and loads successfully,
 *  otherwise shows the placeholder.
 *
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
  const [error, setError] = useState(false);

  const usePlaceholder = !image || error;

  // without this, in specific cases the avatar will show the placeholder instead of the image
  // e.g. when you go to a chat page and switch to another chat
  useEffect(() => {
    setError(false);
  }, [image]);

  return (
    // <img src="https://placeimg.com/192/192/people" /> (could use for seeding)
    <div className={clsx("avatar", usePlaceholder && "placeholder", className)}>
      {usePlaceholder ? (
        <div className="rounded-full bg-neutral-focus text-neutral-content">
          <span className="uppercase">{name?.[0] ?? "?"}</span>
        </div>
      ) : (
        <div className="relative">
          <Image
            alt={name ?? "Profile picture"}
            src={image}
            fill
            className="mask mask-circle"
            onError={() => setError(true)}
            {...imageProps}
          />
        </div>
      )}
    </div>
  );
}
