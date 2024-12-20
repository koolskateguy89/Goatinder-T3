import React, { forwardRef } from "react";
import { Dialog, type DialogProps } from "@headlessui/react";
import clsx from "clsx";

export type SimpleDialogProps = Omit<
  DialogProps<"div">,
  "open" | "className" | "title"
> &
  React.PropsWithChildren<{
    isOpen: boolean | undefined;

    title?: React.ReactNode;
    /**
     * Additional classs for the panel container `Dialog.Panel`
     */
    panelClassName?: string;

    /**
     * Any arbitrary content to render behind the dialog.
     */
    backdrop?: React.ReactNode;
  }>;

/**
 * Wrapper around the Dialog component from Headless UI.
 *
 * Common styling: centers the dialog on the screen and makes it full-screen.
 */
export default forwardRef<typeof Dialog, SimpleDialogProps>(
  // eslint-disable-next-line prefer-arrow-callback
  function SimpleDialog(
    { isOpen, title, backdrop, panelClassName, children, ...props },
    ref,
  ) {
    return (
      // @ts-expect-error spread error idk, not worth time resolving
      <Dialog open={isOpen} className="relative z-40" {...props} ref={ref}>
        {backdrop}

        {/* Full-screen scrollable container */}
        <div className="fixed inset-0 overflow-y-auto">
          {/* Container to center the panel */}
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel
              className={clsx(
                "w-80 rounded-2xl bg-base-100 p-6 shadow-lg",
                panelClassName,
              )}
            >
              {title && (
                <Dialog.Title as="h3" className="text-xl font-semibold">
                  {title}
                </Dialog.Title>
              )}

              {children}
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    );
  },
);
