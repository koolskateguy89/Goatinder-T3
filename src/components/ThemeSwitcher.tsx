// react-icons
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounded] = useState(false);

  useEffect(() => setMounded(true), []);
  if (!mounted) return null;

  const handleClick = () =>
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <button
      type="button"
      aria-label="Toggle Dark Mode"
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-200 text-xl  text-neutral-800 ring-gray-300  transition-all hover:ring-2  dark:bg-neutral-600 dark:text-neutral-200"
      onClick={handleClick}
    >
      {resolvedTheme === "dark" ? (
        <MdOutlineLightMode />
      ) : (
        <MdOutlineDarkMode />
      )}
    </button>
  );
}
