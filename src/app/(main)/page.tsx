import { Button } from '@/components/ui/button';
import { UserButton } from '@clerk/nextjs';

export default function Home() {
  return (
    <main className="flex  flex-col justify-center items-center">
      <nav className="flex justify-between items-center w-[400px] p-4">
        <p>connectUp.</p>
        <UserButton />
      </nav>
      <p>Main page</p>
      <Button size="sm"> click</Button>
    </main>
  );
}
