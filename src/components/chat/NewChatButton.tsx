import { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";

import { api } from "utils/api";

export type NewChatButtonProps = {
  className: string;
};

export default function NewChatButton({ className }: NewChatButtonProps) {
  const router = useRouter();

  const { data: users } = api.user.getAllOtherUsers.useQuery();

  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const newGroupChatMut = api.chat.group.createNew.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userId = formData.get("userId") as string;

    if (!userId) return;

    closeModal();
    await router.push(`/chat/${userId}`);
  };

  const createNewGroupChat = async () => {
    const { id } = await newGroupChatMut.mutateAsync({
      name: "New Group Chat",
      image: "",
    });

    closeModal();
    await router.push(`/chat/${id}/manage`);
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className={className}
        aria-label="New Chat"
      >
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
                    {!users && (
                      <span className="text-base font-normal text-gray-500">
                        {" "}
                        (loading...)
                      </span>
                    )}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="mt-2 space-y-2">
                    <select
                      name="userId"
                      className="select-bordered select w-full max-w-xs"
                      defaultValue="Select a user"
                      disabled={!users}
                    >
                      <option disabled>Select a user</option>
                      {users?.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                    </select>

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="btn-primary btn-link btn"
                        disabled={!users}
                      >
                        Chat
                      </button>
                      <button
                        type="button"
                        className="btn-primary btn"
                        onClick={createNewGroupChat}
                        disabled={newGroupChatMut.isLoading}
                      >
                        New group chat
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
