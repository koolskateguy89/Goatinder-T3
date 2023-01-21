import NavBar from "components/NavBar";

export type ContainerProps = React.PropsWithChildren;

export default function Container({ children }: ContainerProps) {
  return (
    <>
      <div className="sticky top-0 z-40 w-full flex-none border-b border-base-300 bg-transparent backdrop-blur transition-colors dark:border-white/5 lg:z-50">
        <NavBar />
      </div>
      {children}
    </>
  );
}
