import { useState, useCallback } from 'react';
import { useContestants, Contestant } from '@/hooks/useContestants';
import { isMuted, setMuted } from '@/lib/sounds';
import { useTheme } from '@/hooks/useTheme';
import { ThemeToggle } from '@/components/ThemeToggle';
import { ContestantForm } from '@/components/ContestantForm';
import { BulkPaste } from '@/components/BulkPaste';
import { ContestantList } from '@/components/ContestantList';
import { SpinWheel, WheelLabel } from '@/components/SpinWheel';
import { WinnerModal } from '@/components/WinnerModal';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trophy, Users, Volume2, VolumeX } from 'lucide-react';

const Index = () => {
  const { contestants, addContestant, addBulk, updateContestant, removeContestant, clearAll, shuffle, isFull, count, max } = useContestants();
  const { dark, toggle } = useTheme();
  const [label, setLabel] = useState<WheelLabel>('name');
  const [winner, setWinner] = useState<Contestant | null>(null);
  const [muted, setMutedState] = useState(isMuted);
  const toggleMute = useCallback(() => { setMuted(!muted); setMutedState(!muted); }, [muted]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
              <Trophy className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight">Private Winner Wheel Free</h1>
          </div>
          <div className="flex items-center gap-3">
            <Select value={label} onValueChange={v => setLabel(v as WheelLabel)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Full Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="number">Number</SelectItem>
              </SelectContent>
            </Select>
            <ThemeToggle dark={dark} onToggle={toggle} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Contestants */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Users className="h-5 w-5" /> Contestants
                  </CardTitle>
                  <Badge variant={isFull ? 'destructive' : 'secondary'}>
                    {count} / {max}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ContestantForm onAdd={addContestant} isFull={isFull} />
                <BulkPaste onBulkAdd={addBulk} isFull={isFull} />
              </CardContent>
            </Card>

            <ContestantList
              contestants={contestants}
              onUpdate={updateContestant}
              onRemove={removeContestant}
              onShuffle={shuffle}
              onClearAll={clearAll}
            />
          </div>

          {/* Right: Wheel */}
          <div className="flex flex-col items-center lg:sticky lg:top-24 lg:self-start">
            <Card className="w-full p-6">
              <SpinWheel contestants={contestants} label={label} onWin={setWinner} />
            </Card>
          </div>
        </div>
      </main>

      <WinnerModal winner={winner} onClose={() => setWinner(null)} />
    </div>
  );
};

export default Index;
