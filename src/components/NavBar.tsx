import Link from "next/link";
import { MdSearch } from "react-icons/md";

import Brand from "components/Brand";
import ThemeSwitcher from "components/ThemeSwitcher";
import MobileDrawer from "components/navbar/MobileDrawer";
import NavTabs from "components/navbar/NavTabs";
import ProfileDropdown from "components/navbar/ProfileDropdown";

/*
 * TODO: look at using AutoComplete in navbar (lg screens only)
 * https://www.algolia.com/doc/guides/building-search-ui/ui-and-ux-patterns/autocomplete/react-hooks/
 */

export default function NavBar() {
  return (
    // https://daisyui.com/components/navbar/#responsive-dropdown-menu-on-small-screen-center-menu-on-large-screen
    <header className="container navbar items-stretch py-0">
      <div className="navbar-start">
        <MobileDrawer />
        <Link
          href="/"
          className="btn btn-ghost btn-sm !text-lg normal-case md:btn-md md:!text-xl"
        >
          <Brand />
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <NavTabs />
      </div>

      <div className="navbar-end">
        <Link
          href="/shoes/search"
          className="navbar-icon-btn lg:hidden"
          aria-label="Search"
        >
          <span>
            <MdSearch />
          </span>
        </Link>

        <ThemeSwitcher />

        <ProfileDropdown />
      </div>
    </header>
  );
}
