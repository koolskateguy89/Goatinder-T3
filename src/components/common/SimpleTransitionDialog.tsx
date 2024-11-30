import { Fragment } from "react";
import { Transition } from "@headlessui/react";

import SimpleDialog, {
  type SimpleDialogProps,
} from "components/common/SimpleDialog";

export interface SimpleTransitionDialogProps {
  isOpen: boolean;
  closeModal: () => void;
  title?: SimpleDialogProps["title"];
  panelClassName?: SimpleDialogProps["panelClassName"];
  children: React.ReactNode;
}

/**
 * Wrapper around the Transition and Dialog components from Headless UI with common dialog styling.
 */
export default function SimpleTransitionDialog({
  isOpen,
  closeModal,
  title,
  panelClassName,
  children,
}: SimpleTransitionDialogProps) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <SimpleDialog
        // We use undefined 'open' here because setting it makes the dialog not transition at all when closing
        isOpen={undefined}
        onClose={closeModal}
        title={title}
        panelClassName={panelClassName}
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
