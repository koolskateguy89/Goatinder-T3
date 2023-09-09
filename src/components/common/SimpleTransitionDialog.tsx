import { Dialog } from "@headlessui/react";

import TransitionDialog from "components/common/TransitionDialog";

export interface SimpleTransitionDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * `TransitionDialog` with common dialog panel styling.
 */
export default function SimpleTransitionDialog({
  isOpen,
  closeModal,
  title,
  children,
}: SimpleTransitionDialogProps) {
  return (
    <TransitionDialog isOpen={isOpen} closeModal={closeModal}>
      <Dialog.Panel className="w-80 rounded-2xl bg-base-100 p-6 shadow-lg">
        {title && (
          <Dialog.Title as="h3" className="text-xl font-semibold">
            {title}
          </Dialog.Title>
        )}

        {children}
      </Dialog.Panel>
    </TransitionDialog>
  );
}
