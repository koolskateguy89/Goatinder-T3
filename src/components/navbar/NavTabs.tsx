import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import clsx from "clsx";

type NavTabProps = React.PropsWithChildren<{
  href: string;
  /**
   * If `true`, check if the current location _starts with_ `href`;
   * if `false`, only considers the link to be active when the current
   * location matches the `href` exactly.
   *
   * @default false
   * @see https://start.solidjs.com/api/A#props `end`
   */
  start?: boolean;
}>;

function NavTab({ href, children, start = false }: NavTabProps) {
  const router = useRouter();
  const active = start
    ? router.asPath.startsWith(href)
    : router.asPath === href;

  return (
    <Link
      href={href}
      className={clsx(
        "relative flex h-full items-center px-3 after:absolute after:inset-x-2 after:top-[calc(100%-theme(spacing.1))] after:h-1 after:bg-primary motion-safe:after:transition-transform",
        active
          ? "font-semibold after:scale-y-100 after:ease-out"
          : "font-normal after:scale-y-0 after:ease-in",
      )}
    >
      {children}
    </Link>
  );
}

export default function NavTabs() {
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);

  return (
    <nav className="flex h-full items-stretch" aria-label="Main">
      <NavTab href="/">Home</NavTab>
      <NavTab href="/shoes/explore">Explore</NavTab>
      <NavTab href="/shoes/search">Search</NavTab>
      <NavTab href="/profiles">Users</NavTab>
      {signedIn && (
        <NavTab href="/chat" start>
          Chat
        </NavTab>
      )}
      <NavTab href="/about">About</NavTab>
    </nav>
  );
}
