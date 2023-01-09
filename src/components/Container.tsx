import NavBar from "components/NavBar";

export type ContainerProps = React.PropsWithChildren;

export default function Container({ children }: ContainerProps) {
  return (
    <div>
      <div
        // daisy:
        // className="sticky top-0 z-30 flex max-h-16 w-full justify-center bg-base-200 bg-opacity-30 text-base-content shadow-sm backdrop-blur transition-all duration-100"
        // TODO: use colours from daisyUI
        // tailwind: (SLIGHTLY customised to actually blur on light)
        className="sticky top-0 z-40 w-full flex-none border-b border-slate-900/10 bg-transparent backdrop-blur transition-colors dark:border-slate-50/[0.06] dark:bg-transparent lg:z-50"
        // tailwind no customisation
        // className="sticky top-0 z-40 w-full flex-none bg-white backdrop-blur transition-colors duration-500 dark:border-slate-50/[0.06] dark:bg-slate-900/75 lg:z-50 lg:border-b lg:border-slate-900/10"
      >
        <NavBar />
      </div>
      <div className="mx-6 my-1">{children}</div>
    </div>
  );
}
