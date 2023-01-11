import Link from "next/link";
import { MdOutlineNotifications, MdSearch } from "react-icons/md";

import Brand from "components/Brand";
import ThemeSwitcher from "components/ThemeSwitcher";
import MobileDrawer from "components/navbar/MobileDrawer";
import NavTabs from "components/navbar/NavTabs";
import Profile from "components/navbar/Profile";

export default function NavBar() {
  return (
    // https://daisyui.com/components/navbar/#responsive-dropdown-menu-on-small-screen-center-menu-on-large-screen
    <header className="navbar items-stretch py-0">
      <div className="navbar-start">
        <MobileDrawer />
        <Link
          href="/"
          className="btn-ghost btn-sm btn !text-lg normal-case md:!text-xl md:btn-md"
        >
          <Brand />
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
