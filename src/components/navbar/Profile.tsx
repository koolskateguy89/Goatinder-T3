import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";

// TODO: rename: UserDropdown?
export default function Profile() {
  const { data: session, status } = useSession();

  // TODO: use daisyUI loading shiny thingy
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
    // {/* <img src="https://placeimg.com/192/192/people" /> */}
    // maybe use a modal instead of dropdown on mobile?
    // TODO: image fallback https://vercel.com/templates/next.js/image-fallback (customise component so that fallback is reactnode)
    <div className="dropdown-end dropdown" aria-haspopup="menu">
      <label tabIndex={0} className="flex cursor-pointer">
        <div className={clsx("avatar", !session.user.image && "placeholder")}>
          {session.user.image ? (
            <div className="relative w-10">
              <Image
                alt={session.user.name ?? "Profile picture"}
                src={session.user.image}
                quality={100}
                fill
                sizes="2.5rem"
                className="mask mask-circle"
              />
            </div>
          ) : (
            <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
              <span className="uppercase">{session.user.name?.[0] ?? "?"}</span>
            </div>
          )}
        </div>
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
            onClick={() => signOut({ callbackUrl: "/" })}
            className="font-semibold"
          >
            Sign out
          </button>
        </li>
      </ul>
    </div>
  );
}
