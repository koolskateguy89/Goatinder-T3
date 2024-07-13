import { Fragment } from "react";
import { Transition } from "@headlessui/react";

import SimpleDialog from "components/common/SimpleDialog";

export type TransitionDialogProps = React.PropsWithChildren<{
  isOpen: boolean;
  closeModal: () => void;
}>;

/**
 * Wrapper around the Transition and Dialog components from Headless UI.
 */
export default function TransitionDialog({
  isOpen,
  closeModal,
  children,
}: TransitionDialogProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <SimpleDialog
        // We don't specify 'open' here because it makes closing the dialog not transition
        isOpen={undefined}
        onClose={closeModal}
        backdrop={
          // The backdrop, rendered as a fixed sibling to the panel container
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
        }
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          {children}
        </Transition.Child>
      </SimpleDialog>
    </Transition>
  );
}
