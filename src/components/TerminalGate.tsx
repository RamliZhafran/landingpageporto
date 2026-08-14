import { useState } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';

interface TerminalGateProps {
  isMuted: boolean;
  onComplete: () => void;
}

const SCENE_LINES = [
  'wake ./projects',
  'rendering tree paths',
  'opening portal',
];

export const TerminalGate = ({ isMuted, onComplete }: TerminalGateProps) => {
  const [isOpening, setIsOpening] = useState(false);
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  const handleTap = () => {
    if (isOpening) return;
    setIsOpening(true);

    if (!isMuted) {
      const audio = new Audio('/sfx/button-click-1.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    if (!prefersReducedMotion) {
      controls.start({
        scale: [1, 1.02, 0.98, 1],
        y: [0, -4, 4, 0],
        transition: { duration: 0.55, ease: 'easeInOut' },
      });
    }

    window.setTimeout(() => {
      onComplete();
      window.setTimeout(() => setIsOpening(false), 550);
    }, prefersReducedMotion ? 0 : 1050);
  };

  return (
    <div className="flex w-full max-w-sm flex-col items-center select-none sm:max-w-md">
      <motion.button
        type="button"
        animate={controls}
        onClick={handleTap}
        disabled={isOpening}
        aria-live="polite"
        aria-label="Tap once to open projects."
        className="group relative w-full overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 text-left font-mono text-xs text-neutral-500 shadow-2xl backdrop-blur-md transition-colors hover:border-neutral-700 hover:text-neutral-300 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:text-sm"
      >
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-accent/80"
          initial={false}
          animate={{ scaleX: isOpening ? 1 : 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          style={{ originX: 0 }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(163,230,53,0.18),transparent_55%)] opacity-0 transition-opacity group-hover:opacity-100" />

        <div className="relative flex items-center gap-2 border-b border-neutral-800 pb-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 text-[11px] text-neutral-600">compile.scene</span>
        </div>

        <div className="relative mt-4 min-h-24 space-y-2">
          {!isOpening ? (
            <>
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-neutral-700">{'>'}</span>
                <span>compile&#123;&#125;</span>
                <span className="h-4 w-2 bg-accent animate-blink" />
              </div>
              <div className="text-[11px] text-neutral-600">awaiting input …</div>
            </>
          ) : (
            <>
              {SCENE_LINES.map((line, index) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.18, duration: 0.25 }}
                  className={index === SCENE_LINES.length - 1 ? 'text-accent' : 'text-neutral-400'}
                >
                  <span className="text-neutral-700">{'>'} </span>
                  {line}
                  {index === SCENE_LINES.length - 1 && <span className="ml-1 animate-blink">_</span>}
                </motion.div>
              ))}
              <motion.div
                className="mt-3 h-12 rounded-b-full border-x border-b border-accent/30 bg-gradient-to-b from-accent/20 to-transparent blur-sm"
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.45, duration: 0.35 }}
              />
            </>
          )}
        </div>
      </motion.button>
    </div>
  );
};
