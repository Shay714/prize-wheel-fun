import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  dark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ dark, onToggle }: Props) {
  return (
    <Button variant="ghost" size="icon" onClick={onToggle} aria-label="Toggle theme">
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
}
