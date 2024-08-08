import { ModeToggle } from '@/components/mode-toggle';
import NavigationSidebar from '@/components/navigation/navigation-sidebar';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className=" md:flex flex-col h-full w-[72px] z-30 fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">
        {/* <nav className="flex justify-between items-center w-[400px] p-4">
        <p className=" font-semibold">connectUp.</p>
        <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton />
        </div>
        </nav> */}
        <div className="flex justify-end">
          <ModeToggle />
        </div>
        {children}
      </main>
    </>
  );
};

export default MainLayout;
