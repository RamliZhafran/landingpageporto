import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface LoadingScreenProps {
  onDone?: () => void;
}

// ─── KUSTOMISASI ────────────────────────────────────────────────────────
// Ganti baris boot di bawah kalau mau. Baris terakhir otomatis jadi
// warna aksen + kursor berkedip.
const BOOT_LINES = [
  'booting ramlizhafran.os',
  'mounting ~/space',
  'connecting lanyard.ws … ok',
  'painting stars … ok',
  'ready',
];
// ─────────────────────────────────────────────────────────────────────────

const LINE_DELAY_MS = 170;
const HOLD_MS = 320;
const FADE_MS = 450;

export const LoadingScreen = ({ onDone }: LoadingScreenProps) => {
  const prefersReducedMotion = useReducedMotion();
  const [visibleLines, setVisibleLines] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // Reduced motion: skip the animated boot log, just a quick blink and out.
  useEffect(() => {
    if (!prefersReducedMotion) return;
    setIsExiting(true);
    const t = setTimeout(() => {
      setIsDone(true);
      onDone?.();
    }, 200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  useEffect(() => {
    if (prefersReducedMotion) return;
    if (visibleLines < BOOT_LINES.length) {
      const t = setTimeout(() => setVisibleLines((v) => v + 1), LINE_DELAY_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIsExiting(true), HOLD_MS);
    return () => clearTimeout(t);
  }, [visibleLines, prefersReducedMotion]);

  useEffect(() => {
    if (!isExiting || prefersReducedMotion) return;
    const t = setTimeout(() => {
      setIsDone(true);
      onDone?.();
    }, FADE_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isExiting]);

  if (isDone) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-neutral-950"
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: 'easeInOut' }}
      aria-hidden="true"
    >
      <div className="font-mono text-sm sm:text-base text-neutral-500 w-full max-w-xs px-6 space-y-1.5">
        {BOOT_LINES.slice(0, visibleLines).map((line, i) => {
          const isLast = i === BOOT_LINES.length - 1;
          return (
            <div key={line} className={isLast ? 'text-accent' : undefined}>
              <span className="text-neutral-700">{'>'} </span>
              {line}
              {isLast && (
                <span className="inline-block w-2 h-4 bg-accent ml-1 align-middle animate-blink" />
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};
