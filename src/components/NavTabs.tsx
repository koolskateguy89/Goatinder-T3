import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

type NavTabProps = React.PropsWithChildren<{
  href: string;
}>;

function NavTab({ href, children }: NavTabProps) {
  const router = useRouter();
  const active = router.asPath === href;

  return (
    <Link
      href={href}
      aria-selected={active}
      role="tab"
      className={clsx(
        "relative flex h-full items-center px-3 transition-colors after:absolute after:inset-x-2 after:top-[calc(100%-theme(spacing.1))] after:h-1 after:bg-primary motion-safe:after:transition-transform",
        active
          ? "font-semibold text-base-content after:scale-y-100 after:ease-out"
          : "font-normal text-base-content/80 after:scale-y-0 after:ease-in hover:text-base-content dark:text-base-content/70 dark:hover:text-base-content"
      )}
    >
      {children}
    </Link>
  );
}

export default function NavTabs() {
  return (
    <div
      className="flex h-full flex-row items-stretch"
      // aria-label="website navigation"
      role="tablist"
    >
      <NavTab href="/">Home</NavTab>
      <NavTab href="/about">About</NavTab>
      <NavTab href="/contact">Contact</NavTab>
    </div>
  );
}
