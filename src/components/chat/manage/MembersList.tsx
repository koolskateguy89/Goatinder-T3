export interface MembersListProps {
  children: React.ReactNode;
}

export default function MembersList({ children }: MembersListProps) {
  return (
    <ul className="rounded-box divide-y-2 divide-base-300 ring-2 ring-base-300 dark:divide-white/10 dark:ring-white/10">
      {children}
    </ul>
  );
}
