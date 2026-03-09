export function launchConfetti() {
  const container = document.createElement('div');
  container.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9999;overflow:hidden';
  document.body.appendChild(container);

  const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#FFEAA7','#DDA0DD','#F7DC6F','#BB8FCE','#82E0AA','#F0B27A','#85C1E9'];

  for (let i = 0; i < 60; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const x = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 200;
    const dur = Math.random() * 1.5 + 1.5;
    const delay = Math.random() * 0.5;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const shape = Math.random() > 0.5 ? '50%' : '0';

    el.style.cssText = `
      position:absolute;top:-10px;left:${x}%;width:${size}px;height:${size}px;
      background:${color};border-radius:${shape};opacity:1;
      animation:confetti-fall ${dur}s ${delay}s ease-out forwards;
    `;
    container.appendChild(el);
  }

  if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
      @keyframes confetti-fall {
        0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) translateX(var(--drift, 50px)) rotate(720deg); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // Set random drift per particle
  container.querySelectorAll('div').forEach(el => {
    const drift = (Math.random() - 0.5) * 200;
    el.style.setProperty('--drift', `${drift}px`);
  });

  setTimeout(() => container.remove(), 4000);
}
