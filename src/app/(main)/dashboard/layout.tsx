import { ModeToggle } from '@/components/mode-toggle';
import { UserButton } from '@clerk/nextjs';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex  flex-col justify-center items-center">
      <nav className="flex justify-between items-center w-[400px] p-4">
        <p className=" font-semibold">connectUp.</p>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton />
        </div>
      </nav>
      {children}
    </main>
  );
};

export default MainLayout;
