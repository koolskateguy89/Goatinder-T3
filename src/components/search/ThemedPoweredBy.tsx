import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { PoweredBy } from "react-instantsearch-hooks-web";

export default function ThemedPoweredBy() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <PoweredBy
      classNames={{
        root: "-mb-2",
        link: "btn btn-ghost",
        logo: "h-4 w-auto",
      }}
      theme={mounted ? (resolvedTheme as "light" | "dark") : undefined}
    />
  );
}
