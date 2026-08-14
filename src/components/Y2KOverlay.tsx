import { motion, useScroll, useTransform } from 'framer-motion';

interface Y2KOverlayProps {
  isDark?: boolean;
  isCompiled?: boolean;
}

export const Y2KOverlay = ({ isDark = true, isCompiled = true }: Y2KOverlayProps) => {
  if (!isCompiled) return null;

  const accentColor = isDark ? '#9b5bff' : '#000000';
  const gridColor = isDark ? 'rgba(155, 91, 255, 0.4)' : 'rgba(0, 0, 0, 0.65)';

  // Scroll progress to illuminate the bottom horizon grid ONLY when approaching the end of the page
  const { scrollYProgress } = useScroll();
  const gridOpacity = useTransform(scrollYProgress, [0.45, 0.88], [0, 0.95]);

  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* ── 1. CRT Scanlines ── */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.035]"
        style={{
          backgroundImage: isDark
            ? 'repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 0px, rgba(255, 255, 255, 0.08) 1px, transparent 1px, transparent 4px)'
            : 'repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.12) 0px, rgba(0, 0, 0, 0.12) 1px, transparent 1px, transparent 4px)',
        }}
      />

      {/* ── 2. Minimalist Dot Matrix Background ── */}
      <svg className="absolute inset-0 w-full h-full opacity-40 dark:opacity-30 pointer-events-none">
        <defs>
          <pattern id="grid-dots" width="55" height="55" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.3" fill={accentColor} opacity={isDark ? 0.3 : 0.75} />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-dots)" />
      </svg>

      {/* ── 3. Celestial Planet 1: Top-Right Saturn-style Wireframe ── */}
      <div className="absolute top-[8%] right-[5%] w-64 h-64 pointer-events-none opacity-80 dark:opacity-40">
        <motion.div
          className="relative w-full h-full rounded-full border border-black/80 dark:border-purple-500/25 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 55, repeat: Infinity, ease: 'linear' }}
        >
          {/* Concentric latitude & longitude rings */}
          <div className="absolute inset-2 rounded-full border border-black/80 dark:border-cyan-400/25 transform rotate-45 scale-x-50" />
          <div className="absolute inset-4 rounded-full border border-dashed border-black/90 dark:border-purple-400/30 transform -rotate-45 scale-y-50" />
          <div className="absolute inset-8 rounded-full border border-black/70 dark:border-purple-500/20 transform rotate-12 scale-x-75" />

          {/* Saturn Equatorial Ring */}
          <div className="absolute -inset-10 rounded-[50%] border-2 border-black dark:border-cyan-400/35 transform -rotate-15 scale-y-40" />

          {/* Orbiting Satellite Dot */}
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-black dark:bg-cyan-400 shadow-[0_0_8px_#000000] dark:shadow-[0_0_8px_#5fd4ff]"
            animate={{ rotate: 360 }}
            style={{ originX: '120px', originY: '120px' }}
            transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* ── 4. Celestial Planet 2: Bottom-Left Vertical Orbit Wireframe ── */}
      <div className="absolute bottom-[18%] left-[4%] w-52 h-52 pointer-events-none opacity-70 dark:opacity-35 hidden md:block">
        <motion.div
          className="relative w-full h-full rounded-full border border-black/80 dark:border-cyan-400/25 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 65, repeat: Infinity, ease: 'linear' }}
        >
          {/* Vertical & Tilted Ellipses */}
          <div className="absolute inset-3 rounded-full border border-black/80 dark:border-purple-400/30 transform rotate-75 scale-y-60" />
          <div className="absolute inset-6 rounded-full border border-dashed border-black/90 dark:border-cyan-400/30 transform -rotate-30 scale-x-65" />
          
          {/* Outer Cross Orbital Ring */}
          <div className="absolute -inset-8 rounded-[50%] border-2 border-black dark:border-purple-400/35 transform rotate-65 scale-x-45" />

          {/* Secondary Orbiting Satellite Dot */}
          <motion.div
            className="absolute w-2.5 h-2.5 rounded-full bg-black dark:bg-purple-400 shadow-[0_0_8px_#000000] dark:shadow-[0_0_8px_#9b5bff]"
            animate={{ rotate: -360 }}
            style={{ originX: '95px', originY: '95px' }}
            transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
          />
        </motion.div>
      </div>

      {/* ── 5. Minimalist Bottom Horizon Grid (Appears ONLY on scroll down) ── */}
      <motion.div
        style={{ opacity: gridOpacity }}
        className="absolute bottom-0 left-0 w-full h-[32vh] overflow-hidden pointer-events-none"
      >
        <div
          className="absolute -inset-x-1/2 bottom-0 h-[200%] origin-bottom"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, transparent 100%)',
            backgroundImage: `
              linear-gradient(to right, ${gridColor} 1.5px, transparent 1.5px),
              linear-gradient(to bottom, ${gridColor} 1.5px, transparent 1.5px)
            `,
            backgroundSize: '55px 55px',
            transform: 'perspective(500px) rotateX(65deg)',
          }}
        />
      </motion.div>
    </div>
  );
};



