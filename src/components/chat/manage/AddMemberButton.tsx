import { useState } from "react";
import clsx from "clsx";
import toast from "react-hot-toast";
import { CgSpinner } from "react-icons/cg";

import { api } from "utils/api";
import SimpleDialog from "components/common/SimpleTransitionDialog";

export interface AddMemberButtonProps {
  groupChatId: string;
  onAddMember?: (id: string) => void;
}

export default function AddMemberButton({
  groupChatId,
  onAddMember,
}: AddMemberButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  // TODO: get users not in group chat
  const {
    data: users,
    refetch: refetchUsers,
    isLoading: usersIsLoading,
  } = api.user.getAllOtherUsers.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: isOpen,
  });

  const addMemberMut = api.chat.group.addMember.useMutation({
    async onSuccess() {
      // TODO: refetchUserNotInGroupChat
      await refetchUsers();
    },
  });

  const openModal = () => setIsOpen(true);

  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const userId = formData.get("userId") as string;

    if (!userId) {
      toast.error("Please select a user", {
        id: "add-member-button-no-user-selected",
      });
      return;
    }

    await addMemberMut.mutateAsync({ id: groupChatId, userId });
    onAddMember?.(userId);
    closeModal();
  };

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="btn-success btn-sm btn ml-2"
      >
        Add
      </button>

      <SimpleDialog isOpen={isOpen} closeModal={closeModal} title="Add Member">
        <form className="mt-4 flex flex-col space-y-2" onSubmit={handleSubmit}>
          {usersIsLoading || !users ? (
            <div className="flex justify-center">
              <CgSpinner className="text-4xl motion-safe:animate-spin motion-reduce:hidden" />
              <span className="text-lg motion-safe:sr-only">
                Loading users...
              </span>
            </div>
          ) : (
            <select
              name="userId"
              className="select-bordered select w-full max-w-xs"
              defaultValue="Select a user"
            >
              <option disabled>Select a user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          )}

          <button
            type="submit"
            className="btn-primary btn"
            aria-label="Add"
            disabled={usersIsLoading || addMemberMut.isLoading}
          >
            <CgSpinner
              className={clsx(
                "text-xl motion-safe:animate-spin motion-reduce:hidden",
                !addMemberMut.isLoading && "hidden"
              )}
            />
            Add
          </button>
        </form>
      </SimpleDialog>
    </>
  );
}
