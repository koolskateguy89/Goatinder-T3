import NavTabs from "./NavTabs";
import ThemeSwitcher from "./ThemeSwitcher";

export type ContainerProps = React.PropsWithChildren<{}>;

export default function Container({ children }: ContainerProps) {
  return (
    <div>
      <div className="flex items-center justify-between px-4">
        <span />
        <NavTabs />
        <ThemeSwitcher />
      </div>
      {children}
    </div>
  );
}
