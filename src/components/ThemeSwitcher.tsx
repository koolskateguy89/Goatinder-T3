import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import clsx from "clsx";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // can't just check mounted inside button because then it will
  // show dark icon when reloading in light mode
  if (!mounted)
    return <button type="button" className="navbar-icon-btn" aria-hidden />;

  const active = resolvedTheme === "light";

  const handleClick = () => {
    setTheme(active ? "dark" : "light");
  };

  return (
    // https://daisyui.com/components/swap/
    <button
      type="button"
      onClick={handleClick}
      className={clsx(
        "navbar-icon-btn swap grid motion-safe:swap-rotate",
        resolvedTheme === "light" && "swap-active",
      )}
      aria-label="Toggle Theme"
    >
      <MdOutlineLightMode className="swap-on" />
      <MdOutlineDarkMode className="swap-off" />
    </button>
  );
}
