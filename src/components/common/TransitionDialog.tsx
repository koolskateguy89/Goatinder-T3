import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";

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
              {children}
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
