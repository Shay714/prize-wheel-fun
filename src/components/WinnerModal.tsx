import { useEffect } from 'react';
import { Contestant } from '@/hooks/useContestants';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { launchConfetti } from '@/lib/confetti';

interface Props {
  winner: Contestant | null;
  onClose: () => void;
}

export function WinnerModal({ winner, onClose }: Props) {
  useEffect(() => {
    if (winner) launchConfetti();
  }, [winner]);

  return (
    <Dialog open={!!winner} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-md text-center">
        <DialogHeader className="items-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
            <Trophy className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-2xl">🎉 We Have a Winner!</DialogTitle>
        </DialogHeader>
        {winner && (
          <div className="space-y-3 py-4">
            {winner.name && <p className="text-3xl font-bold text-primary">{winner.name}</p>}
            {winner.email && <p className="text-lg text-muted-foreground">{winner.email}</p>}
            {!winner.name && !winner.email && <p className="text-xl text-muted-foreground">Unknown contestant</p>}
          </div>
        )}
        <Button onClick={onClose} className="w-full">Close</Button>
      </DialogContent>
    </Dialog>
  );
}
