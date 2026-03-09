import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ClipboardPaste } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  onBulkAdd: (entries: { name: string; email: string }[]) => { added: number; skipped: number };
  isFull: boolean;
}

export function BulkPaste({ onBulkAdd, isFull }: Props) {
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);

  const handleAdd = () => {
    const lines = text.split('\n').filter(l => l.trim());
    const entries: { name: string; email: string }[] = [];
    for (const line of lines) {
      const parts = line.split(/[,\t]/).map(s => s.trim());
      if (parts.length >= 2 && parts[0] && parts[1]) {
        entries.push({ name: parts[0], email: parts[1] });
      }
    }
    if (!entries.length) {
      toast.error('No valid entries found. Use "Name, Email" per line.');
      return;
    }
    const { added, skipped } = onBulkAdd(entries);
    toast.success(`Added ${added} contestant${added !== 1 ? 's' : ''}${skipped ? `, ${skipped} skipped (limit)` : ''}`);
    setText('');
  };

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full justify-between">
          <span className="flex items-center gap-2">
            <ClipboardPaste className="h-4 w-4" /> Bulk Paste
          </span>
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 space-y-3">
        <Textarea
          placeholder={"Paste contestants (one per line):\nJohn Doe, john@email.com\nJane Smith, jane@email.com"}
          value={text}
          onChange={e => setText(e.target.value)}
          rows={5}
          disabled={isFull}
        />
        <Button onClick={handleAdd} disabled={isFull || !text.trim()} size="sm" className="gap-2">
          <ClipboardPaste className="h-4 w-4" /> Add All
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}
