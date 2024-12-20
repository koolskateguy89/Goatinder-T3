import NavBar from "components/NavBar";

export type LayoutProps = React.PropsWithChildren;

export default function Container({ children }: LayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-30 w-full flex-none border-b border-base-300 bg-transparent backdrop-blur transition-colors dark:border-white/5">
        <NavBar />
      </div>
      {children}
    </div>
  );
}
