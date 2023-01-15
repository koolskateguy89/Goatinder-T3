import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

import Avatar from "components/Avatar";

// TODO: rename to UserDropdown?
export default function Profile() {
  const { data: session, status } = useSession();

  // TODO: use daisyUI loading shiny thingy(?)
  // should never show tho, since we're passing session to _app with getServerSideProps on every page
  if (status === "loading") {
    return (
      <button type="button" className="btn-primary btn-sm btn md:btn-md">
        Sign in
      </button>
    );
  }

  if (!session || !session.user) {
    return (
      <Link href="/signin" className="btn-primary btn-sm btn md:btn-md">
        Sign in
      </Link>
    );
  }

  const handleMenuClick = () => {
    // only problem is that the transition on close is too quick
    (document.activeElement as HTMLElement | null)?.blur();
  };

  return (
    // maybe use a modal instead of dropdown on mobile?
    <div className="dropdown-end dropdown" aria-haspopup="menu">
      <label tabIndex={0} className="flex cursor-pointer">
        <Avatar
          image={session.user.image}
          name={session.user.name}
          className="[&>*]:w-10"
          imageProps={{
            quality: 100,
            sizes: "2.5rem",
          }}
        />
      </label>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-200 p-2 shadow"
        role="menu"
        onClick={handleMenuClick}
      >
        <li>
          <span>Item 1</span>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
        <li>
          <button
            type="button"
            onClick={() => signOut()}
            className="font-semibold"
          >
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}
