import { useState } from "react";
import type { User } from "@prisma/client";

import Avatar from "components/Avatar";

export interface MemberProps extends User {
  canRemove: boolean;
  onRemove?: (id: string) => PromiseLike<void>;
}

export default function Member({
  image,
  name,
  id,
  canRemove,
  onRemove,
}: MemberProps) {
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className="flex items-center gap-x-2 p-2">
      <Avatar
        image={image}
        name={name}
        className="[&>*]:w-10"
        imageProps={{
          sizes: "2.5rem",
        }}
      />
      <span>{name}</span>
      {canRemove && (
        <button
          type="button"
          className="btn-warning btn-sm btn ml-auto"
          onClick={async () => {
            // Workaround to have this button disabled while the mutation is running
            setIsDisabled(true);
            await onRemove?.(id);
            setIsDisabled(false);
          }}
          disabled={isDisabled}
        >
          Remove
        </button>
      )}
    </div>
  );
}
