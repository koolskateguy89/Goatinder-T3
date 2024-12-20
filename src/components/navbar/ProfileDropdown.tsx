import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";

import Avatar from "components/Avatar";

export default function ProfileDropdown() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // should never show - we're passing `session` to `_app` with `getServerSideProps` on every page
  if (status === "loading") {
    return (
      <button type="button" className="btn btn-primary btn-sm md:btn-md">
        Sign in
      </button>
    );
  }

  if (!session || !session.user) {
    const isDynamicRoute = router.pathname.includes("/[");

    return (
      <Link
        href={{
          pathname: "/signin",
          query: {
            callbackUrl: isDynamicRoute ? router.asPath : undefined,
          },
        }}
        as="/signin"
        className="btn btn-primary btn-sm md:btn-md"
      >
        Sign in
      </Link>
    );
  }

  return (
    <Menu as="div" className="relative flex">
      <Menu.Button className="my-auto h-10">
        <Avatar
          image={session.user.image}
          name={session.user.name}
          className="[&>*]:w-10"
          imageProps={{
            quality: 100,
            sizes: "2.5rem",
          }}
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          as="ul"
          className="menu rounded-box absolute right-0 top-full mt-1 w-52 origin-top-right bg-base-200 p-2 shadow"
        >
          <Menu.Item as="li">
            {({ close }) => (
              <Link href="/profile" onClick={close}>
                Profile
              </Link>
            )}
          </Menu.Item>
          <Menu.Item as="li">
            <button type="button" onClick={() => signOut()}>
              Sign out
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
