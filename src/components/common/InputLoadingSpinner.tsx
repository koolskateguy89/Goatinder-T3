import clsx from "clsx";
import { CgSpinner } from "react-icons/cg";

export interface InputLoadingSpinnerProps {
  loading: boolean;
  className?: string;
}

/**
 * A loading spinner that is to be used to appear inside an input.
 * It's position has to be specified in the `className` prop. (e.g. `-left-4.5`)
 */
export default function InputLoadingSpinner({
  loading,
  className,
}: InputLoadingSpinnerProps) {
  return (
    // can't use before/after on input so using additional markup
    <div
      className={clsx(
        "relative opacity-0 transition-opacity",
        loading && "motion-safe:opacity-100",
      )}
      aria-hidden
    >
      <div className={clsx("absolute translate-y-full", className)}>
        <CgSpinner className="motion-safe:animate-spin" />
      </div>
    </div>
  );
}
