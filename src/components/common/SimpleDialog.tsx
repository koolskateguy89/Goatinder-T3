import { forwardRef } from "react";
import { Dialog, type DialogProps } from "@headlessui/react";

export type SimpleDialogProps = Omit<
  DialogProps<"div">,
  "open" | "className"
> & {
  isOpen: boolean | undefined;

  /**
   * Any arbitrary content to render behind the dialog.
   */
  backdrop?: React.ReactNode;

  children?: React.ReactNode;
};

/**
 * Wrapper around the Dialog component from Headless UI.
 *
 * Common styling: centers the dialog on the screen and makes it full-screen.
 */
export default forwardRef<typeof Dialog, SimpleDialogProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function SimpleDialog({ isOpen, backdrop, children, ...props }, ref) {
    return (
      // @ts-expect-error spread error idk, not worth time resolving
      <Dialog open={isOpen} className="relative z-40" {...props} ref={ref}>
        {backdrop}

        {/* Full-screen scrollable container */}
        <div className="fixed inset-0 overflow-y-auto">
          {/* Container to center the panel */}
          <div className="flex min-h-full items-center justify-center">
            {children}
          </div>
        </div>
      </Dialog>
    );
  }
);
