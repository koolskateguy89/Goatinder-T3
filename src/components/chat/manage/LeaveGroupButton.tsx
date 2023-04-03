import { useRouter } from "next/router";
import clsx from "clsx";

import { api } from "utils/api";

export type LeaveGroupButtonProps = {
  id: string;
  className: string;
};

export default function LeaveGroupButton({
  id,
  className,
}: LeaveGroupButtonProps) {
  const router = useRouter();

  const leaveMut = api.chat.group.leave.useMutation();

  const handleLeave = async () => {
    // TODO: confirm leave
    leaveMut.mutateAsync({ id });
    await router.push("/chat");
  };

  return (
    <>
      <button
        type="button"
        className={clsx(className, leaveMut.isLoading && "loading")}
        onClick={handleLeave}
        disabled={leaveMut.isLoading}
      >
        Leave
      </button>
      todo transition (dialog)
    </>
  );
}
