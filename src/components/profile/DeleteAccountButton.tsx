import { Fragment, useState } from "react";
import { signOut } from "next-auth/react";
import { Dialog, Transition } from "@headlessui/react";

import { api } from "utils/api";

export default function DeleteAccountButton() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  const openModal = () => setIsOpen(true);

  const deleteAcc = api.user.deleteAccount.useMutation();

  const deleteAccount = async () => {
    await deleteAcc.mutateAsync();
    await signOut({ callbackUrl: "/" });
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn-primary btn w-32 md:w-48"
      >
        Delete Account
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
                    Confirm Deletion
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    <p>Are you sure you want to delete ur account?</p>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="btn-ghost btn"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={deleteAccount}
                        className="btn-error btn"
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
