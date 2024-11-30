import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";
import clsx from "clsx";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { HiXMark } from "react-icons/hi2";
import {
  MdHome,
  MdInfo,
  MdSearch,
  MdExplore,
  MdPeople,
  MdChat,
} from "react-icons/md";

import Brand from "components/Brand";

// TODO?: add Avatar & name, similar to Meraki UI's sidebar example: https://merakiui.com/components/sidebar

function MobileNavItem({
  href,
  children,
}: React.PropsWithChildren<{ href: string }>) {
  const router = useRouter();
  const isActive = router.asPath === href;

  return (
    <li>
      <Link href={href} className={clsx(isActive && "active")}>
        {children}
      </Link>
    </li>
  );
}

export default function MobileDrawer() {
  const router = useRouter();

  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => setIsOpen(false), [router.asPath]);

  const closeModal = () => setIsOpen(false);

  const openModal = () => setIsOpen(true);

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="navbar-icon-btn btn btn-primary lg:hidden"
      >
        <span>
          <HiOutlineMenuAlt1 />
        </span>
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeModal} className="relative z-40">
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <Transition.Child
            as={Fragment}
            enter="ease-out motion-safe:duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in motion-safe:duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden />
          </Transition.Child>

          {/* Full-screen scrollable container */}
          <div className="fixed inset-0 overflow-y-auto">
            {/* Container to handle height */}
            <div className="h-dvh">
              <Transition.Child
                as={Fragment}
                enter="ease-out motion-safe:duration-300"
                enterFrom="opacity-80 -translate-x-full"
                enterTo="opacity-100 translate-0"
                leave="ease-in motion-safe:duration-200"
                leaveFrom="opacity-100 translate-0"
                leaveTo="opacity-80 -translate-x-full"
              >
                <Dialog.Panel as="aside" className="h-full w-80 bg-base-100">
                  <Dialog.Title className="sr-only">
                    Sidebar with main navigation
                  </Dialog.Title>

                  <header className="navbar gap-1 border-b border-base-300 px-4 dark:border-white/10">
                    <Link
                      href="/"
                      className="btn btn-ghost btn-sm text-xl normal-case"
                    >
                      <Brand />
                    </Link>

                    {/* TODO?: add more icons here */}

                    <button
                      type="button"
                      onClick={closeModal}
                      className="navbar-icon-btn ml-auto"
                    >
                      <span>
                        <HiXMark />
                      </span>
                    </button>
                  </header>

                  <main>
                    <nav>
                      <ul className="menu my-4 px-4">
                        <MobileNavItem href="/">
                          <MdHome />
                          Home
                        </MobileNavItem>
                        <MobileNavItem href="/about">
                          <MdInfo />
                          About
                        </MobileNavItem>
                        <li className="menu-title">
                          <span>Shoes</span>
                        </li>
                        <MobileNavItem href="/shoes/search">
                          <MdSearch />
                          Search
                        </MobileNavItem>
                        <MobileNavItem href="/shoes/explore">
                          <MdExplore />
                          Explore
                        </MobileNavItem>
                        <li className="menu-title">
                          <span>Social</span>
                        </li>
                        <MobileNavItem href="/profiles">
                          <MdPeople />
                          Users
                        </MobileNavItem>
                        {signedIn && (
                          <MobileNavItem href="/chat">
                            <MdChat />
                            Chat
                          </MobileNavItem>
                        )}
                      </ul>
                    </nav>
                  </main>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
