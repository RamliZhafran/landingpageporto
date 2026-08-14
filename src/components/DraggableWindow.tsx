import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  initialPosition?: { x: number; y: number };
  isMuted?: boolean;
  windowClassName?: string;
  stickyHeader?: React.ReactNode;
  zIndex?: number;
  onFocus?: () => void;
  isMobile?: boolean;
}

export const DraggableWindow = ({
  title,
  children,
  isOpen,
  onClose,
  initialPosition = { x: 0, y: 0 },
  isMuted = false,
  windowClassName = 'w-[840px]',
  stickyHeader,
  zIndex = 50,
  onFocus,
  isMobile = false,
}: WindowProps) => {
  const dragControls = useDragControls();

  const handleClose = () => {
    if (!isMuted) {
      const audio = new Audio('/sfx/button-click-2.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.error("Audio play failed", e));
    }
    onClose();
  };

  const mobileInitial = { y: '100%', opacity: 0 };
  const mobileAnimate = { y: 0, opacity: 1 };
  const mobileExit: any = { y: '100%', opacity: 0, transition: { duration: 0.3, ease: 'easeInOut' } };

  const desktopInitial = { opacity: 0, scale: 0.96, x: initialPosition.x, y: initialPosition.y };
  const desktopAnimate = { opacity: 1, scale: 1, x: initialPosition.x, y: initialPosition.y };
  const desktopExit: any = { opacity: 0, scale: 0.96, transition: { duration: 0.15 } };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`fixed inset-0 pointer-events-none ${isMobile ? 'flex items-end' : 'flex items-center justify-center'}`}
          style={{ zIndex }}
        >
          <motion.div
            drag={!isMobile}
            dragControls={dragControls}
            dragListener={false}
            dragMomentum={false}
            dragElastic={0}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
            initial={isMobile ? mobileInitial : desktopInitial}
            animate={isMobile ? mobileAnimate : desktopAnimate}
            exit={isMobile ? mobileExit : desktopExit}
            onMouseDown={() => { if (!isMobile) onFocus?.(); }}
            onDragStart={() => {}}
            onDragEnd={() => {}}
            style={{ willChange: 'transform', transform: 'translate3d(0, 0, 0)' }}
            className={`${
              isMobile
                ? 'w-full max-h-[90vh] rounded-t-xl'
                : `${windowClassName} rounded-sm`
            } bg-neutral-900/95 dark:bg-neutral-900/95 light:bg-neutral-100/95 border-2 border-neutral-700/80 dark:border-neutral-700/80 light:border-neutral-300 shadow-2xl backdrop-blur-md flex flex-col overflow-hidden pointer-events-auto transform-gpu`}
          >
            {/* Window Header — drag handle */}
            <div
              className="h-10 bg-neutral-800/80 dark:bg-neutral-800/80 light:bg-neutral-200/90 border-b border-neutral-700/70 dark:border-neutral-700/70 light:border-neutral-300 flex items-center justify-between px-4 select-none"
              style={{ cursor: isMobile ? 'default' : 'grab' }}
              onPointerDown={(e) => { if (!isMobile) dragControls.start(e); }}
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent/80 inline-block" />
                <span className="font-mono text-xs font-semibold text-neutral-300 dark:text-neutral-300 light:text-neutral-800 tracking-wider">
                  {title}
                </span>
              </div>

              {/* Window Control */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClose}
                  aria-label="Close window"
                  className="w-5 h-5 flex items-center justify-center rounded-sm bg-neutral-700/40 hover:bg-red-500/80 text-neutral-400 hover:text-white transition-colors"
                >
                  {isMobile ? (
                    <ChevronDown size={18} />
                  ) : (
                    <X size={13} />
                  )}
                </button>
              </div>
            </div>

            {/* Sticky Header Content */}
            {stickyHeader && (
              <div className="px-6 pt-5 pb-3 flex-shrink-0">
                {stickyHeader}
              </div>
            )}

            {/* Scrollable Content */}
            <div className={`${isMobile ? 'px-4' : 'px-6'} pb-6 ${stickyHeader ? '' : isMobile ? 'pt-4' : 'pt-6 flex-1'} text-neutral-300 dark:text-neutral-300 light:text-neutral-700 text-sm leading-relaxed overflow-y-auto ${isMobile ? 'max-h-[calc(90vh-40px)]' : 'max-h-[62vh]'} custom-scrollbar`}>
              <div className="w-full">
                {children}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
