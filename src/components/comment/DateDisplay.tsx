export type DateDisplayProps = {
  date: Date;
};

export default function DateDisplay({ date }: DateDisplayProps) {
  return (
    <div
      className="tooltip tooltip-top w-fit"
      data-tip={date.toLocaleDateString()}
    >
      <time
        dateTime={date.toISOString()}
        className="space-x-1 text-sm text-base-content/60"
      >
        {/* TODO: clock/time icon, react-icons? */}
        <span aria-hidden>🕒</span>
        <span className="sr-only">Posted on</span>
        {/* TODO: make it relative date & time */}
        <span>{date.toLocaleTimeString()}</span>
        <span>{date.toLocaleDateString()}</span>
      </time>
    </div>
  );
}
