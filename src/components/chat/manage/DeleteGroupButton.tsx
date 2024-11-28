import { useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { api } from "utils/api";
import SimpleTransitionDialog from "components/common/SimpleTransitionDialog";

export type DeleteGroupButtonProps = {
  id: string;
  className: string;
};

export default function DeleteGroupButton({
  id,
  className,
}: DeleteGroupButtonProps) {
  const router = useRouter();

  const [isOpen, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const deleteMut = api.chat.group.delete.useMutation();

  const handleDelete = async () => {
    await deleteMut.mutateAsync({ id });
    await router.push("/chat");
  };

  return (
    // FIXME: delete button loading not exactly how we want it
    <>
      <button
        type="button"
        className={clsx(className, deleteMut.isLoading && "loading")}
        onClick={openModal}
        disabled={deleteMut.isLoading}
      >
        {!deleteMut.isLoading && "Delete"}
      </button>

      <SimpleTransitionDialog
        isOpen={isOpen}
        closeModal={closeModal}
        title="Are you sure you want to delete this group chat? (irreversible)"
      >
        <div className="mt-3 flex justify-evenly">
          <button
            type="button"
            onClick={handleDelete}
            className="btn btn-warning"
          >
            Yes
          </button>
          <button type="button" onClick={closeModal} className="btn">
            No
          </button>
        </div>
      </SimpleTransitionDialog>
    </>
  );
}
