import Link from "next/link";
import { MdOutlineNotifications, MdSearch } from "react-icons/md";

import ThemeSwitcher from "./ThemeSwitcher";
import MobileNav from "./navbar/MobileNav";
import NavTabs from "./navbar/NavTabs";
import Profile from "./navbar/Profile";

export default function NavBar() {
  return (
    // https://daisyui.com/components/navbar/#responsive-dropdown-menu-on-small-screen-center-menu-on-large-screen
    <div className="navbar items-stretch py-0">
      <div className="navbar-start">
        <MobileNav />
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
        <button type="button" className="navbar-icon-btn">
          <span>
            <MdSearch />
          </span>
        </button>

        <button type="button" className="navbar-icon-btn">
          <div className="indicator">
            <MdOutlineNotifications />
            <span className="badge-primary badge badge-xs indicator-item" />
          </div>
        </button>

        <ThemeSwitcher />

        <Profile />
      </div>
    </div>
  );
}
