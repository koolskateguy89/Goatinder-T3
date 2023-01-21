export type CommentsListProps = {
  ordered?: boolean;
  children: React.ReactNode;
};

const className =
  "rounded-box divide-y-2 divide-base-300 ring-2 ring-base-300 dark:divide-white/10 dark:ring-white/10";

export default function CommentsList({ ordered, children }: CommentsListProps) {
  return ordered ? (
    <ol className={className}>{children}</ol>
  ) : (
    <ul className={className}>{children}</ul>
  );
}
