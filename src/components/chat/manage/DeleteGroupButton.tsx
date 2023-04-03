import { useRouter } from "next/router";
import clsx from "clsx";

import { api } from "utils/api";

export type DeleteGroupButtonProps = {
  id: string;
  className: string;
};

export default function DeleteGroupButton({
  id,
  className,
}: DeleteGroupButtonProps) {
  const router = useRouter();

  const deleteMut = api.chat.group.delete.useMutation();

  const handleDelete = async () => {
    // TODO: confirm delete
    await deleteMut.mutateAsync({ id });
    await router.push("/chat");
  };

  return (
    <>
      <button
        type="button"
        className={clsx(className, deleteMut.isLoading && "loading")}
        onClick={handleDelete}
        disabled={deleteMut.isLoading}
      >
        Delete
      </button>
      todo transition (dialog)
    </>
  );
}
