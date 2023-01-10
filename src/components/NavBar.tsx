import Link from "next/link";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { MdOutlineNotifications, MdSearch } from "react-icons/md";

import ThemeSwitcher from "./ThemeSwitcher";
import NavTabs from "./navbar/NavTabs";
import Profile from "./navbar/Profile";

function MobileDrawerOpener({ drawerInputId }: { drawerInputId: string }) {
  return (
    <label
      tabIndex={0}
      htmlFor={drawerInputId}
      className="navbar-icon-btn lg:hidden"
    >
      <span className="sr-only">Toggle navigation</span>
      <span>
        <HiOutlineMenuAlt1 />
      </span>
    </label>
  );
}

export default function NavBar({ drawerInputId }: { drawerInputId: string }) {
  return (
    // https://daisyui.com/components/navbar/#responsive-dropdown-menu-on-small-screen-center-menu-on-large-screen
    <header className="navbar items-stretch py-0">
      <div className="navbar-start">
        <MobileDrawerOpener drawerInputId={drawerInputId} />
        <Link
          href="/"
          className="btn-ghost btn-sm btn !text-lg font-bold normal-case md:!text-xl md:btn-md"
        >
          <span>goa</span>
          <span className="text-primary">Tinder</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <NavTabs />
      </div>

      <div className="navbar-end">
        <button type="button" className="navbar-icon-btn" aria-label="Search">
          <span>
            <MdSearch />
          </span>
        </button>

        <button
          type="button"
          className="navbar-icon-btn"
          aria-label="Notifications"
        >
          <div className="indicator">
            <MdOutlineNotifications />
            <span className="badge-primary badge badge-xs indicator-item" />
          </div>
        </button>

        <ThemeSwitcher />

        <Profile />
      </div>
    </header>
  );
}
