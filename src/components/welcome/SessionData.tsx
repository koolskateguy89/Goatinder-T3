import { useSession } from "next-auth/react";
import { Disclosure, Transition } from "@headlessui/react";
import { HiChevronDown } from "react-icons/hi";

export default function SessionData() {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const session = useSession().data!;
  const sessionJsonLines = JSON.stringify(session, null, 2).split("\n");

  return (
    <Disclosure
      as="section"
      className="rounded-box bg-neutral px-4 text-neutral-content"
    >
      <Disclosure.Button className="flex w-full items-center justify-between py-4">
        <span className="text-xl font-medium">
          Click to see your session data
        </span>
        <HiChevronDown className="text-2xl transition-transform duration-300 ui-open:rotate-180" />
      </Disclosure.Button>

      <Transition
        // idrk why clip-path works but it does (it basically just clips the element while it's transitioning it's height)
        // I thought I needed to transition the clip-path - tried it and it didn't work, but this does so :shrug:
        enter="transition-all duration-300 ease-in [clip-path:inset(0_0_0_0)]"
        enterFrom="max-h-0 opacity-0"
        enterTo="max-h-96 opacity-100"
        leave="transition-all duration-300 ease-out [clip-path:inset(0_0_0_0)]"
        leaveFrom="max-h-96 opacity-100"
        leaveTo="max-h-0 opacity-0"
      >
        <Disclosure.Panel className="mockup-code pt-1">
          <pre data-prefix=">">
            <code>console.log(JSON.stringify(session, null, 2));</code>
          </pre>
          {sessionJsonLines.map((line) => (
            <pre key={line} data-prefix="-">
              <code>{line}</code>
            </pre>
          ))}
        </Disclosure.Panel>
      </Transition>
    </Disclosure>
  );
}
