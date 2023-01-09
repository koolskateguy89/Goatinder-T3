/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";

import ThemeSwitcher from "./ThemeSwitcher";

function NavTab({ href, children }: React.PropsWithChildren<{ href: string }>) {
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

function NavTabs() {
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

// TODO: styling?
// TODO: add icons
function MobileNav() {
  return (
    <>
      <MobileNavItem href="/">Home</MobileNavItem>
      <MobileNavItem href="/contact">Contact</MobileNavItem>
      <MobileNavItem href="/about">About</MobileNavItem>
    </>
  );
}

// TODO: mobile nav list
// or maybe a drawer instead
// https://daisyui.com/components/drawer/

export default function NavBar() {
  return (
    // https://daisyui.com/components/navbar/#responsive-dropdown-menu-on-small-screen-center-menu-on-large-screen
    <div className="navbar items-stretch py-0">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li className="menu-title">
              <span>Category</span>
            </li>
            <MobileNav />
          </ul>
        </div>
        <Link href="/" className="btn-ghost btn text-xl font-bold normal-case">
          <span>goa</span>
          <span className="text-primary">Tinder</span>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <NavTabs />
      </div>
      <div className="navbar-end">
        <button type="button" className="btn-ghost btn-circle btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <button type="button" className="btn-ghost btn-circle btn">
          <div className="indicator">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="badge-primary badge badge-xs indicator-item" />
          </div>
        </button>

        <ThemeSwitcher />
      </div>
    </div>
  );
}
