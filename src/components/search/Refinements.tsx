import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  ClearRefinements,
  HitsPerPage,
  RefinementList,
} from "react-instantsearch-hooks-web";

export default function Refinements() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  const openModal = () => setIsOpen(true);

  return (
    <>
      <aside className="hidden w-1/4 gap-y-4 lg:block">
        <HitsPerPage
          items={[
            { label: "1 shoe per page", value: 1 },
            { label: "12 shoes per page", value: 12 },
            {
              label: "24 shoes per page",
              value: 24,
              default: true,
            },
            { label: "48 shoes per page", value: 48 },
            { label: "96 shoes per page", value: 96 },
          ]}
          classNames={{
            select: "select select-bordered select-secondary w-full",
          }}
        />

        <ClearRefinements
          classNames={{
            button: "btn btn-secondary btn-block normal-case",
            disabledButton: "btn-disabled",
          }}
          translations={{
            resetButtonText: "Clear all filters",
          }}
        />

        {/* TODO: make own UI that each RefinementList is collapsible, if possible */}
        <RefinementList
          attribute="brand_name"
          classNames={{
            item: "form-control",
            label: "flex items-center",
            labelText: "ml-1 label",
            count: "badge badge-secondary ml-auto",
            checkbox: "checkbox checkbox-secondary checkbox-sm",
          }}
        />
      </aside>

      <div className="lg:hidden">
        <button type="button" onClick={openModal} className="btn btn-secondary">
          Configuration
        </button>
      </div>

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
                <Dialog.Panel className="w-80 rounded-2xl bg-base-100 p-6 shadow-lg">
                  <Dialog.Title as="h3" className="text-xl font-semibold">
                    Refinements
                  </Dialog.Title>

                  <div className="mt-4 space-y-4">
                    <HitsPerPage
                      items={[
                        { label: "1 shoe per page", value: 1 },
                        { label: "12 shoes per page", value: 12 },
                        {
                          label: "24 shoes per page",
                          value: 24,
                          default: true,
                        },
                        { label: "48 shoes per page", value: 48 },
                        { label: "96 shoes per page", value: 96 },
                      ]}
                      classNames={{
                        select:
                          "select select-bordered select-secondary w-full",
                      }}
                    />

                    <ClearRefinements
                      classNames={{
                        button: "btn btn-secondary btn-block normal-case",
                        disabledButton: "btn-disabled",
                      }}
                      translations={{
                        resetButtonText: "Clear all filters",
                      }}
                    />

                    <RefinementList
                      attribute="brand_name"
                      classNames={{
                        item: "form-control",
                        label: "flex items-center",
                        labelText: "ml-1 label",
                        count: "badge badge-secondary ml-auto",
                        checkbox: "checkbox checkbox-secondary checkbox-sm",
                      }}
                    />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
