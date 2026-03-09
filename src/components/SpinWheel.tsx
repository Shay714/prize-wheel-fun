import { useRef, useEffect, useState, useCallback } from 'react';
import { Contestant } from '@/hooks/useContestants';
import { WHEEL_COLORS } from '@/lib/wheelColors';
import { Button } from '@/components/ui/button';
import { RotateCw } from 'lucide-react';

export type WheelLabel = 'name' | 'email' | 'number';

interface Props {
  contestants: Contestant[];
  label: WheelLabel;
  onWin: (contestant: Contestant) => void;
}

function getLabel(c: Contestant, idx: number, label: WheelLabel) {
  if (label === 'email') return c.email;
  if (label === 'number') return `#${idx + 1}`;
  return c.name;
}

export function SpinWheel({ contestants, label, onWin }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const animRef = useRef<number>(0);
  const rotRef = useRef(0);

  const draw = useCallback((rot: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !contestants.length) return;
    const ctx = canvas.getContext('2d')!;
    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const r = cx - 8;
    const n = contestants.length;
    const arc = (2 * Math.PI) / n;

    ctx.clearRect(0, 0, size, size);

    // Draw segments
    for (let i = 0; i < n; i++) {
      const startAngle = rot + i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Label
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(startAngle + arc / 2);
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${Math.max(10, Math.min(14, 140 / n))}px sans-serif`;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 2;
      const text = getLabel(contestants[i], i, label);
      const maxLen = 14;
      ctx.fillText(text.length > maxLen ? text.slice(0, maxLen - 1) + '…' : text, r - 12, 0);
      ctx.restore();
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, 2 * Math.PI);
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fill();
    ctx.strokeStyle = 'hsl(var(--border))';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pointer (top)
    ctx.beginPath();
    ctx.moveTo(cx - 14, 4);
    ctx.lineTo(cx + 14, 4);
    ctx.lineTo(cx, 28);
    ctx.closePath();
    ctx.fillStyle = 'hsl(var(--destructive))';
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [contestants, label]);

  useEffect(() => {
    draw(rotation);
  }, [rotation, draw]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const container = canvas.parentElement!;
      const s = Math.min(container.clientWidth, 420);
      canvas.width = s * 2;
      canvas.height = s * 2;
      canvas.style.width = `${s}px`;
      canvas.style.height = `${s}px`;
      const ctx = canvas.getContext('2d')!;
      ctx.scale(2, 2);
      draw(rotRef.current);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [draw]);

  const spin = () => {
    if (spinning || contestants.length < 2) return;
    setSpinning(true);

    const winnerIdx = Math.floor(Math.random() * contestants.length);
    const n = contestants.length;
    const arc = (2 * Math.PI) / n;
    // Target: pointer is at top (angle 0 = 3 o'clock, pointer at -π/2)
    // We want the winner segment centered at -π/2 (top)
    const targetAngle = -arc * winnerIdx - arc / 2 - Math.PI / 2;
    const fullSpins = 5 + Math.random() * 3;
    const totalRotation = fullSpins * 2 * Math.PI + (targetAngle - rotRef.current) % (2 * Math.PI) + 2 * Math.PI;

    const startRot = rotRef.current;
    const duration = 4000 + Math.random() * 1000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      // Deceleration easing
      const eased = 1 - Math.pow(1 - t, 3);
      const currentRot = startRot + totalRotation * eased;
      rotRef.current = currentRot;
      setRotation(currentRot);

      if (t < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setSpinning(false);
        onWin(contestants[winnerIdx]);
      }
    };
    animRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-[420px]">
        <canvas ref={canvasRef} className="w-full" />
      </div>
      <Button
        onClick={spin}
        disabled={spinning || contestants.length < 2}
        size="lg"
        className="gap-2 text-lg px-10 py-6 rounded-full shadow-lg"
      >
        <RotateCw className={`h-5 w-5 ${spinning ? 'animate-spin' : ''}`} />
        {spinning ? 'Spinning...' : 'Spin!'}
      </Button>
      {contestants.length < 2 && (
        <p className="text-sm text-muted-foreground">Add at least 2 contestants to spin</p>
      )}
    </div>
  );
}
