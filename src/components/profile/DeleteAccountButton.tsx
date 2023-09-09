import { useState } from "react";
import { signOut } from "next-auth/react";

import { api } from "utils/api";
import SimpleTransitionDialog from "components/common/SimpleTransitionDialog";

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

      <SimpleTransitionDialog
        isOpen={isOpen}
        closeModal={closeModal}
        title="Confirm Deletion"
      >
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
      </SimpleTransitionDialog>
    </>
  );
}
