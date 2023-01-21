import { useEffect } from "react";
import { useIntersection } from "@mantine/hooks";

export type OnVisibleProps = {
  callback: (entry: IntersectionObserverEntry) => void;
  children: React.ReactNode;
};

/**
 * Utility component that calls a callback when the element is visible.
 * Essentially a wrapper around Mantine's `useIntersection` hook.
 *
 * @param callback - Callback to call when the element is visible.
 * @param children - Children to render.
 */
export default function OnVisible({ callback, children }: OnVisibleProps) {
  const { ref, entry } = useIntersection();

  useEffect(() => {
    if (entry?.isIntersecting) callback(entry);
  }, [entry, callback]);

  return <div ref={ref}>{children}</div>;
}
