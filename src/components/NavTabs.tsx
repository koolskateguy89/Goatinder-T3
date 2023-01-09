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
      className={clsx(
        "flex h-full items-center px-3 transition-colors hover:text-base-content",
        active
          ? "font-semibold text-base-content"
          : "font-normal text-base-content/80 dark:text-base-content/70"
      )}
    >
      {children}
    </Link>
  );
}

export default function NavTabs() {
  return (
    <div className="flex h-full flex-row items-stretch">
      <NavTab href="/">Home</NavTab>
      <NavTab href="/about">About</NavTab>
      <NavTab href="/contact">Contact</NavTab>
    </div>
  );
}
