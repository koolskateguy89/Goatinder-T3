import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MdOutlineLightMode, MdOutlineDarkMode } from "react-icons/md";

export default function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  const [mounted, setMounded] = useState(false);

  useEffect(() => setMounded(true), []);

  // workaround for daisyui theme
  // https://daisyui.com/docs/themes/
  // thing is next-themes supports how they do it ([data-theme="..."]])
  // but tailwind does not.
  useEffect(() => {
    document.documentElement.dataset.theme = resolvedTheme;
  }, [resolvedTheme]);

  const checked = resolvedTheme === "light";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.checked ? "light" : "dark");
  };

  return (
    // https://daisyui.com/components/swap/
    // prettier-ignore
    <label className="navbar-icon-btn !swap motion-safe:swap-rotate">
      {mounted && (
        <>
          <span className="sr-only">Toggle Theme</span>
          <input type="checkbox" checked={checked} onChange={handleChange} />
          <MdOutlineLightMode className="swap-on" />
          <MdOutlineDarkMode className="swap-off" />
        </>
      )}
    </label>
  );
}
