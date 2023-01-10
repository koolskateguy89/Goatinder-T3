import Link from "next/link";
import { MdOutlineNotifications, MdSearch } from "react-icons/md";

import ThemeSwitcher from "./ThemeSwitcher";
import MobileNav from "./navbar/MobileNav";
import NavTabs from "./navbar/NavTabs";
import Profile from "./navbar/Profile";

export default function NavBar() {
  return (
    // https://daisyui.com/components/navbar/#responsive-dropdown-menu-on-small-screen-center-menu-on-large-screen
    <header className="navbar items-stretch py-0">
      <div className="navbar-start">
        <MobileNav />
        <Link
          href="/"
          className="group btn-ghost btn-sm btn !text-lg font-bold normal-case md:!text-xl md:btn-md [&>*]:transition-colors [&>*]:duration-300"
        >
          <span className="group-hover:text-primary">goa</span>
          <span className="text-primary group-hover:text-base-content">
            Tinder
          </span>
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
