import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

import ThemeSwitcher from "components/ThemeSwitcher";
import Brand from "components/Brand";

function MobileNavItem({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  const router = useRouter();
  const active = router.asPath === href;

  return (
    <li>
      <Link href={href} className={clsx(active && "active")}>
        {children}
      </Link>
    </li>
  );
}

// TODO: add icons
function Drawer({
  open,
  closeDrawer,
}: {
  open: boolean;
  closeDrawer: (e: React.MouseEvent) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    // TODO: trap focus inside this
    // TODO: improve accessibility?
    // TODO: keyboard navigable - currently hard to get inside the drawer
    <div
      className={clsx(
        "group/drawer fixed inset-0 z-50 flex-row overflow-y-auto lg:hidden",
        !open && "invisible"
      )}
      tabIndex={0}
      role="dialog"
      aria-modal
    >
      {/* backdrop blur */}
      <div
        onClick={closeDrawer}
        // motion-safe: transition 150ms to transparent on close after 275ms delay (waiting for sidebar to close)
        className="fixed inset-0 bg-neutral/40 group-[.invisible]/drawer:bg-transparent motion-safe:group-[.invisible]/drawer:delay-[275ms] motion-safe:group-[.invisible]/drawer:duration-150"
        aria-hidden
      />

      {/* drawer */}
      <aside
        // using clsx to logically group classnames because prettier basically scrambles them
        className={clsx(
          "relative -ml-80 min-h-screen w-80 bg-base-100 [&>*]:bg-inherit",
          "-ml-80 group-[:not(.invisible)]/drawer:ml-0",
          "motion-safe:transition-all motion-safe:group-[:not(.invisible)]/drawer:delay-100" // only delay on open
        )}
      >
        {/* drawer content here */}

        <header className="flex flex-row items-center gap-1 border-b border-base-300 px-4 pb-4 pt-3 dark:border-white/20">
          <Link href="/" className="btn-ghost btn-sm btn text-xl normal-case">
            <Brand />
          </Link>

          {/* TODO: hide the ThemeSwitcher in navbar [below lg] */}
          <ThemeSwitcher />

          {/* TODO: add more icons here */}

          {/* TODO: close button icon on far right */}
          <button
            type="button"
            onClick={closeDrawer}
            className="btn-ghost btn-sm btn ml-auto text-xl"
          >
            X
          </button>
        </header>

        <main>
          <nav>
            <ul className="menu my-4 px-4">
              <MobileNavItem href="/">Home</MobileNavItem>
              <MobileNavItem href="/shoes">Shoes</MobileNavItem>
              <MobileNavItem href="/contact">Contact</MobileNavItem>
              <MobileNavItem href="/about">About</MobileNavItem>
              {Array.from({ length: 20 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <li key={i}>
                  <span>{i + 1}</span>
                </li>
              ))}
            </ul>
          </nav>
        </main>
      </aside>
    </div>,
    document.body
  );
}

export default function MobileDrawer() {
  const router = useRouter();

  const [open, setOpen] = useState(true);

  const handleClick = useCallback(() => setOpen((isOpen) => !isOpen), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  useEffect(() => setOpen(false), [router.asPath]);

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className="navbar-icon-btn btn-primary btn lg:hidden"
      >
        <span>
          <HiOutlineMenuAlt1 />
        </span>
      </button>
      <Drawer open={open} closeDrawer={closeDrawer} />
    </>
  );
}
