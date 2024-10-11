import { useState } from "react";
import {
  ClearRefinements,
  HitsPerPage,
  RefinementList,
} from "react-instantsearch-hooks-web";

import SimpleTransitionDialog from "components/common/SimpleTransitionDialog";

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

      <SimpleTransitionDialog
        isOpen={isOpen}
        closeModal={closeModal}
        title="Refinements"
      >
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
      </SimpleTransitionDialog>
    </>
  );
}
