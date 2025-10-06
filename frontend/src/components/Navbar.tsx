import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70 backdrop-blur p-3">
      <div className="font-medium">WhatsX</div>
      <ThemeToggle />
    </div>
  );
}
