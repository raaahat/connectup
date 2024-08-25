import { ModeToggle } from '@/components/mode-toggle';
import NavigationSidebar from '@/components/navigation/navigation-sidebar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="hidden md:flex flex-col h-full w-[72px] z-30 fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">{children}</main>
    </>
  );
};

export default MainLayout;
