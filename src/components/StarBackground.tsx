import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  vx: number;
  vy: number;
  driftX: number;
  driftY: number;
  mass: number;
  size: number;
  opacity: number;
  baseOpacity: number;
}

export const StarBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let stars: Star[] = [];
    let mouseX = -1000;
    let mouseY = -1000;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    const initStars = () => {
      stars = [];
      const numStars = Math.floor((canvas.width * canvas.height) / 3600);

      for (let i = 0; i < numStars; i++) {
        const opacity = 0.2 + Math.random() * 0.7;
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: 0,
          vy: 0,
          driftX: (Math.random() - 0.5) * 0.25,
          driftY: (Math.random() - 0.5) * 0.25,
          mass: 0.8 + Math.random() * 0.6,
          size: 0.8 + Math.random() * 1.8,
          opacity,
          baseOpacity: opacity,
        });
      }
    };

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const isLight = document.documentElement.classList.contains('light');
      ctx.fillStyle = isLight ? '#f8fafc' : '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // ── 1. Continuous Organic Floating Drift (Never static on load) ──
        star.x += star.driftX;
        star.y += star.driftY;

        // Wrap around bounds for infinite smooth floating
        if (star.x < -20) star.x = canvas.width + 20;
        if (star.x > canvas.width + 20) star.x = -20;
        if (star.y < -20) star.y = canvas.height + 20;
        if (star.y > canvas.height + 20) star.y = -20;

        // ── 2. Runge-Kutta 4th Order (RK4) Particle Hover Physics Engine ──
        const getAcceleration = (px: number, py: number, pvx: number, pvy: number) => {
          const dx = mouseX - px;
          const dy = mouseY - py;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 105; // Tightly localized hover distance

          let ax = 0;
          let ay = 0;

          if (dist < maxDist && dist > 0.1) {
            const forceRatio = (1 - dist / maxDist);
            const force = (forceRatio * forceRatio * 8) / star.mass;
            ax = -(dx / dist) * force;
            ay = -(dy / dist) * force;
          }

          // Viscous fluid air drag
          const dragCoeff = 0.08;
          ax -= pvx * dragCoeff;
          ay -= pvy * dragCoeff;

          return { ax, ay };
        };

        // RK4 Integration Step (dt = 1.0)
        const dt = 1.0;
        const x0 = star.x;
        const y0 = star.y;
        const vx0 = star.vx;
        const vy0 = star.vy;

        // k1
        const a1 = getAcceleration(x0, y0, vx0, vy0);
        const k1_vx = a1.ax;
        const k1_vy = a1.ay;
        const k1_x = vx0;
        const k1_y = vy0;

        // k2
        const a2 = getAcceleration(x0 + 0.5 * dt * k1_x, y0 + 0.5 * dt * k1_y, vx0 + 0.5 * dt * k1_vx, vy0 + 0.5 * dt * k1_vy);
        const k2_vx = a2.ax;
        const k2_vy = a2.ay;
        const k2_x = vx0 + 0.5 * dt * k1_vx;
        const k2_y = vy0 + 0.5 * dt * k1_vy;

        // k3
        const a3 = getAcceleration(x0 + 0.5 * dt * k2_x, y0 + 0.5 * dt * k2_y, vx0 + 0.5 * dt * k2_vx, vy0 + 0.5 * dt * k2_vy);
        const k3_vx = a3.ax;
        const k3_vy = a3.ay;
        const k3_x = vx0 + 0.5 * dt * k2_vx;
        const k3_y = vy0 + 0.5 * dt * k2_vy;

        // k4
        const a4 = getAcceleration(x0 + dt * k3_x, y0 + dt * k3_y, vx0 + dt * k3_vx, vy0 + dt * k3_vy);
        const k4_vx = a4.ax;
        const k4_vy = a4.ay;
        const k4_x = vx0 + dt * k3_vx;
        const k4_y = vy0 + dt * k3_vy;

        // RK4 Weighted Average Integration
        star.vx += (dt / 6) * (k1_vx + 2 * k2_vx + 2 * k3_vx + k4_vx);
        star.vy += (dt / 6) * (k1_vy + 2 * k2_vy + 2 * k3_vy + k4_vy);

        star.x += (dt / 6) * (k1_x + 2 * k2_x + 2 * k3_x + k4_x);
        star.y += (dt / 6) * (k1_y + 2 * k2_y + 2 * k3_y + k4_y);

        // Draw particle
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? `rgba(0, 0, 0, ${star.opacity * 0.85})`
          : `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();

        // Twinkle effect
        if (Math.random() > 0.992) {
          star.opacity = star.baseOpacity * (0.5 + Math.random() * 0.5);
        }
      });

      animationFrameId = requestAnimationFrame(drawStars);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('mousemove', handleMouseMove);

    resizeCanvas();
    drawStars();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
    />
  );
};
