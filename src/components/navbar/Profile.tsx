/* eslint-disable jsx-a11y/no-noninteractive-tabindex */

import Image from "next/image";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import clsx from "clsx";

// TODO: rename: UserDropdown?
export default function Profile() {
  const { data: session, status } = useSession();

  // TODO: use daisyUI loading shiny thingy
  if (status === "loading") {
    return (
      <div className="placeholder avatar">
        <div className="w-10 rounded-full bg-neutral-focus" />
      </div>
    );
  }

  if (!session || !session.user) {
    return (
      <Link href="/signin" className="btn-primary btn-sm btn md:btn-md">
        Sign in
      </Link>
    );
  }

  return (
    // maybe use a modal instead of dropdown on mobile?
    <div className="dropdown dropdown-end">
      <label tabIndex={0} className="flex">
        <div className={clsx("avatar", session.user.image || "placeholder")}>
          {session.user.image ? (
            <div className="w-10">
              {/* <img src="https://placeimg.com/192/192/people" /> */}
              <Image
                alt={session.user.name ?? "Profile picture"}
                src={session.user.image}
                quality={100}
                className="mask mask-circle"
                fill
                priority
              />
            </div>
          ) : (
            <div className="w-10 rounded-full bg-neutral-focus text-neutral-content">
              <span className="uppercase">
                {session.user.name?.[0] ?? "nah"}
              </span>
            </div>
          )}
        </div>
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
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
