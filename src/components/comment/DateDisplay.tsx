import { FaClock } from "react-icons/fa";

const formatter = new Intl.RelativeTimeFormat("en");

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

/**
 * Returns a relative time string for the given date.
 */
function getRelativeTime(date: Date) {
  const diff = Date.now() - date.getTime();

  if (diff < 0) {
    return "in the future lmao";
  }

  if (diff < MINUTE) {
    return "just now";
  }

  if (diff > DAY) {
    return formatter.format(Math.round(-diff / DAY), "day");
  }

  if (diff > HOUR) {
    return formatter.format(Math.round(-diff / HOUR), "hour");
  }

  return formatter.format(Math.round(-diff / MINUTE), "minute");
}

export type DateDisplayProps = {
  date: Date;
};

export default function DateDisplay({ date }: DateDisplayProps) {
  const relativeTime = getRelativeTime(date);

  return (
    <div
      className="tooltip tooltip-top w-fit"
      data-tip={`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`}
    >
      <time
        dateTime={date.toISOString()}
        className="flex items-center gap-x-1.5 text-sm text-base-content/60"
      >
        <FaClock />
        <span className="sr-only">Posted</span>
        {relativeTime}
      </time>
    </div>
  );
}
