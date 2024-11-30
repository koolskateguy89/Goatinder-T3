import { useId, useState } from "react";
import { useRouter } from "next/router";
import { Tab } from "@headlessui/react";

import { api } from "utils/api";
import SimpleTransitionDialog from "components/common/SimpleTransitionDialog";
import InputLoadingSpinner from "components/common/InputLoadingSpinner";

const SELECT_A_USER = "Select a user";

/**
 * User just selects another user to message. No mutation is done.
 */
function PrivateMessagePanel({
  onSubmit,
}: {
  onSubmit: (userId: string) => Promise<void>;
}) {
  const { data: users } = api.user.getAllOtherUsers.useQuery();

  const [selectedUserId, setSelectedUserId] = useState(SELECT_A_USER);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (selectedUserId !== SELECT_A_USER) await onSubmit(selectedUserId);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="flex">
        <select
          name="userId"
          className="select select-bordered w-full max-w-sm"
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
          disabled={!users}
        >
          <option disabled>{SELECT_A_USER}</option>
          {users?.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>

        <InputLoadingSpinner loading={!users} className="-left-12" />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={!users || selectedUserId === SELECT_A_USER}
      >
        Message
      </button>
    </form>
  );
}

/**
 * Handles creating the group chat with name, image, and members.
 */
function NewGroupChatPanel({
  onNewGroupChat,
}: {
  onNewGroupChat: (id: string) => Promise<void>;
}) {
  const nameId = useId();
  const imageId = useId();

  const [gcName, setGcName] = useState("");
  const [gcImage, setGcImage] = useState("");

  const newGroupChatMut = api.chat.group.createNew.useMutation();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const name = gcName.trim();
    const image = gcImage.trim();

    if (!name) return;
    // if (!image) return;

    // FIXME handle when image is not valid url
    // server validates that image URL is valid
    try {
      const { id } = await newGroupChatMut.mutateAsync({ name, image });
      await onNewGroupChat(id);
    } catch (error) {
      console.log("error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="form-control">
        <label htmlFor={nameId} className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          id={nameId}
          type="text"
          className="input input-bordered"
          value={gcName}
          onChange={(e) => setGcName(e.target.value)}
        />
      </div>

      <div className="form-control">
        <label htmlFor={imageId} className="label">
          <span className="label-text">Icon</span>
        </label>
        <input
          id={imageId}
          type="text"
          className="input input-bordered"
          value={gcImage}
          onChange={(e) => setGcImage(e.target.value)}
        />
      </div>

      {/* TODO: members */}

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={
          newGroupChatMut.isLoading || gcName.trim().length === 0
          // || gcImage.trim().length === 0
        }
      >
        {newGroupChatMut.isLoading ? <span className="loading" /> : "Create"}
      </button>
    </form>
  );
}

export type NewChatButtonProps = {
  className: string;
};

export default function NewChatButton({ className }: NewChatButtonProps) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handlePrivateMessageSubmit = async (userId: string) => {
    closeModal();
    await router.push(`/chat/${userId}`);
  };

  const handleNewGroupChat = async (id: string) => {
    closeModal();
    await router.push(`/chat/${id}/manage`);
  };

  return (
    <>
      {/* TODO: icon */}
      <button
        type="button"
        onClick={openModal}
        className={className}
        aria-label="New Chat"
      >
        +
      </button>

      <Tab.Group>
        <SimpleTransitionDialog
          isOpen={isOpen}
          closeModal={closeModal}
          panelClassName="w-96"
          title={
            <Tab.List className="tabs">
              <Tab className="tab tab-bordered basis-1/2 ui-selected:tab-active">
                Private Message
              </Tab>
              <Tab className="tab tab-bordered basis-1/2 ui-selected:tab-active">
                New Group Chat
              </Tab>
            </Tab.List>
          }
        >
          <Tab.Panels className="mt-2">
            <Tab.Panel>
              <PrivateMessagePanel onSubmit={handlePrivateMessageSubmit} />
            </Tab.Panel>
            <Tab.Panel>
              <NewGroupChatPanel onNewGroupChat={handleNewGroupChat} />
            </Tab.Panel>
          </Tab.Panels>
        </SimpleTransitionDialog>
      </Tab.Group>
    </>
  );
}
