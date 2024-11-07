import { useRouter } from "next/router";
import clsx from "clsx";
import { BiArrowBack } from "react-icons/bi";
import { useEffect, useState } from "react";

export interface BackButtonProps {
  className?: string;
}

/**
 * Window history back button - only displays after initial render iff
 * we _can_ go back according to `window.history`.
 */
export default function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // window is client-only
    setCanGoBack(window.history.length > 1);
  }, []);

  return (
    canGoBack && (
      <button
        type="button"
        className={clsx("btn btn-primary max-lg:btn-circle", className)}
        onClick={() => router.back()}
      >
        <BiArrowBack className="text-2xl" />
        <span className="max-lg:sr-only">Back</span>
      </button>
    )
  );
}
