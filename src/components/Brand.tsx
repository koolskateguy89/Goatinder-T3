import clsx from "clsx";

export type BrandProps = React.ComponentProps<"span">;

export default function Brand({ className, ...props }: BrandProps) {
  return (
    <span
      className={clsx(
        "group/brand font-bold transition-colors [&>span]:duration-300",
        className,
      )}
      {...props}
    >
      <span className="group-hover/brand:text-primary">goa</span>
      <span className="text-primary group-hover/brand:text-base-content">
        Tinder
      </span>
    </span>
  );
}
