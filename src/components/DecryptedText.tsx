import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import type { HTMLMotionProps } from 'motion/react';

const styles = {
  wrapper: { display: 'inline-block', whiteSpace: 'pre-wrap' as const },
  srOnly: {
    position: 'absolute' as const, width: '1px', height: '1px',
    padding: 0, margin: '-1px', overflow: 'hidden',
    clip: 'rect(0,0,0,0)', border: 0,
  },
};

interface DecryptedTextProps extends HTMLMotionProps<'span'> {
  text: string;
  speed?: number;
  maxIterations?: number;
  sequential?: boolean;
  revealDirection?: 'start' | 'end' | 'center';
  useOriginalCharsOnly?: boolean;
  characters?: string;
  className?: string;
  parentClassName?: string;
  encryptedClassName?: string;
  animateOn?: 'view' | 'hover' | 'both';
}

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  ...props
}: DecryptedTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set());
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let currentIteration = 0;

    const getNextIndex = (revealedSet: Set<number>): number => {
      const len = text.length;
      switch (revealDirection) {
        case 'start': return revealedSet.size;
        case 'end': return len - 1 - revealedSet.size;
        case 'center': {
          const mid = Math.floor(len / 2);
          const off = Math.floor(revealedSet.size / 2);
          const next = revealedSet.size % 2 === 0 ? mid + off : mid - off - 1;
          if (next >= 0 && next < len && !revealedSet.has(next)) return next;
          for (let i = 0; i < len; i++) { if (!revealedSet.has(i)) return i; }
          return 0;
        }
        default: return revealedSet.size;
      }
    };

    const availableChars = useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(c => c !== ' ')
      : characters.split('');

    const shuffleText = (orig: string, revealed: Set<number>): string => {
      if (useOriginalCharsOnly) {
        const positions = orig.split('').map((char, i) => ({
          char, isSpace: char === ' ', index: i, isRevealed: revealed.has(i),
        }));
        const pool = positions.filter(p => !p.isSpace && !p.isRevealed).map(p => p.char);
        for (let i = pool.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        let ci = 0;
        return positions.map(p => {
          if (p.isSpace) return ' ';
          if (p.isRevealed) return orig[p.index];
          return pool[ci++];
        }).join('');
      }
      return orig.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (revealed.has(i)) return orig[i];
        return availableChars[Math.floor(Math.random() * availableChars.length)];
      }).join('');
    };

    if (isHovering) {
      setIsScrambling(true);
      interval = setInterval(() => {
        setRevealedIndices(prev => {
          if (sequential) {
            if (prev.size < text.length) {
              const next = getNextIndex(prev);
              const newSet = new Set(prev);
              newSet.add(next);
              setDisplayText(shuffleText(text, newSet));
              return newSet;
            }
            clearInterval(interval);
            setIsScrambling(false);
            return prev;
          }
          setDisplayText(shuffleText(text, prev));
          currentIteration++;
          if (currentIteration >= maxIterations) {
            clearInterval(interval);
            setIsScrambling(false);
            setDisplayText(text);
          }
          return prev;
        });
      }, speed);
    } else {
      setDisplayText(text);
      setRevealedIndices(new Set());
      setIsScrambling(false);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [isHovering, text, speed, maxIterations, sequential, revealDirection, characters, useOriginalCharsOnly]);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;
    const callback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsHovering(true);
          setHasAnimated(true);
        }
      });
    };
    const observer = new IntersectionObserver(callback, { threshold: 0.1 });
    const ref = containerRef.current;
    if (ref) observer.observe(ref);
    return () => { if (ref) observer.unobserve(ref); };
  }, [animateOn, hasAnimated]);

  const hoverProps = (animateOn === 'hover' || animateOn === 'both')
    ? { onMouseEnter: () => setIsHovering(true), onMouseLeave: () => setIsHovering(false) }
    : {};

  return (
    <motion.span className={parentClassName} ref={containerRef} style={styles.wrapper} {...hoverProps} {...props}>
      <span style={styles.srOnly}>{displayText}</span>
      <span aria-hidden="true">
        {displayText.split('').map((char, index) => {
          const done = revealedIndices.has(index) || !isScrambling || !isHovering;
          return <span key={index} className={done ? className : encryptedClassName}>{char}</span>;
        })}
      </span>
    </motion.span>
  );
}
