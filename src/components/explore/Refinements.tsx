import { useState } from "react";
import {
  ClearRefinements,
  RefinementList,
} from "react-instantsearch-hooks-web";

import SimpleDialog from "components/common/SimpleDialog";

export default function Refinements() {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);

  const openModal = () => setIsOpen(true);

  return (
    <>
      <aside className="hidden w-1/4 gap-y-4 lg:block">
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

      <SimpleDialog
        isOpen={isOpen}
        onClose={closeModal}
        title="Refinements"
        unmount={false}
      >
        <div className="mt-4 space-y-4">
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
        </div>
      </SimpleDialog>
    </>
  );
}
