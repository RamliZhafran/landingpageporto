import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls, useReducedMotion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface TerminalGateProps {
  isMuted: boolean;
  onComplete: () => void;
  /** Change this value to reset the gate back to its initial state. */
  resetKey?: number;
}

const TAP_TARGET = 3;
const STEP_LABELS = ['compiling…', 'linking…', 'build succeeded ✓'];

// ─── KUSTOMISASI ────────────────────────────────────────────────────────
// Baris yang muncul setelah build succeeded, sebelum scroll ke projects.
const POST_BUILD_LINES = ['resolving 3 modules…', 'generating tree…', 'ready.'];
// ─────────────────────────────────────────────────────────────────────────

const POST_BUILD_LINE_MS = 480;
const POST_BUILD_HOLD_MS = 500;

export const TerminalGate = ({ isMuted, onComplete, resetKey = 0 }: TerminalGateProps) => {
  const [taps, setTaps] = useState(0);
  const [postBuildStep, setPostBuildStep] = useState(-1); // -1 = not started
  const [sequenceDone, setSequenceDone] = useState(false);
  const done = taps >= TAP_TARGET;
  const controls = useAnimationControls();
  const prefersReducedMotion = useReducedMotion();

  // Reset all internal state when resetKey changes
  useEffect(() => {
    setTaps(0);
    setPostBuildStep(-1);
    setSequenceDone(false);
  }, [resetKey]);

  const handleTap = () => {
    if (done) return;
    const next = taps + 1;
    setTaps(next);

    if (!isMuted) {
      const audio = new Audio('/sfx/button-click-1.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    }

    if (!prefersReducedMotion) {
      controls.start({ scale: [1, 1.08, 1], transition: { duration: 0.28, ease: 'easeOut' } });
    }
  };

  // Once the build "succeeds", run a short animated log before handing off.
  useEffect(() => {
    if (!done) return;
    if (prefersReducedMotion) {
      setSequenceDone(true);
      onComplete();
      return;
    }
    const holdTimer = setTimeout(() => setPostBuildStep(0), POST_BUILD_HOLD_MS);
    return () => clearTimeout(holdTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  useEffect(() => {
    if (postBuildStep < 0) return;
    if (postBuildStep < POST_BUILD_LINES.length - 1) {
      const t = setTimeout(() => setPostBuildStep((s) => s + 1), POST_BUILD_LINE_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setSequenceDone(true);
      onComplete();
    }, POST_BUILD_LINE_MS + 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postBuildStep]);

  const label = done
    ? postBuildStep >= 0
      ? POST_BUILD_LINES[postBuildStep]
      : STEP_LABELS[STEP_LABELS.length - 1]
    : taps === 0
      ? 'initialize_projects()'
      : STEP_LABELS[taps - 1];
  const filled = '■'.repeat(taps);
  const empty = '□'.repeat(TAP_TARGET - taps);

  return (
    <div className="flex flex-col items-center gap-2.5 select-none">
      <motion.p
        initial={false}
        animate={{ opacity: taps === 0 ? 1 : 0, height: taps === 0 ? 'auto' : 0 }}
        transition={{ duration: 0.25 }}
        className="text-xs text-neutral-600 overflow-hidden"
      >
        tap a few times to compile
      </motion.p>

      <div className="relative">
        {/* Ring burst on success, white only */}
        <AnimatePresence>
          {done && !prefersReducedMotion && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  aria-hidden="true"
                  className="absolute inset-0 rounded-lg border border-white pointer-events-none"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.5 + i * 0.25 }}
                  transition={{ duration: 1, ease: 'easeOut', delay: i * 0.25 }}
                />
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          animate={controls}
          onClick={handleTap}
          disabled={done}
          aria-live="polite"
          aria-label={done ? 'Build succeeded. Scrolling to projects.' : `Tap to compile. ${taps} of ${TAP_TARGET}.`}
          className="relative font-mono text-xs sm:text-sm text-neutral-500 light:text-neutral-600 hover:text-neutral-200 light:hover:text-neutral-900 disabled:cursor-default border border-neutral-800 light:border-slate-300 hover:border-neutral-600 light:hover:border-accent rounded-lg px-5 py-3 bg-neutral-900/40 light:bg-white/80 backdrop-blur-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <div className="flex items-center justify-center gap-2">
            <span className="text-neutral-700 light:text-neutral-400">{'>'}</span>
            <span className={done ? 'text-white light:text-neutral-900 font-bold' : ''}>{label}</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px] tracking-widest">
            <span className="text-white light:text-neutral-900">{filled}</span>
            <span className="text-neutral-700 light:text-neutral-400">{empty}</span>
          </div>
        </motion.button>
      </div>

      <motion.a
        href="#projects"
        onClick={(e) => {
          e.preventDefault();
          onComplete();
        }}
        initial={false}
        animate={{ opacity: sequenceDone ? 1 : 0, height: sequenceDone ? 'auto' : 0 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-1.5 font-mono text-xs text-neutral-500 hover:text-white transition-colors overflow-hidden"
      >
        cd ./projects <ChevronDown size={14} className={prefersReducedMotion ? '' : 'animate-bounce'} />
      </motion.a>
    </div>
  );
};
