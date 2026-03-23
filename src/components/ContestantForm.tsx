import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

interface Props {
  onAdd: (name: string, email: string) => string | null;
  isFull: boolean;
}

export function ContestantForm({ onAdd, isFull }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !email.trim()) {
      setError('Please enter at least a name or email.');
      return;
    }
    const result = onAdd(name, email);
    if (result) {
      setError(result);
    } else {
      setName('');
      setEmail('');
      setError('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          placeholder="Full name (optional)"
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isFull}
          className="min-w-0"
        />
        <Input
          placeholder="Email address (optional)"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          disabled={isFull}
          className="min-w-0"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      {isFull && (
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          🎉 You've reached the maximum of 20 contestants!
        </p>
      )}
      <Button type="submit" disabled={isFull} className="w-full sm:w-auto gap-2">
        <UserPlus className="h-4 w-4" /> Add Contestant
      </Button>
    </form>
  );
}
