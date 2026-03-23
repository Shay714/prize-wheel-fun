const MUTE_KEY = 'pwwf-muted';

let muted = localStorage.getItem(MUTE_KEY) === 'true';

export function isMuted() { return muted; }

export function setMuted(v: boolean) {
  muted = v;
  localStorage.setItem(MUTE_KEY, String(v));
}

const ctx = () => new (window.AudioContext || (window as any).webkitAudioContext)();

export function playTickSound() {
  if (muted) return;
  try {
    const ac = ctx();
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.type = 'sine';
    osc.frequency.value = 800 + Math.random() * 400;
    gain.gain.setValueAtTime(0.15, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.05);
    osc.start();
    osc.stop(ac.currentTime + 0.05);
  } catch {}
}

export function playWinnerSound() {
  if (muted) return;
  try {
    const ac = ctx();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = ac.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.2, start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.4);
      osc.start(start);
      osc.stop(start + 0.4);
    });
  } catch {}
}
