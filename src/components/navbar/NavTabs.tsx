import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

function NavTab({ href, children }: React.PropsWithChildren<{ href: string }>) {
  const router = useRouter();
  const active = router.asPath === href;

  return (
    <Link
      href={href}
      className={clsx(
        "relative flex h-full items-center px-3 after:absolute after:inset-x-2 after:top-[calc(100%-theme(spacing.1))] after:h-1 after:bg-primary motion-safe:after:transition-transform",
        active
          ? "font-semibold after:scale-y-100 after:ease-out"
          : "font-normal after:scale-y-0 after:ease-in"
      )}
    >
      {children}
    </Link>
  );
}

export default function NavTabs() {
  return (
    <nav className="flex h-full items-stretch" aria-label="Main">
      <NavTab href="/">Home</NavTab>
      <NavTab href="/shoes/explore">Explore</NavTab>
      <NavTab href="/about">About</NavTab>
    </nav>
  );
}
