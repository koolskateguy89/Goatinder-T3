import { useEffect, useRef, useState } from "react";

import { api } from "utils/api";

export type EditableNameProps = {
  canEdit: boolean;
  id: string;
  name: string;
  beforeNameChange?: (name: string) => void;
  afterNameChange?: (name: string) => void;
};

export default function EditableName({
  canEdit,
  id,
  name,
  beforeNameChange,
  afterNameChange,
}: EditableNameProps) {
  const [newName, setNewName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const editMut = api.chat.group.update.useMutation();

  const changeName = () => {
    if (newName === name) return;

    if (!newName) return;

    beforeNameChange?.(newName);

    editMut.mutate(
      { id, name: newName },
      {
        onSuccess() {
          afterNameChange?.(newName);
        },
      }
    );
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  return canEdit && isEditing ? (
    // TODO: editable controls - maybe not, kinda cba
    <input
      type="text"
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      onBlur={() => {
        setIsEditing(false);
        changeName();
      }}
      ref={inputRef}
      className="input-bordered input"
    />
  ) : (
    <h1
      className="text-2xl font-semibold underline"
      onClick={() => {
        if (canEdit) setIsEditing(true);
      }}
    >
      {name}
    </h1>
  );
}
