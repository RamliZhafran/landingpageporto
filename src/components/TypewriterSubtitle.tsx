import { useState, useEffect } from 'react';

interface TypewriterSubtitleProps {
  phrases?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseTime?: number;
  className?: string;
}

export const TypewriterSubtitle = ({
  phrases = [
    'welcome to a quiet ordinary space',
    'Jack of all trades engineer',
  ],
  typingSpeed = 55,
  deletingSpeed = 35,
  pauseTime = 2500,
  className = '',
}: TypewriterSubtitleProps) => {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const targetPhrase = phrases[phraseIndex];
    const nextPhrase = phrases[(phraseIndex + 1) % phrases.length];
    
    // Calculate common prefix length so we don't erase shared words (e.g., "Jack of all trades ")
    let commonPrefixLength = 0;
    while (
      commonPrefixLength < targetPhrase.length &&
      commonPrefixLength < nextPhrase.length &&
      targetPhrase[commonPrefixLength] === nextPhrase[commonPrefixLength]
    ) {
      commonPrefixLength++;
    }

    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting && currentText.length < targetPhrase.length) {
      // Type forward letter by letter
      timer = setTimeout(() => {
        setCurrentText(targetPhrase.slice(0, currentText.length + 1));
      }, typingSpeed);
    } else if (!isDeleting && currentText.length === targetPhrase.length) {
      // Pause at full phrase before backspacing
      timer = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && currentText.length > commonPrefixLength) {
      // Backspace ONLY down to the common prefix (preserving "Jack of all trades ")
      timer = setTimeout(() => {
        setCurrentText(targetPhrase.slice(0, currentText.length - 1));
      }, deletingSpeed);
    } else if (isDeleting && currentText.length <= commonPrefixLength) {
      // Move to next phrase and start typing suffix
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, phraseIndex, phrases, typingSpeed, deletingSpeed, pauseTime]);

  return (
    <div className={`w-full max-w-[340px] sm:max-w-[440px] mx-auto flex items-center justify-start text-left font-mono ${className}`}>
      <span className="text-neutral-500 dark:text-neutral-500 light:text-neutral-900 font-bold mr-2 select-none shrink-0">&gt;</span>
      <span className="inline-block tracking-normal min-w-[1px] text-neutral-400 dark:text-neutral-400 light:text-neutral-900 font-semibold">{currentText}</span>
      <span className="inline-block w-2 h-4 sm:w-2.5 sm:h-5 bg-accent ml-1 align-middle animate-blink shrink-0" />
    </div>
  );
};
