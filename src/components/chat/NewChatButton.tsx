import { useState } from "react";
import { useRouter } from "next/router";

import { api } from "utils/api";
import SimpleTransitionDialog from "components/common/SimpleTransitionDialog";

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
      {/* TODO: icon */}
      <button
        type="button"
        onClick={openModal}
        className={className}
        aria-label="New Chat"
      >
        +
      </button>

      <SimpleTransitionDialog
        isOpen={isOpen}
        closeModal={closeModal}
        title={
          <>
            New Chat
            {!users && (
              <span className="text-base font-normal text-gray-500">
                {" "}
                (loading...)
              </span>
            )}
          </>
        }
      >
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
              className="btn-link btn-primary btn"
              disabled={!users}
            >
              Chat
            </button>
            {/* TODO: uncomment once manage page implemented */}
            {/* <button
              type="button"
              className="btn-primary btn"
              onClick={createNewGroupChat}
              disabled={newGroupChatMut.isLoading}
            >
              New group chat
            </button> */}
          </div>
        </form>
      </SimpleTransitionDialog>
    </>
  );
}
