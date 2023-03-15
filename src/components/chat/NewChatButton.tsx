import { Fragment, useState } from "react";
import Link from "next/link";
import { Dialog, Transition } from "@headlessui/react";
import type { User } from "@prisma/client";

import { api } from "utils/api";

export type NewChatButtonProps = {
  className: string;
};

export default function NewChatButton({ className }: NewChatButtonProps) {
  const { data: users } = api.user.getAllOtherUsers.useQuery();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  // TODO: dialog to pick who to chat with
  // or create a new group chat
  // if group chat, then redirect to /chat/[id]/manage
  // if 1:1 chat, then redirect to /chat/[id]

  // TODO: mutation to create new GC

  return (
    <>
      <button type="button" onClick={openModal} className={className}>
        +
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={closeModal} className="relative z-40">
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden />
          </Transition.Child>

          {/* Full-screen scrollable container */}
          <div className="fixed inset-0 overflow-y-auto">
            {/* Container to center the panel */}
            <div className="flex min-h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-80 rounded-2xl bg-base-100 p-6 shadow-lg">
                  <Dialog.Title as="h3" className="text-xl font-semibold">
                    New Chat
                  </Dialog.Title>

                  <div className="">
                    select to chat with
                    <br />
                    also new group chat button
                  </div>

                  <select className="select-primary select w-full max-w-xs">
                    <option disabled selected>
                      Select a user
                    </option>
                    <option className="font-semibold">New group chat</option>
                    <option>Game of Thrones</option>
                    <option>Lost</option>
                    <option>Breaking Bad</option>
                    <option>Walking Dead</option>
                  </select>

                  <ul>
                    {users?.map((user) => (
                      <li key={user.id}>
                        <Link href={`/chat/${user.id}`}>{user.name}</Link>
                      </li>
                    )) ?? <li>Loading...</li>}
                  </ul>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
