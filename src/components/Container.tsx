import { useId } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { MdOutlineClose, MdOutlineHome } from "react-icons/md";
import { TbShoe } from "react-icons/tb";

import NavBar from "components/NavBar";

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

// TODO: rename to Layout
export default function Container({ children }: React.PropsWithChildren) {
  const drawerInputId = useId();

  return (
    // https://daisyui.com/components/drawer/
    // drawer is only for navigation on width < lg
    <div className="drawer">
      <input id={drawerInputId} type="checkbox" className="drawer-toggle" />
      {/* the duration for the drawer coming out affects the duration for every child in the page :/ */}
      {/* using unset works as a workaround */}
      <div className="drawer-content !duration-[unset]">
        {/* Page content here */}
        <div
          // daisy:
          // className="sticky top-0 z-30 flex max-h-16 w-full justify-center bg-base-200 bg-opacity-30 text-base-content shadow-sm backdrop-blur transition-all duration-100"
          // TODO: use colours from daisyUI
          // tailwind: (SLIGHTLY customised to actually blur on light)
          className="sticky top-0 z-40 w-full flex-none border-b border-slate-900/10 bg-transparent backdrop-blur transition-colors dark:border-slate-50/[0.06] dark:bg-transparent lg:z-50"
          // tailwind no customisation
          // className="sticky top-0 z-40 w-full flex-none bg-white backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-slate-900/75 lg:z-50 lg:border-b lg:border-slate-900/10"
        >
          <NavBar drawerInputId={drawerInputId} />
        </div>
        <div className="mx-6 my-1">{children}</div>
      </div>
      <div className="drawer-side lg:!hidden">
        <label htmlFor={drawerInputId} className="drawer-overlay" />
        <aside className="h-screen w-80 bg-base-100">
          {/* Sidebar content here */}

          <label
            htmlFor={drawerInputId}
            tabIndex={0}
            className="absolute top-[calc(theme(spacing.4)+theme(spacing[0.5]))] -right-1.5 z-50 flex cursor-pointer items-center justify-center p-1 text-xl"
          >
            <span className="sr-only">Close navigation</span>
            <MdOutlineClose />
          </label>

          {/* TODO: make a menu that looks like Tailwind's, which'll allow use of close button above */}

          <nav role="navigation" aria-label="Main">
            <ul className="menu menu-compact mt-4 px-4 [&_svg]:text-xl">
              <MobileNavItem href="/">
                <MdOutlineHome />
                Home
              </MobileNavItem>
              <MobileNavItem href="/shoes">
                <TbShoe />
                Shoes
              </MobileNavItem>
              <MobileNavItem href="/contact">Contact</MobileNavItem>
              <MobileNavItem href="/about">About</MobileNavItem>
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
