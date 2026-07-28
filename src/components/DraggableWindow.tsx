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
  windowClassName = 'w-[800px]',
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

  const desktopInitial = { opacity: 0, scale: 0.9, x: initialPosition.x, y: initialPosition.y };
  const desktopAnimate = { opacity: 1, scale: 1, x: initialPosition.x, y: initialPosition.y };
  const desktopExit: any = { opacity: 0, scale: 0.95, transition: { duration: 0.15 } };

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
                ? 'w-full max-h-[90vh] rounded-t-2xl'
                : `${windowClassName} rounded-2xl`
            } bg-neutral-900 border border-neutral-700 shadow-2xl flex flex-col overflow-hidden pointer-events-auto transform-gpu`}
          >
            {/* Window Header — drag handle */}
            <div
              className="h-11 bg-neutral-800/50 border-b border-neutral-700 flex items-center justify-between px-4"
              style={{ cursor: isMobile ? 'default' : 'grab' }}
              onPointerDown={(e) => { if (!isMobile) dragControls.start(e); }}
            >
              <span className="text-sm font-medium text-neutral-400">{title}</span>
              <button
                onClick={handleClose}
                className="w-6 h-6 flex items-center justify-center rounded transform-gpu"
                style={{ willChange: 'transform', transition: 'transform 0.15s ease-out' }}
                onMouseEnter={(e) => { if (!isMobile) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onMouseLeave={(e) => { if (!isMobile) e.currentTarget.style.transform = 'scale(1)'; }}
                onMouseDown={(e) => { if (!isMobile) e.currentTarget.style.transform = 'scale(0.9)'; }}
                onMouseUp={(e) => { if (!isMobile) e.currentTarget.style.transform = 'scale(1.1)'; }}
                onTouchStart={(e) => { if (isMobile) e.currentTarget.style.transform = 'scale(0.9)'; }}
                onTouchEnd={(e) => { if (isMobile) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {isMobile ? (
                  <ChevronDown size={20} className="text-neutral-400" />
                ) : (
                  <X size={16} className="text-neutral-400 hover:text-white" />
                )}
              </button>
            </div>

            {/* Sticky Header Content */}
            {stickyHeader && (
              <div className="px-8 pt-6 pb-4 flex-shrink-0">
                {stickyHeader}
              </div>
            )}

            {/* Scrollable Content */}
            <div className={`${isMobile ? 'px-4' : 'px-8'} pb-8 ${stickyHeader ? '' : isMobile ? 'pt-4' : 'pt-8 flex-1'} text-neutral-300 text-base leading-relaxed overflow-y-auto ${isMobile ? 'max-h-[calc(90vh-44px)]' : 'max-h-[60vh]'} custom-scrollbar`}>
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
