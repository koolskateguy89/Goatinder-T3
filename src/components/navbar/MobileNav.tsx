import Link from "next/link";
import { useRouter } from "next/router";
import clsx from "clsx";
import { HiOutlineMenuAlt1 } from "react-icons/hi";

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
// TODO: change to Drawer
// https://daisyui.com/components/drawer/
export default function MobileNav() {
  return (
    // TODO: change label to a button with useState(open), so can close menu onClick
    // but then will need to close it when clicking outside of it
    // maybe use onClick & onFocus - idk need to google
    <div className="dropdown">
      <label tabIndex={0} className="navbar-icon-btn lg:hidden">
        <span>
          <HiOutlineMenuAlt1 />
        </span>
      </label>
      <nav className="dropdown-content" role="navigation" aria-label="Main">
        <ul
          tabIndex={0}
          className="menu rounded-box menu-compact mt-3 w-52 bg-base-200 p-2 shadow"
        >
          <li className="menu-title">
            <span>Category</span>
          </li>
          <MobileNavItem href="/">Home</MobileNavItem>
          <MobileNavItem href="/shoes">Shoes</MobileNavItem>
          <MobileNavItem href="/contact">Contact</MobileNavItem>
          <MobileNavItem href="/about">About</MobileNavItem>
        </ul>
      </nav>
    </div>
  );
}
