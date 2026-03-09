import { useState } from 'react';
import { Contestant } from '@/hooks/useContestants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Pencil, Trash2, Shuffle, XCircle, Check, X } from 'lucide-react';

interface Props {
  contestants: Contestant[];
  onUpdate: (id: string, name: string, email: string) => void;
  onRemove: (id: string) => void;
  onShuffle: () => void;
  onClearAll: () => void;
}

export function ContestantList({ contestants, onUpdate, onRemove, onShuffle, onClearAll }: Props) {
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const startEdit = (c: Contestant) => {
    setEditId(c.id);
    setEditName(c.name);
    setEditEmail(c.email);
  };

  const saveEdit = () => {
    if (editId && editName.trim() && editEmail.trim()) {
      onUpdate(editId, editName, editEmail);
    }
    setEditId(null);
  };

  if (!contestants.length) {
    return <p className="text-muted-foreground text-center py-8">No contestants yet. Add some above!</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={onShuffle} className="gap-1">
          <Shuffle className="h-3.5 w-3.5" /> Shuffle
        </Button>
        <Button variant="outline" size="sm" onClick={onClearAll} className="gap-1 text-destructive hover:text-destructive">
          <XCircle className="h-3.5 w-3.5" /> Clear All
        </Button>
      </div>
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {contestants.map((c, i) => (
          <Card key={c.id} className="p-3 transition-all hover:shadow-md">
            {editId === c.id ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <Input value={editName} onChange={e => setEditName(e.target.value)} className="flex-1" />
                <Input value={editEmail} onChange={e => setEditEmail(e.target.value)} className="flex-1" />
                <div className="flex gap-1">
                  <Button size="icon" variant="ghost" onClick={saveEdit}><Check className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setEditId(null)}><X className="h-4 w-4" /></Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{c.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{c.email}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <Button size="icon" variant="ghost" onClick={() => startEdit(c)}><Pencil className="h-3.5 w-3.5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => onRemove(c.id)} className="text-destructive hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
