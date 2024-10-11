import { useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

import { api } from "utils/api";
import SimpleTransitionDialog from "components/common/SimpleTransitionDialog";

export type LeaveGroupButtonProps = {
  id: string;
  className: string;
};

export default function LeaveGroupButton({
  id,
  className,
}: LeaveGroupButtonProps) {
  const router = useRouter();

  const [isOpen, setOpen] = useState(false);

  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);

  const leaveMut = api.chat.group.leave.useMutation();

  const handleLeave = async () => {
    void leaveMut.mutateAsync({ id });
    await router.push("/chat");
  };

  return (
    <>
      <button
        type="button"
        className={clsx(className, leaveMut.isLoading && "loading")}
        onClick={openModal}
        disabled={leaveMut.isLoading}
      >
        Leave
      </button>
      todo transition (dialog)
      <SimpleTransitionDialog
        isOpen={isOpen}
        closeModal={closeModal}
        title="Are you sure you want to leave this group chat? (irreversible)"
      >
        <div className="mt-3 flex justify-evenly">
          <button
            type="button"
            onClick={handleLeave}
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
